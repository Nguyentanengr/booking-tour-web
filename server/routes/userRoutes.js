const express = require('express');
const router = express.Router();
const {getUserProfile, updateUserProfile, getFavoriteTours, getTourHistory, addFavoriteTour, removeFavoriteTour} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware'); // Giả sử middleware xác thực là 'protect'

// Các API cần đăng nhập cho người dùng hiện tại (me)
router.get('/me', authMiddleware(), getUserProfile); // Lấy thông tin profile của người dùng hiện tại
router.put('/me', authMiddleware(), updateUserProfile); // Cập nhật thông tin profile của người dùng hiện tại
router.get('/me/favorite-tours', authMiddleware(), getFavoriteTours); // Lấy danh sách tour yêu thích của người dùng
router.post('/me/favorite-tours/:tourId', authMiddleware(), addFavoriteTour); // Thêm tour vào danh sách yêu thích
router.delete('/me/favorite-tours/:tourId', authMiddleware(), removeFavoriteTour); // Xóa tour khỏi danh sách yêu thích
router.get('/me/tour-history', authMiddleware(), getTourHistory); // Lấy lịch sử tour của người dùng


module.exports = router;