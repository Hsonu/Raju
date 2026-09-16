const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getDashboardStats, getAnalytics, getCustomers,
  getSettings, updateSettings, getFinanceOverview,
} = require('../controllers/adminController');

router.use(protect, adminOnly); // All admin routes protected

router.get('/dashboard', getDashboardStats);
router.get('/finance', getFinanceOverview);
router.get('/analytics', getAnalytics);
router.get('/customers', getCustomers);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

module.exports = router;
