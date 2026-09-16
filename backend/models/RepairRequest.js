const mongoose = require('mongoose');

const repairRequestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: '',
  },
  deviceType: {
    type: String,
    enum: ['laptop', 'desktop', 'other'],
    required: [true, 'Device type is required'],
  },
  brand: {
    type: String,
    trim: true,
    default: '',
  },
  model: {
    type: String,
    trim: true,
    default: '',
  },
  problem: {
    type: String,
    required: [true, 'Problem description is required'],
  },
  serviceRequired: {
    type: String,
    enum: [
      'laptop_repair', 'desktop_repair', 'screen_replacement',
      'keyboard_replacement', 'battery_replacement', 'ssd_upgrade',
      'ram_upgrade', 'windows_installation', 'software_installation',
      'virus_removal', 'laptop_cleaning', 'thermal_paste',
      'data_transfer', 'hardware_diagnosis', 'home_visit', 'other',
    ],
    required: [true, 'Service type is required'],
  },
  preferredDate: {
    type: Date,
    default: null,
  },
  preferredTime: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  homeVisit: {
    type: Boolean,
    default: false,
  },
  additionalNotes: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: [
      'request_received', 'under_review', 'technician_assigned',
      'device_received', 'diagnosis', 'estimate_sent',
      'repair_in_progress', 'ready_for_delivery', 'completed', 'cancelled',
    ],
    default: 'request_received',
  },
  statusHistory: [{
    status: String,
    date: { type: Date, default: Date.now },
    note: { type: String, default: '' },
  }],
  technician: {
    type: String,
    default: '',
  },
  estimatedCost: {
    type: Number,
    default: 0,
  },
  finalCost: {
    type: Number,
    default: 0,
  },
  adminNotes: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

repairRequestSchema.index({ status: 1 });
repairRequestSchema.index({ user: 1 });
repairRequestSchema.index({ mobile: 1 });
repairRequestSchema.index({ createdAt: -1 });

repairRequestSchema.pre('save', function (next) {
  if (!this.requestId) {
    const prefix = 'RPR';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    this.requestId = `${prefix}${timestamp}${random}`;
  }
  next();
});

module.exports = mongoose.model('RepairRequest', repairRequestSchema);
