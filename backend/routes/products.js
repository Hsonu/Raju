const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const {
  getProducts, getProduct, createProduct,
  updateProduct, deleteProduct, deleteProductImage,
} = require('../controllers/productController');

router.get('/', getProducts);
router.get('/:id', getProduct);

// Admin routes
router.post('/', protect, adminOnly, upload.array('images', 10), createProduct);
router.put('/:id', protect, adminOnly, upload.array('images', 10), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.delete('/:id/image/:publicId', protect, adminOnly, deleteProductImage);

module.exports = router;
