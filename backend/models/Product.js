const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters'],
  },
  slug: {
    type: String,
    unique: true,
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
  },
  subcategory: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  shortDescription: {
    type: String,
    maxlength: [300, 'Short description cannot exceed 300 characters'],
  },
  sku: {
    type: String,
    unique: true,
    required: [true, 'SKU is required'],
    uppercase: true,
    trim: true,
  },
  images: [{
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    alt: { type: String, default: '' },
  }],
  thumbnail: {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' },
  },
  mrp: {
    type: Number,
    required: [true, 'MRP is required'],
    min: [0, 'MRP cannot be negative'],
  },
  sellingPrice: {
    type: Number,
    required: [true, 'Selling price is required'],
    min: [0, 'Selling price cannot be negative'],
  },
  gstPercentage: {
    type: Number,
    default: 18,
    min: [0, 'GST cannot be negative'],
    max: [100, 'GST cannot exceed 100%'],
  },
  gstInclusive: {
    type: Boolean,
    default: true,
  },
  hsnCode: {
    type: String,
    default: '8471',
    trim: true,
  },
  stockQuantity: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0,
  },
  specifications: {
    ram: { type: String, default: '' },
    storage: { type: String, default: '' },
    processor: { type: String, default: '' },
    display: { type: String, default: '' },
    graphics: { type: String, default: '' },
    operatingSystem: { type: String, default: '' },
    battery: { type: String, default: '' },
    weight: { type: String, default: '' },
    ports: { type: String, default: '' },
    other: { type: String, default: '' },
  },
  warranty: {
    type: String,
    default: '1 Year Manufacturer Warranty',
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'active',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 },
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual: discount percentage
productSchema.virtual('discountPercentage').get(function () {
  if (this.mrp > 0 && this.sellingPrice < this.mrp) {
    return Math.round(((this.mrp - this.sellingPrice) / this.mrp) * 100);
  }
  return 0;
});

// Virtual: discount amount
productSchema.virtual('discountAmount').get(function () {
  return Math.max(0, this.mrp - this.sellingPrice);
});

// Virtual: GST amount
productSchema.virtual('gstAmount').get(function () {
  const priceBeforeGst = this.sellingPrice / (1 + this.gstPercentage / 100);
  return Math.round((this.sellingPrice - priceBeforeGst) * 100) / 100;
});

// Virtual: availability
productSchema.virtual('inStock').get(function () {
  return this.stockQuantity > 0;
});

productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ status: 1, featured: 1 });
productSchema.index({ name: 'text', brand: 'text', description: 'text' });

productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true }) + '-' + Date.now().toString(36);
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
