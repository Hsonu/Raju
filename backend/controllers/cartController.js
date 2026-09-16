const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Get user cart
// @route   GET /api/cart
exports.getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'items.product',
    select: 'name slug brand images thumbnail mrp sellingPrice gstPercentage stockQuantity status',
  });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  // Filter out unavailable products
  cart.items = cart.items.filter(item => item.product && item.product.status === 'active');

  // Calculate totals
  let subtotal = 0;
  let totalMrp = 0;
  let totalGst = 0;

  const cartItems = cart.items.map(item => {
    const p = item.product;
    const itemTotal = p.sellingPrice * item.quantity;
    const mrpTotal = p.mrp * item.quantity;
    const gst = (itemTotal * p.gstPercentage) / (100 + p.gstPercentage);

    subtotal += itemTotal;
    totalMrp += mrpTotal;
    totalGst += gst;

    return {
      _id: item._id,
      product: p,
      quantity: item.quantity,
      itemTotal,
    };
  });

  res.status(200).json({
    success: true,
    cart: {
      items: cartItems,
      itemCount: cartItems.length,
      subtotal: Math.round(subtotal * 100) / 100,
      totalMrp: Math.round(totalMrp * 100) / 100,
      discount: Math.round((totalMrp - subtotal) * 100) / 100,
      gst: Math.round(totalGst * 100) / 100,
      total: Math.round(subtotal * 100) / 100,
    },
  });
});

// @desc    Add item to cart
// @route   POST /api/cart
exports.addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product || product.status !== 'active') {
    return res.status(404).json({ success: false, message: 'Product not available' });
  }

  if (product.stockQuantity < quantity) {
    return res.status(400).json({ success: false, message: 'Insufficient stock' });
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const existingItem = cart.items.find(item => item.product.toString() === productId);

  if (existingItem) {
    const newQty = existingItem.quantity + Number(quantity);
    if (newQty > product.stockQuantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock' });
    }
    existingItem.quantity = newQty;
  } else {
    cart.items.push({ product: productId, quantity: Number(quantity) });
  }

  await cart.save();
  res.status(200).json({ success: true, message: 'Product added to cart' });
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
exports.updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({ success: false, message: 'Cart not found' });
  }

  const item = cart.items.id(req.params.itemId);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not in cart' });
  }

  const product = await Product.findById(item.product);
  if (quantity > product.stockQuantity) {
    return res.status(400).json({ success: false, message: 'Insufficient stock' });
  }

  if (quantity <= 0) {
    cart.items = cart.items.filter(i => i._id.toString() !== req.params.itemId);
  } else {
    item.quantity = Number(quantity);
  }

  await cart.save();
  res.status(200).json({ success: true, message: 'Cart updated' });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
exports.removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return res.status(404).json({ success: false, message: 'Cart not found' });
  }

  cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
  await cart.save();

  res.status(200).json({ success: true, message: 'Item removed from cart' });
});

// @desc    Clear cart
// @route   DELETE /api/cart
exports.clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  res.status(200).json({ success: true, message: 'Cart cleared' });
});
