const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const misc = require('../controllers/miscController');

// Coupons
router.post('/coupons/validate', protect, misc.validateCoupon);
router.get('/coupons', protect, adminOnly, misc.getCoupons);
router.post('/coupons', protect, adminOnly, misc.createCoupon);
router.put('/coupons/:id', protect, adminOnly, misc.updateCoupon);
router.delete('/coupons/:id', protect, adminOnly, misc.deleteCoupon);

// Banners
router.get('/banners', misc.getActiveBanners); // Public
router.get('/banners/all', protect, adminOnly, misc.getAllBanners);
router.post('/banners', protect, adminOnly, upload.single('image'), misc.createBanner);
router.put('/banners/:id', protect, adminOnly, upload.single('image'), misc.updateBanner);
router.delete('/banners/:id', protect, adminOnly, misc.deleteBanner);

// Reviews
router.get('/reviews/product/:productId', misc.getProductReviews); // Public
router.post('/reviews', protect, misc.createReview);
router.get('/reviews/all', protect, adminOnly, misc.getAllReviews);
router.put('/reviews/:id', protect, adminOnly, misc.updateReviewStatus);
router.delete('/reviews/:id', protect, adminOnly, misc.deleteReview);

// Contact
router.post('/contact', misc.submitContact); // Public
router.get('/contact', protect, adminOnly, misc.getContactMessages);
router.put('/contact/:id', protect, adminOnly, misc.updateContactStatus);

module.exports = router;
