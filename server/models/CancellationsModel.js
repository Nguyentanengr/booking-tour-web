const mongoose = require('mongoose');

const cancellationSchema = new mongoose.Schema({
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    user: {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true }
    },
    tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
    tourCode: { type: String, required: true },
    cancellationReason: { type: String, required: true },
    refundAmount: { type: Number, required: true },
    status: { type: String, required: true },
    approvedBy: {
        adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
        name: { type: String }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null }
});

cancellationSchema.index({ bookingId: 1 });

module.exports = mongoose.model('Cancellation', cancellationSchema);
