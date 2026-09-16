const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Video title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    enum: ['chip-level', 'screen', 'thermal', 'software', 'custom-pc', 'general'],
    default: 'chip-level',
  },
  videoUrl: {
    type: String,
    required: [true, 'Video URL is required'],
    trim: true,
  },
  thumbnailUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80',
  },
  badgeText: {
    type: String,
    default: '4K TECH LAB LIVE',
  },
  telemetryStats: {
    type: String,
    default: '45X Stereo Microscope • 380°C BGA Heat Flow',
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
  },
  order: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Video', videoSchema);
