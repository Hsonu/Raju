const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { getServices, getService, createService, updateService, deleteService } = require('../controllers/serviceController');

router.get('/', getServices);
router.get('/:slug', getService);
router.post('/', protect, adminOnly, upload.single('image'), createService);
router.put('/:id', protect, adminOnly, upload.single('image'), updateService);
router.delete('/:id', protect, adminOnly, deleteService);

module.exports = router;
