const mongoose = require('mongoose');
const {normalizeVieText} = require("../utils/normalize");

const tourSchema = new mongoose.Schema({
    tour_code: { type: String, required: true },
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
    starting_province: { type: String },
    destination_province: { type: String },
    region: { type: String },
    transportation: { type: String },
    additional_services: [{
        service_id: { type: String, required: true },
        type: { type: String },
        name: { type: String, required: true },
        price: { type: Number, required: true }
    }],
    representative_price: {
        adult: { type: Number, required: true },
        discounted_price: { type: Number }
    },
    departure_summary: [{
        departure_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Departure', required: true },
        departure_date: { type: Date, required: true }
    }],
    average_rating: { type: Number },
    total_slots_booked: { type: Number, default: 0 },
    is_bestseller: { type: Boolean, default: false },
    created_by: {
        admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
        name: { type: String, required: true }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null }
});

tourSchema.index({ name: 1 });

// Hook để hash mật khẩu
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Phương thức so sánh mật khẩu
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Tour', tourSchema);