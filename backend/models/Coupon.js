const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: [true, 'Discount type is required'],
  },
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: [0, 'Discount value cannot be negative'],
  },
  minOrder: {
    type: Number,
    default: 0,
  },
  maxDiscount: {
    type: Number,
    default: 0,
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
  },
  usageLimit: {
    type: Number,
    default: 0,
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

couponSchema.index({ active: 1, endDate: 1 });

couponSchema.methods.isValid = function () {
  const now = new Date();
  if (!this.active) return false;
  if (now < this.startDate || now > this.endDate) return false;
  if (this.usageLimit > 0 && this.usedCount >= this.usageLimit) return false;
  return true;
};

couponSchema.methods.calculateDiscount = function (orderTotal) {
  if (!this.isValid()) return 0;
  if (orderTotal < this.minOrder) return 0;

  let discount = 0;
  if (this.discountType === 'percentage') {
    discount = (orderTotal * this.discountValue) / 100;
  } else {
    discount = this.discountValue;
  }

  if (this.maxDiscount > 0 && discount > this.maxDiscount) {
    discount = this.maxDiscount;
  }

  return Math.min(discount, orderTotal);
};

module.exports = mongoose.model('Coupon', couponSchema);
