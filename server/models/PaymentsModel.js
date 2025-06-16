const mongoose = require('mongoose');
const {normalizeVieText} = require("../utils/normalize");

const paymentSchema = new mongoose.Schema({
    booking_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    cancellation_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cancellation' },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    payment_method: { type: String, required: true },
    transaction_id: { type: String, required: true },
    status: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null }
});

paymentSchema.index({ transaction_id: 1 });

module.exports = mongoose.model('Payment', paymentSchema);