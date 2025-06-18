// models/refundPolicy.model.js
const mongoose = require('mongoose');

const refundPolicySchema = new mongoose.Schema({
    daysBeforeDeparture: { type: Number, required: true },
    refundPercentage: { type: Number, required: true },
    description: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null }
});

refundPolicySchema.index({ daysBeforeDeparture: 1 });
refundPolicySchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

module.exports = mongoose.model('RefundPolicy', refundPolicySchema);