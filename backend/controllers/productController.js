const Product = require('../models/Product');
const { asyncHandler } = require('../middleware/errorHandler');
const { uploadToCloudinary, deleteFromCloudinary } = require('../middleware/upload');

// @desc    Get all products (public, with search/filter/pagination)
// @route   GET /api/products
exports.getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1, limit = 12, sort = '-createdAt',
    search, category, brand, minPrice, maxPrice,
    ram, storage, processor, status = 'active', featured,
  } = req.query;

  const query = {};

  if (status) query.status = status;
  if (category) query.category = category;
  if (brand) query.brand = { $regex: brand, $options: 'i' };
  if (featured === 'true') query.featured = true;
  if (ram) query['specifications.ram'] = { $regex: ram, $options: 'i' };
  if (storage) query['specifications.storage'] = { $regex: storage, $options: 'i' };
  if (processor) query['specifications.processor'] = { $regex: processor, $options: 'i' };

  if (minPrice || maxPrice) {
    query.sellingPrice = {};
    if (minPrice) query.sellingPrice.$gte = Number(minPrice);
    if (maxPrice) query.sellingPrice.$lte = Number(maxPrice);
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate('category', 'name slug')
    .sort(sort)
    .skip(skip)
    .limit(Number(limit))
    .lean({ virtuals: true });

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    totalPages: Math.ceil(total / Number(limit)),
    currentPage: Number(page),
    products,
  });
});

// @desc    Get single product by ID or slug
// @route   GET /api/products/:id
exports.getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let product;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    product = await Product.findById(id).populate('category', 'name slug').lean({ virtuals: true });
  } else {
    product = await Product.findOne({ slug: id }).populate('category', 'name slug').lean({ virtuals: true });
  }

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  res.status(200).json({ success: true, product });
});

const Category = require('../models/Category');

// @desc    Create product (admin)
// @route   POST /api/products
exports.createProduct = asyncHandler(async (req, res) => {
  const productData = req.body;

  // Ensure category is present
  if (!productData.category) {
    let cat = await Category.findOne({ slug: 'laptops' }) || await Category.findOne({});
    if (!cat) {
      cat = await Category.create({ name: 'Laptops', slug: 'laptops', description: 'Laptops & Computers' });
    }
    productData.category = cat._id;
  }

  // Handle image uploads
  if (req.files && req.files.length > 0) {
    const imagePromises = req.files.map(file =>
      uploadToCloudinary(file.buffer, 'riddhi-computer/products')
    );
    const images = await Promise.all(imagePromises);
    productData.images = images;
    if (images.length > 0) {
      productData.thumbnail = images[0];
    }
  }

  // Parse specifications if sent as string
  if (typeof productData.specifications === 'string') {
    try {
      productData.specifications = JSON.parse(productData.specifications);
    } catch (e) {}
  }

  const product = await Product.create(productData);

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    product,
  });
});

// @desc    Update product (admin)
// @route   PUT /api/products/:id
exports.updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const updateData = req.body;

  // Handle new image uploads
  if (req.files && req.files.length > 0) {
    const imagePromises = req.files.map(file =>
      uploadToCloudinary(file.buffer, 'riddhi-computer/products')
    );
    const newImages = await Promise.all(imagePromises);

    // Append new images or replace
    if (updateData.replaceImages === 'true') {
      // Delete old images from Cloudinary
      for (const img of product.images) {
        await deleteFromCloudinary(img.publicId);
      }
      updateData.images = newImages;
    } else {
      updateData.images = [...product.images, ...newImages];
    }

    if (updateData.images.length > 0) {
      updateData.thumbnail = updateData.images[0];
    }
  }

  if (typeof updateData.specifications === 'string') {
    updateData.specifications = JSON.parse(updateData.specifications);
  }

  product = await Product.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  }).lean({ virtuals: true });

  res.status(200).json({ success: true, message: 'Product updated', product });
});

// @desc    Delete product (admin)
// @route   DELETE /api/products/:id
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  // Delete images from Cloudinary
  for (const img of product.images) {
    await deleteFromCloudinary(img.publicId);
  }

  await Product.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, message: 'Product deleted' });
});

// @desc    Delete single product image (admin)
// @route   DELETE /api/products/:id/image/:publicId
exports.deleteProductImage = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const publicId = decodeURIComponent(req.params.publicId);
  await deleteFromCloudinary(publicId);

  product.images = product.images.filter(img => img.publicId !== publicId);
  if (product.images.length > 0) {
    product.thumbnail = product.images[0];
  } else {
    product.thumbnail = { url: '', publicId: '' };
  }
  await product.save();

  res.status(200).json({ success: true, message: 'Image deleted', product });
});
