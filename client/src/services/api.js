// src/services/api.js

import axios from 'axios';
// Import 'store' trực tiếp để truy cập state ngoài component React
import { store } from '../redux/store'; 
// Import action để cập nhật lại state
import { setUser, logout } from '../redux/slices/userSlice'; 

const api = axios.create({
    baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * --- Interceptor 1: Gửi Request ---
 * Tự động thêm Access Token vào header của mọi request gửi đi
 */
api.interceptors.request.use(
    (config) => {
        // Lấy thông tin user từ Redux store
        const user = store.getState().user;
        if (user && user.accessToken) {
            config.headers['Authorization'] = 'Bearer ' + user.accessToken;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


/**
 * --- Interceptor 2: Xử Lý Response ---
 * Xử lý các lỗi, đặc biệt là lỗi 401 (Unauthorized) khi Access Token hết hạn
 * Tự động gọi API để làm mới token và thử lại request đã thất bại.
 */

// Biến để quản lý trạng thái làm mới token, tránh gọi refresh nhiều lần
let isRefreshing = false;
// Hàng đợi chứa các request thất bại trong lúc đang làm mới token
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Chỉ xử lý khi lỗi là 401 và request đó chưa được thử lại
        if (error.response?.status === 401 && !originalRequest._retry) {
            
            // Nếu đang trong quá trình làm mới token, đẩy request vào hàng đợi
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                .then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return api(originalRequest);
                })
                .catch(err => {
                    return Promise.reject(err);
                });
            }

            // Đánh dấu là đã thử lại
            originalRequest._retry = true;
            isRefreshing = true;

            const user = store.getState().user;
            if (user && user.refreshToken) {
                try {
                    // Gọi API để làm mới token
                    const rs = await api.post('/auth/refresh-token', { refreshToken: user.refreshToken });
                    
                    // Backend trả về: { success: true, data: { accessToken: '...' } }
                    // Dữ liệu trong `rs.data` sẽ là: { success: true, data: { accessToken: '...' } }
                    const newAccessToken = rs.data.data.accessToken;

                    // Tạo dữ liệu user mới với accessToken mới
                    const newUser = { ...user, accessToken: newAccessToken };
                    
                    // Cập nhật state trong Redux (việc này cũng sẽ tự động cập nhật localStorage)
                    store.dispatch(setUser(newUser));

                    // Cập nhật header mặc định cho các request sau này
                    api.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
                    
                    // Xử lý các request trong hàng đợi với token mới
                    processQueue(null, newAccessToken);

                    // Thực hiện lại request ban đầu đã thất bại với token mới
                    return api(originalRequest);

                } catch (_error) {
                    // Nếu làm mới token thất bại (refresh token hết hạn hoặc không hợp lệ)
                    processQueue(_error, null);
                    store.dispatch(logout()); // Dispatch action logout
                    window.location.href = '/dang-nhap'; // Chuyển hướng về trang đăng nhập
                    return Promise.reject(_error);
                } finally {
                    isRefreshing = false;
                }
            } else {
                 // Nếu không có refresh token, logout luôn
                 store.dispatch(logout());
                 window.location.href = '/dang-nhap';
            }
        }

        return Promise.reject(error);
    }
);

export default api;
