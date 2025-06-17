// server/models/Admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    full_name: { type: String, required: true },
    phone_number: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }, // Mật khẩu không được trả về mặc định
    avatar_url: { type: String },
    date_of_birth: { type: Date },
    gender: { type: String },
    role: { type: String, default: 'admin' }, // Vai trò mặc định
    status: { type: String, default: 'active' },
}, { timestamps: true });

// Hook để hash mật khẩu trước khi lưu
adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Phương thức so sánh mật khẩu
adminSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);