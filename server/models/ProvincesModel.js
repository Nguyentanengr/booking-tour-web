// models/province.model.js
const mongoose = require('mongoose');

const provinceSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    description: { type: String, required: true },
    region: { type: String, ref: 'Region' },
    images: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null }
});

provinceSchema.index({ _id: 1 });

module.exports = mongoose.model('Province', provinceSchema);