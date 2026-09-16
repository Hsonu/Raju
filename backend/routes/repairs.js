const express = require('express');
const router = express.Router();
const { protect, optionalAuth, adminOnly } = require('../middleware/auth');
const {
  createRepairRequest, trackRepair, getMyRepairs,
  getAllRepairs, getRepairById, updateRepair,
} = require('../controllers/repairController');

router.post('/', optionalAuth, createRepairRequest); // Public or authenticated
router.get('/track/:requestId', trackRepair); // Public
router.get('/my', protect, getMyRepairs);
router.get('/admin/all', protect, adminOnly, getAllRepairs);
router.get('/admin/:id', protect, adminOnly, getRepairById);
router.put('/admin/:id', protect, adminOnly, updateRepair);

module.exports = router;
