import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

// Get user from localStorage
const storedUser = JSON.parse(localStorage.getItem('user'));

const initialState = {
    user: storedUser ? storedUser.user : null,
    token: storedUser ? storedUser.accessToken : null,
    loading: false,
    error: null,
};

// Async thunk để xử lý logic đăng nhập
export const loginUser = createAsyncThunk(
    'user/login',
    async (userData, thunkAPI) => {
        try {
            return await authService.login(userData.email, userData.password);
        } catch (error) {
            const message = error.response?.data?.error || error.message || 'Đăng nhập thất bại';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Action để reset trạng thái loading và error
        reset: (state) => {
            state.loading = false;
            state.error = null;
        },
        // Action để logout
        logout: (state) => {
            authService.logout(); // Xóa khỏi localStorage
            state.user = null;
            state.token = null;
            state.loading = false;
            state.error = null;
        },
        // Action để cập nhật user, hữu ích khi refresh token
        setUser: (state, action) => {
            const { user, accessToken, refreshToken } = action.payload;
            state.user = user;
            state.token = accessToken;
            // Cập nhật lại localStorage
            localStorage.setItem('user', JSON.stringify({ user, accessToken, refreshToken }));
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.accessToken;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Lấy thông báo lỗi từ rejectWithValue
                state.user = null;
                state.token = null;
            });
    },
});

// Export các actions từ reducers để các component khác có thể dispatch
export const { reset, logout, setUser } = userSlice.actions;

// Export reducer để thêm vào store
export default userSlice.reducer;
