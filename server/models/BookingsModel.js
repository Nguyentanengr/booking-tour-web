const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        userId: { type: String, required: true },
        avatarUrl: { type: String },
        name: { type: String, required: true },
        deletedAt: { type: Date }
    },
    tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
    departureId: { type: mongoose.Schema.Types.ObjectId, ref: 'Departure', required: true },
    passengers: [{
        fullName: { type: String, required: true },
        dateOfBirth: { type: Date, required: true },
        gender: { type: String, required: true },
        phoneNumber: { type: String },
        type: { type: String, required: true },
        price: { type: Number, required: true }
    }],
    additionalServices: [{
        serviceId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }
    }],
    totalPrice: { type: Number, required: true },
    status: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null }
});

bookingSchema.index({ tourId: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
