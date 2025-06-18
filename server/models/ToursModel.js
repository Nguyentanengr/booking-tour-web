const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    tourCode: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    images: [{ type: String }],
    description: { type: String, required: false },
    services: [{ type: String }],
    itinerary: [{
        order: { type: Number, required: false },
        title: { type: String, required: false },
        description: { type: String, required: false }
    }],
    policies: {
        transportation: { type: String },
        cancellation: { type: String },
        booking: { type: String },
        refund: { type: String }
    },
    duration: { type: String, required: true },
    startingProvince: { type: String, ref: 'Province' },
    destinationProvince: { type: String, ref: 'Province' },
    region: { type: String, ref: 'Region' },
    transportation: { type: String },
    additionalServices: [{
        serviceId: { type: String, required: false },
        type: { type: String },
        name: { type: String, required: false },
        price: { type: Number, required: false }
    }],
    representativePrice: {
        adult: { type: Number, required: false },
        discountedPrice: { type: Number }
    },
    departureSummary: [{
        departureId: { type: mongoose.Schema.Types.ObjectId, ref: 'Departure', required: false },
        departureDate: { type: Date, required: false }
    }],
    averageRating: { type: Number, default: 0 },
    totalSlotsBooked: { type: Number, default: 0 },
    isBestseller: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }, 
    createdBy: {
        adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: false },
        name: { type: String, required: false }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null }
});

tourSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

module.exports = mongoose.model('Tour', tourSchema);