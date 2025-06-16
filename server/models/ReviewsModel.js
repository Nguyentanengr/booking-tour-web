const mongoose = require('mongoose');
const {normalizeVieText} = require("../utils/normalize");

const reviewSchema = new mongoose.Schema({
    tour_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
    user: {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        avatar_url: { type: String }
    },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    images: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null }
});

reviewSchema.index({ tour_id: 1 });

module.exports = mongoose.model('Review', reviewSchema);