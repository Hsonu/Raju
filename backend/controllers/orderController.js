const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Coupon = require('../models/Coupon');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Create new order (with backend price recalculation)
// @route   POST /api/orders
exports.createOrder = asyncHandler(async (req, res) => {
  const {
    shippingAddress,
    paymentMethod,
    couponCode,
    notes,
    items: bodyItems,
    deliveryCharge: bodyDeliveryCharge
  } = req.body;

  // Determine items to order: from req.body.items OR user's DB cart
  let itemsToProcess = [];
  if (bodyItems && Array.isArray(bodyItems) && bodyItems.length > 0) {
    for (const bi of bodyItems) {
      const prodId = bi.product?._id || bi.product || bi.productId;
      if (!prodId) continue;
      const product = await Product.findById(prodId);
      if (product) {
        itemsToProcess.push({
          product,
          quantity: Math.max(1, Number(bi.quantity) || 1),
          price: bi.price
        });
      }
    }
  } else {
    // Fallback to user's cart in DB
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (cart && cart.items && cart.items.length > 0) {
      itemsToProcess = cart.items;
    }
  }

  if (!itemsToProcess || itemsToProcess.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart is empty or products not found' });
  }

  // Recalculate prices from DB (never trust frontend values)
  let subtotal = 0;
  let gstTotal = 0;
  const orderItems = [];

  for (const item of itemsToProcess) {
    const product = item.product;
    if (!product || product.status !== 'active') {
      return res.status(400).json({ success: false, message: `Product "${product?.name || 'Unknown'}" is not available` });
    }

    const qty = Math.max(1, Number(item.quantity) || 1);
    const price = product.sellingPrice || product.mrp || 0;
    const itemTotal = price * qty;
    const gstPercentage = product.gstPercentage || 18;
    const gstAmount = (itemTotal * gstPercentage) / (100 + gstPercentage);

    subtotal += itemTotal;
    gstTotal += gstAmount;

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.thumbnail?.url || (product.images?.[0]?.url || ''),
      quantity: qty,
      mrp: product.mrp || price,
      price: price,
      gstPercentage: gstPercentage,
    });
  }

  // Apply coupon
  let discount = 0;
  let couponData = { code: '', discount: 0 };
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    if (coupon && coupon.isValid()) {
      discount = coupon.calculateDiscount(subtotal);
      couponData = { code: coupon.code, discount };
      coupon.usedCount += 1;
      await coupon.save();
    }
  }

  const deliveryCharge = bodyDeliveryCharge !== undefined ? Number(bodyDeliveryCharge) : 0;
  const total = Math.max(0, subtotal - discount + deliveryCharge);

  // Create order
  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress: {
      fullName: shippingAddress?.fullName || req.user.name || 'Customer',
      phone: shippingAddress?.phone || req.user.phone || '',
      email: shippingAddress?.email || req.user.email || '',
      address: shippingAddress?.address || '',
      city: shippingAddress?.city || '',
      state: shippingAddress?.state || '',
      pincode: shippingAddress?.pincode || '',
    },
    paymentMethod: paymentMethod || 'cod',
    paymentStatus: paymentMethod === 'online' ? 'pending' : 'pending',
    subtotal: Math.round(subtotal * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    gstTotal: Math.round(gstTotal * 100) / 100,
    deliveryCharge: Math.round(deliveryCharge * 100) / 100,
    total: Math.round(total * 100) / 100,
    coupon: couponData,
    notes: notes || '',
    status: 'placed',
    statusHistory: [{ status: 'placed', note: 'Order placed successfully', date: new Date() }],
  });

  // Decrease stock safely
  for (const item of orderItems) {
    try {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stockQuantity: -item.quantity },
      });
    } catch (e) {
      // ignore
    }
  }

  // Clear DB cart if present
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  } catch (e) {
    // ignore
  }

  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    order: {
      _id: order._id,
      orderId: order.orderId,
      total: order.total,
      status: order.status,
      paymentMethod: order.paymentMethod,
    },
  });
});

// @desc    Get user's orders
// @route   GET /api/orders
exports.getMyOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const total = await Order.countDocuments({ user: req.user._id });
  const orders = await Order.find({ user: req.user._id })
    .populate('items.product')
    .sort('-createdAt')
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({ success: true, total, orders });
});

// @desc    Get order by orderId or _id
// @route   GET /api/orders/:orderId
exports.getOrder = asyncHandler(async (req, res) => {
  const paramId = req.params.orderId;
  const isObjectId = mongoose.Types.ObjectId.isValid(paramId);
  const query = isObjectId ? { $or: [{ orderId: paramId }, { _id: paramId }] } : { orderId: paramId };

  const order = await Order.findOne(query).populate('items.product').populate('user', 'name email phone');
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  // Customers can only see their own orders
  const orderUserId = order.user?._id ? order.user._id.toString() : order.user?.toString();
  if (req.user.role !== 'admin' && orderUserId !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }

  res.status(200).json({ success: true, order });
});

// @desc    Track order (public with orderId or _id)
// @route   GET /api/orders/track/:orderId
exports.trackOrder = asyncHandler(async (req, res) => {
  const paramId = req.params.orderId;
  const isObjectId = mongoose.Types.ObjectId.isValid(paramId);
  const query = isObjectId ? { $or: [{ orderId: paramId }, { _id: paramId }] } : { orderId: paramId };

  const order = await Order.findOne(query)
    .select('orderId status statusHistory items shippingAddress total createdAt');

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  res.status(200).json({ success: true, order });
});

// @desc    Get all orders (admin)
// @route   GET /api/orders/admin/all
exports.getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, search, sort = '-createdAt' } = req.query;
  const query = {};

  if (status) query.status = status;
  if (search) {
    query.$or = [
      { orderId: { $regex: search, $options: 'i' } },
      { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
      { 'shippingAddress.phone': { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate('user', 'name email phone')
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({ success: true, total, totalPages: Math.ceil(total / Number(limit)), orders });
});

// @desc    Update order status (admin)
// @route   PUT /api/orders/:orderId/status
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const order = await Order.findOne({ orderId: req.params.orderId });

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  order.status = status;
  order.statusHistory.push({ status, note: note || '', date: new Date() });

  if (status === 'delivered') {
    order.paymentStatus = 'paid';
  }

  await order.save();

  res.status(200).json({ success: true, message: 'Order status updated', order });
});

// @desc    Cancel order
// @route   PUT /api/orders/:orderId/cancel
exports.cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ orderId: req.params.orderId });
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  if (['delivered', 'cancelled'].includes(order.status)) {
    return res.status(400).json({ success: false, message: 'Cannot cancel this order' });
  }

  // Restore stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stockQuantity: item.quantity },
    });
  }

  order.status = 'cancelled';
  order.statusHistory.push({ status: 'cancelled', note: req.body.reason || 'Order cancelled' });
  await order.save();

  res.status(200).json({ success: true, message: 'Order cancelled', order });
});
