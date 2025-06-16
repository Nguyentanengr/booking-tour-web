const mongoose = require('mongoose');
const {normalizeVieText} = require("../utils/normalize");

const bookingSchema = new mongoose.Schema({
    user: {
        user_id: { type: String, required: true },
        avatar_url: { type: String },
        name: { type: String, required: true },
        deleted_at: { type: Date }
    },
    tour_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
    departure_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Departure', required: true },
    passengers: [{
        full_name: { type: String, required: true },
        date_of_birth: { type: Date, required: true },
        gender: { type: String, required: true },
        phone_number: { type: String },
        type: { type: String, required: true },
        price: { type: Number, required: true }
    }],
    additional_services: [{
        service_id: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }
    }],
    total_price: { type: Number, required: true },
    status: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null }
});

bookingSchema.index({ tour_id: 1 });

module.exports = mongoose.model('Booking', bookingSchema);