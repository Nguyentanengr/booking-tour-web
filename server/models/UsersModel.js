const mongoose = require('mongoose');
const {normalizeVieText} = require("../utils/normalize");

const userSchema = new mongoose.Schema({
    full_name: { type: String, required: true },
    phone_number: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar_url: { type: String },
    date_of_birth: { type: Date, required: true },
    gender: { type: String, required: true },
    tour_history: [{
        tour_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
        departure_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Departure', required: true },
        booking_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
        status: { type: String, required: true }
    }],
    favorite_tours: [{
        tour_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true }
    }],
    status: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null }
});

userSchema.index({ full_name: 1 });

module.exports = mongoose.model('User', userSchema);