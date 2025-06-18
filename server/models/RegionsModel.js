// models/region.model.js
const mongoose = require('mongoose');

const regionSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null }
});

regionSchema.index({ _id: 1 });


module.exports = mongoose.model('Region', regionSchema);