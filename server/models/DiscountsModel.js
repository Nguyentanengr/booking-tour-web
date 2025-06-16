const mongoose = require('mongoose');
const {normalizeVieText} = require("../utils/normalize");

const discountSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    min_people: { type: Number, required: true },
    discount_percentage: { type: Number },
    discount_amount: { type: Number },
    tour_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tour' }],
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    status: { type: String, required: true },
    created_by: {
        admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
        name: { type: String, required: true }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null }
});

discountSchema.index({ name: 1 });

module.exports = mongoose.model('Discount', discountSchema);