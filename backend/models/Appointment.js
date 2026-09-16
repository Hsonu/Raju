const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  repairRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RepairRequest',
    default: null,
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
  },
  email: {
    type: String,
    default: '',
  },
  serviceType: {
    type: String,
    required: [true, 'Service type is required'],
  },
  date: {
    type: Date,
    required: [true, 'Appointment date is required'],
  },
  timeSlot: {
    type: String,
    required: [true, 'Time slot is required'],
  },
  address: {
    type: String,
    default: '',
  },
  homeVisit: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rescheduled'],
    default: 'scheduled',
  },
  notes: {
    type: String,
    default: '',
  },
  technician: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

appointmentSchema.index({ date: 1, status: 1 });
appointmentSchema.index({ user: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
