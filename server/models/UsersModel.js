// models/user.model.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatarUrl: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String, required: true },
    tourHistory: [{
        tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
        departureId: { type: mongoose.Schema.Types.ObjectId, ref: 'Departure', required: true },
        bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
        status: { type: String, required: true }
    }],
    favoriteTours: [{
        tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true }
    }],
    status: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null }
});

userSchema.index({ fullName: 'text' });
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

userSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

userSchema.post('findOneAndUpdate', async function(doc, next) {
    if (doc) {
        await Review.updateMany(
            { 'user.userId': doc._id },
            { $set: { 'user.name': doc.fullName, 'user.avatarUrl': doc.avatarUrl } }
        );

        await Booking.updateMany(
            { 'user.userId': doc._id, status: { $ne: 'completed' } },
            { $set: { 'user.name': doc.fullName, 'user.avatarUrl': doc.avatarUrl } }
        );
    }
    next();
});
module.exports = mongoose.model('User', userSchema);