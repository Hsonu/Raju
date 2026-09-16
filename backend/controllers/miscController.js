const Coupon = require('../models/Coupon');
const Banner = require('../models/Banner');
const Review = require('../models/Review');
const ContactMessage = require('../models/ContactMessage');
const { asyncHandler } = require('../middleware/errorHandler');
const { uploadToCloudinary, deleteFromCloudinary } = require('../middleware/upload');

// ============== COUPON ==============
exports.validateCoupon = asyncHandler(async (req, res) => {
  const { code, orderTotal } = req.body;
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (!coupon || !coupon.isValid()) {
    return res.status(400).json({ success: false, message: 'Invalid or expired coupon' });
  }
  if (orderTotal < coupon.minOrder) {
    return res.status(400).json({ success: false, message: `Minimum order ₹${coupon.minOrder} required` });
  }
  const discount = coupon.calculateDiscount(orderTotal);
  res.status(200).json({ success: true, coupon: { code: coupon.code, discountType: coupon.discountType, discount } });
});

exports.getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort('-createdAt');
  res.status(200).json({ success: true, coupons });
});

exports.createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ success: true, message: 'Coupon created', coupon });
});

exports.updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
  res.status(200).json({ success: true, message: 'Coupon updated', coupon });
});

exports.deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
  res.status(200).json({ success: true, message: 'Coupon deleted' });
});

// ============== BANNER ==============
exports.getActiveBanners = asyncHandler(async (req, res) => {
  const now = new Date();
  const banners = await Banner.find({
    status: 'active',
    startDate: { $lte: now },
    $or: [{ endDate: null }, { endDate: { $gte: now } }],
  }).sort('order');
  res.status(200).json({ success: true, banners });
});

exports.getAllBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find().sort('-createdAt');
  res.status(200).json({ success: true, banners });
});

exports.createBanner = asyncHandler(async (req, res) => {
  if (req.file) {
    req.body.image = await uploadToCloudinary(req.file.buffer, 'riddhi-computer/banners');
  }
  const banner = await Banner.create(req.body);
  res.status(201).json({ success: true, message: 'Banner created', banner });
});

exports.updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });

  if (req.file) {
    if (banner.image?.publicId) await deleteFromCloudinary(banner.image.publicId);
    req.body.image = await uploadToCloudinary(req.file.buffer, 'riddhi-computer/banners');
  }

  const updated = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json({ success: true, message: 'Banner updated', banner: updated });
});

exports.deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
  if (banner.image?.publicId) await deleteFromCloudinary(banner.image.publicId);
  await Banner.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: 'Banner deleted' });
});

// ============== REVIEW ==============
exports.getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId, status: 'approved' })
    .populate('user', 'name').sort('-createdAt');
  res.status(200).json({ success: true, reviews });
});

exports.createReview = asyncHandler(async (req, res) => {
  req.body.user = req.user._id;
  const review = await Review.create(req.body);
  res.status(201).json({ success: true, message: 'Review submitted for moderation', review });
});

exports.getAllReviews = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = status ? { status } : {};
  const reviews = await Review.find(query).populate('user', 'name email').populate('product', 'name').sort('-createdAt');
  res.status(200).json({ success: true, reviews });
});

exports.updateReviewStatus = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
  res.status(200).json({ success: true, message: 'Review updated', review });
});

exports.deleteReview = asyncHandler(async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: 'Review deleted' });
});

// ============== CONTACT ==============
exports.submitContact = asyncHandler(async (req, res) => {
  const contact = await ContactMessage.create(req.body);
  res.status(201).json({ success: true, message: 'Message sent successfully' });
});

exports.getContactMessages = asyncHandler(async (req, res) => {
  const messages = await ContactMessage.find().sort('-createdAt');
  res.status(200).json({ success: true, messages });
});

exports.updateContactStatus = asyncHandler(async (req, res) => {
  const msg = await ContactMessage.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
  res.status(200).json({ success: true, message: 'Status updated' });
});
