// models/admin.model.js
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatarUrl: { type: String },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, required: true },
    role: { type: String, required: true },
    status: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null }
});

adminSchema.index({ fullName: 'text' });

module.exports = mongoose.model('Admin', adminSchema);