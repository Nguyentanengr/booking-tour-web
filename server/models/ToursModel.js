const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    tourCode: { type: String, required: true },
    name: { type: String, required: true },
    images: [{ type: String }],
    description: { type: String, required: true },
    services: [{ type: String }],
    itinerary: [{
        order: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true }
    }],
    policies: {
        transportation: { type: String },
        cancellation: { type: String },
        booking: { type: String },
        refund: { type: String }
    },
    duration: { type: String, required: true },
    startingProvince: { type: String },
    destinationProvince: { type: String },
    region: { type: String },
    transportation: { type: String },
    additionalServices: [{
        serviceId: { type: String, required: true },
        type: { type: String },
        name: { type: String, required: true },
        price: { type: Number, required: true }
    }],
    representativePrice: {
        adult: { type: Number, required: true },
        discountedPrice: { type: Number }
    },
    departureSummary: [{
        departureId: { type: mongoose.Schema.Types.ObjectId, ref: 'Departure', required: true },
        departureDate: { type: Date, required: true }
    }],
    averageRating: { type: Number },
    totalSlotsBooked: { type: Number, default: 0 },
    isBestseller: { type: Boolean, default: false },
    createdBy: {
        adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
        name: { type: String, required: true }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null }
});

tourSchema.index({ name: 1 });

module.exports = mongoose.model('Tour', tourSchema);
