const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  image: { type: String, default: '' },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  mrp: { type: Number, required: true },
  price: { type: Number, required: true },
  gstPercentage: { type: Number, default: 18 },
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderId: {
    type: String,
    unique: true,
  },
  items: [orderItemSchema],
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  status: {
    type: String,
    enum: [
      'placed', 'confirmed', 'packed', 'shipped',
      'in_transit', 'out_for_delivery', 'delivered',
      'cancelled', 'return_requested', 'return_completed',
    ],
    default: 'placed',
  },
  statusHistory: [{
    status: String,
    date: { type: Date, default: Date.now },
    note: { type: String, default: '' },
  }],
  paymentMethod: {
    type: String,
    enum: ['cod', 'online', 'upi'],
    default: 'cod',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  gstTotal: { type: Number, default: 0 },
  deliveryCharge: { type: Number, default: 0 },
  total: { type: Number, required: true },
  coupon: {
    code: { type: String, default: '' },
    discount: { type: Number, default: 0 },
  },
  notes: { type: String, default: '' },
}, {
  timestamps: true,
});

orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

orderSchema.pre('save', function (next) {
  if (!this.orderId) {
    const prefix = 'RC';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.orderId = `${prefix}${timestamp}${random}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
