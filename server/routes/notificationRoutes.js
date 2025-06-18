const express = require('express');
const router = express.Router();
const {getNotifications, markNotificationAsRead, getUnreadNotificationsCount} = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/me', authMiddleware(), getNotifications); // Lấy thông báo của người dùng hiện tại
router.patch('/:id/read', authMiddleware(), markNotificationAsRead); // Đánh dấu thông báo là đã đọc
router.get('/me/unread-count', authMiddleware(), getUnreadNotificationsCount);
module.exports = router;