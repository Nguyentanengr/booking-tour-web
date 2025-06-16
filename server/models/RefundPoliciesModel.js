const mongoose = require('mongoose');
const {normalizeVieText} = require("../utils/normalize");

const refundPolicySchema = new mongoose.Schema({
    days_before_departure: { type: Number, required: true },
    refund_percentage: { type: Number, required: true },
    description: { type: String, required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null }
});

refundPolicySchema.index({ days_before_departure: 1 });

module.exports = mongoose.model('RefundPolicy', refundPolicySchema);