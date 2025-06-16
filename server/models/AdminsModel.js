const mongoose = require('mongoose');
const {normalizeVieText} = require("../utils/normalize");

const adminSchema = new mongoose.Schema({
    full_name: { type: String, required: true },
    phone_number: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    avatar_url: { type: String },
    date_of_birth: { type: Date, required: true },
    gender: { type: String, required: true },
    role: { type: String, required: true },
    status: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null }
});

adminSchema.index({ full_name: 1 });

module.exports = mongoose.model('Admin', adminSchema);