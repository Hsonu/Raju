const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  businessName: {
    type: String,
    default: 'Riddhi Computer',
  },
  tagline: {
    type: String,
    default: 'Your Trusted Laptop & Computer Partner',
  },
  phone: {
    type: String,
    default: '',
  },
  whatsapp: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
  },
  address: {
    line1: { type: String, default: 'Shop No 12, Sai Aangan CHS' },
    line2: { type: String, default: 'Plot No. 44, Sector 35D' },
    city: { type: String, default: 'Kharghar' },
    district: { type: String, default: 'Navi Mumbai' },
    state: { type: String, default: 'Maharashtra' },
    pincode: { type: String, default: '410210' },
  },
  socialLinks: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    youtube: { type: String, default: '' },
    linkedin: { type: String, default: '' },
  },
  deliveryCharge: {
    type: Number,
    default: 0,
  },
  freeDeliveryAbove: {
    type: Number,
    default: 0,
  },
  gstNumber: {
    type: String,
    default: '',
  },
  metaTitle: {
    type: String,
    default: 'Riddhi Computer — Laptop Sales & Repair Services in Kharghar, Navi Mumbai',
  },
  metaDescription: {
    type: String,
    default: 'Buy laptops, computers, accessories and get professional repair services at Riddhi Computer, Kharghar, Navi Mumbai.',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Settings', settingsSchema);
