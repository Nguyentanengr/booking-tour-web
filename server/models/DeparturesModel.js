const mongoose = require('mongoose');
const {normalizeVieText} = require("../utils/normalize");

const departureSchema = new mongoose.Schema({
    tour_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
    expiration_date: { type: Date, required: true },
    departure_date: { type: Date, required: true },
    return_date: { type: Date, required: true },
    prices: {
        adult: { type: Number, required: true },
        child: { type: Number },
        senior: { type: Number }
    },
    available_slots: { type: Number, required: true },
    status: { type: String, required: true },
    created_by: {
        admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
        name: { type: String, required: true }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null }
});

departureSchema.index({ tour_id: 1 });

module.exports = mongoose.model('Departure', departureSchema);