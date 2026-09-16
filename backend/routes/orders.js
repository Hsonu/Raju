const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  createOrder, getMyOrders, getOrder, trackOrder,
  getAllOrders, updateOrderStatus, cancelOrder,
} = require('../controllers/orderController');

router.get('/track/:orderId', trackOrder); // Public track
router.post('/', protect, createOrder);
router.get('/', protect, getMyOrders);
router.get('/admin/all', protect, adminOnly, getAllOrders);
router.get('/:orderId', protect, getOrder);
router.put('/:orderId/status', protect, adminOnly, updateOrderStatus);
router.put('/:orderId/cancel', protect, cancelOrder);

module.exports = router;
