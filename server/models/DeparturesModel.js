const mongoose = require('mongoose');

const departureSchema = new mongoose.Schema({
    tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
    expirationDate: { type: Date, required: true },
    departureDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    prices: {
        adult: { type: Number, required: true },
        child: { type: Number },
        senior: { type: Number }
    },
    availableSlots: { type: Number, required: true },
    status: { type: String, required: true },
    createdBy: {
        adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
        name: { type: String, required: true }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null }
});

departureSchema.index({ tourId: 1 });

module.exports = mongoose.model('Departure', departureSchema);
