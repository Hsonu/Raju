const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Banner title is required'],
    trim: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  image: {
    url: { type: String, required: [true, 'Banner image is required'] },
    publicId: { type: String, default: '' },
  },
  ctaText: {
    type: String,
    default: 'Shop Now',
  },
  ctaLink: {
    type: String,
    default: '/products',
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

bannerSchema.index({ status: 1, order: 1 });

module.exports = mongoose.model('Banner', bannerSchema);
