const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  tourCode: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  description: String,
  images: [String],
  duration: String,
  startingProvince: { type: mongoose.Schema.Types.ObjectId, ref: 'Province', required: true },
  destinationProvince: { type: mongoose.Schema.Types.ObjectId, ref: 'Province', required: true },
  transportation: { type: String, enum: ['plane', 'bus', 'car', 'train', 'ship'], required: true },
  representativePrice: {
    adult: Number,
    child: Number,
    senior: Number,
    discountedPrice: Number
  },
  additionalServices: [{
    serviceId: String,
    name: String,
    description: String,
    price: Number
  }],
  averageRating: { type: Number, default: 0 },
  totalSlotsBooked: { type: Number, default: 0 },
  isBestseller: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null }
});

tourSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

module.exports = mongoose.model('Tour', tourSchema);