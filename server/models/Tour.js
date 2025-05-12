const mongoose = require('mongoose');
const {normalizeVieText} = require("../utils/normalize");

const tourSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    services: [{ type: String }],
    departurePoint: { type: String },
    destination: { type: String },
    price: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null },
})

// Thêm index cho titleNormalized để tìm kiếm nhanh hơn
tourSchema.index({ title: 1 });

module.exports = mongoose.model('Tour', tourSchema);