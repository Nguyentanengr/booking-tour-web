const Notification = require('../models/NotificationsModel');
const User = require('../models/UsersModel');

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;

    const query = {
      recipientId: userId, // Updated to camelCase
      recipientType: "user", // Updated to camelCase
      deletedAt: null // Updated to camelCase
    };

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 }) // Updated to camelCase
      .skip(skip)
      .limit(limit);

    const totalCount = await Notification.countDocuments(query);

    res.status(200).json({
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      totalNotifications: totalCount,
      notifications
    });
  } catch (error) {
    console.error("Error getting notifications:", error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.userId;

    const result = await Notification.updateOne(
      {
        _id: notificationId,
        recipientId: userId, // Updated to camelCase
        deletedAt: null // Updated to camelCase
      },
      { $set: { status: "read" } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Notification not found or not authorized' });
    }

    if (result.modifiedCount === 0) {
      return res.status(200).json({ message: 'Notification already marked as read or no changes made' });
    }

    res.status(200).json({ message: 'Notification marked as read successfully' });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const getUnreadNotificationsCount = async (req, res) => {
  try {
    const userId = req.user._id; // Lấy ID người dùng từ token sau khi xác thực

    const unreadCount = await Notification.countDocuments({
      recipientType: 'user',
      recipientId: userId,
      status: 'unread',
    });

    res.status(200).json({ unreadCount });

  } catch (error) {
    console.error("Error getting unread notifications count:", error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = {
        getNotifications,
      markNotificationAsRead,
      getUnreadNotificationsCount
}