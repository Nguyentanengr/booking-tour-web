// models/discount.model.js
const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    minPeople: { type: Number, required: true },
    discountPercentage: { type: Number },
    discountAmount: { type: Number },
    tourIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tour' }],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, required: true },
    createdBy: {
        adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
        name: { type: String, required: true }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null }
});

discountSchema.index({ name: 'text' });

module.exports = mongoose.model('Discount', discountSchema);