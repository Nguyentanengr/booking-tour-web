// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    full_name: { type: String, required: true },
    phone_number: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    avatar_url: { type: String },
    date_of_birth: { type: Date },
    gender: { type: String },
    role: { type: String, default: 'user' },
    status: { type: String, default: 'active' },
    // Thêm các trường social login nếu cần
    googleId: { type: String },
    facebookId: { type: String },
}, { timestamps: true });

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