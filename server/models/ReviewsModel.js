const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
    user: {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        avatarUrl: { type: String }
    },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    images: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null }
});

reviewSchema.index({ tourId: 1 });

module.exports = mongoose.model('Review', reviewSchema);
