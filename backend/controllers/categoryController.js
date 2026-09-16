const Category = require('../models/Category');
const { asyncHandler } = require('../middleware/errorHandler');
const { uploadToCloudinary, deleteFromCloudinary } = require('../middleware/upload');

// @desc    Get all categories (public)
// @route   GET /api/categories
exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ status: 'active' }).sort('order');
  res.status(200).json({ success: true, categories });
});

// @desc    Get category by slug
// @route   GET /api/categories/:slug
exports.getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
  res.status(200).json({ success: true, category });
});

// @desc    Create category (admin)
// @route   POST /api/categories
exports.createCategory = asyncHandler(async (req, res) => {
  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, 'riddhi-computer/categories');
    req.body.image = result;
  }
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, message: 'Category created', category });
});

// @desc    Update category (admin)
// @route   PUT /api/categories/:id
exports.updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

  if (req.file) {
    if (category.image?.publicId) await deleteFromCloudinary(category.image.publicId);
    req.body.image = await uploadToCloudinary(req.file.buffer, 'riddhi-computer/categories');
  }

  const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.status(200).json({ success: true, message: 'Category updated', category: updated });
});

// @desc    Delete category (admin)
// @route   DELETE /api/categories/:id
exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
  if (category.image?.publicId) await deleteFromCloudinary(category.image.publicId);
  await Category.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: 'Category deleted' });
});
