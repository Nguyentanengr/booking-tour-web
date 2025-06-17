const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipientType: { type: String, required: true },
    recipientId: { type: mongoose.Schema.Types.ObjectId, required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null }
});

notificationSchema.index({ title: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
