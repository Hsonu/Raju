const Service = require('../models/Service');
const { asyncHandler } = require('../middleware/errorHandler');
const { uploadToCloudinary, deleteFromCloudinary } = require('../middleware/upload');

exports.getServices = asyncHandler(async (req, res) => {
  const query = req.query.all === 'true' ? {} : { status: 'active' };
  const services = await Service.find(query).sort('order -createdAt');
  res.status(200).json({ success: true, services });
});

exports.getService = asyncHandler(async (req, res) => {
  const service = await Service.findOne({ slug: req.params.slug });
  if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
  res.status(200).json({ success: true, service });
});

exports.createService = asyncHandler(async (req, res) => {
  if (req.file) {
    req.body.image = await uploadToCloudinary(req.file.buffer, 'riddhi-computer/services');
  } else if (req.body.imageUrl) {
    req.body.image = { url: req.body.imageUrl, publicId: 'custom' };
  }

  if (!req.body.description) {
    req.body.description = req.body.shortDescription || 'Professional computer repair and upgrade service at Riddhi Computer.';
  }

  if (typeof req.body.features === 'string') {
    req.body.features = req.body.features.split(',').map(f => f.trim()).filter(Boolean);
  }
  const service = await Service.create(req.body);
  res.status(201).json({ success: true, message: 'Service created', service });
});

exports.updateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

  if (req.file) {
    if (service.image?.publicId) await deleteFromCloudinary(service.image.publicId);
    req.body.image = await uploadToCloudinary(req.file.buffer, 'riddhi-computer/services');
  } else if (req.body.imageUrl) {
    req.body.image = { url: req.body.imageUrl, publicId: 'custom' };
  }

  if (typeof req.body.features === 'string') {
    req.body.features = req.body.features.split(',').map(f => f.trim()).filter(Boolean);
  }

  const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.status(200).json({ success: true, message: 'Service updated', service: updated });
});

exports.deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
  if (service.image?.publicId) await deleteFromCloudinary(service.image.publicId);
  await Service.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: 'Service deleted' });
});
