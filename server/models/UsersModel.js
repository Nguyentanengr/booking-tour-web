const mongoose = require('mongoose');
const {normalizeVieText} = require("../utils/normalize");
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    full_name: { type: String, required: true },
    phone_number: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar_url: { type: String },
    date_of_birth: { type: Date},
    gender: { type: String, required: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
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

module.exports = mongoose.model('User', userSchema);