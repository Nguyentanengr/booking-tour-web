// booking-tour-web - Copy/client/src/services/authService.js
import axios from 'axios';

const API_URL = '/api/v1/auth';

const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.data.accessToken) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data.data;
};

const register = async (userData) => {
    return await axios.post(`${API_URL}/register`, userData);
};

const logout = () => {
    localStorage.removeItem('user');
};

const forgotPassword = async (email) => {
    return await axios.post(`${API_URL}/forgot-password`, { email });
};

const verifyOtp = async (email, otp) => {
    return await axios.post(`${API_URL}/verify-otp`, { email, otp });
};

const resetPassword = async (email, otp, newPassword) => {
    return await axios.post(`${API_URL}/reset-password`, { email, otp, newPassword });
};

const refreshToken = async (token) => {
    return await axios.post(`${API_URL}/refresh-token`, { refreshToken: token });
};

const authService = {
    login,
    register,
    logout,
    forgotPassword,
    verifyOtp,
    resetPassword,
    refreshToken,
};

export default authService;