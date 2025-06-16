const mongoose = require('mongoose');
const {normalizeVieText} = require("../utils/normalize");

const cancellationSchema = new mongoose.Schema({
    booking_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    user: {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true }
    },
    tour_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
    tour_code: { type: String, required: true },
    cancellation_reason: { type: String, required: true },
    refund_amount: { type: Number, required: true },
    status: { type: String, required: true },
    approved_by: {
        admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
        name: { type: String }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null }
});

cancellationSchema.index({ booking_id: 1 });

module.exports = mongoose.model('Cancellation', cancellationSchema);