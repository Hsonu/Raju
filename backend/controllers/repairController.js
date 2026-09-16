const RepairRequest = require('../models/RepairRequest');
const Appointment = require('../models/Appointment');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Submit repair request (public/customer)
// @route   POST /api/repairs
exports.createRepairRequest = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.user) data.user = req.user._id;

  const repair = await RepairRequest.create(data);

  // Create appointment if preferred date is set
  if (data.preferredDate) {
    await Appointment.create({
      repairRequest: repair._id,
      user: data.user || null,
      customerName: data.customerName,
      mobile: data.mobile,
      email: data.email || '',
      serviceType: data.serviceRequired,
      date: data.preferredDate,
      timeSlot: data.preferredTime || 'Flexible',
      address: data.address || '',
      homeVisit: data.homeVisit || false,
    });
  }

  res.status(201).json({
    success: true,
    message: 'Repair request submitted successfully',
    requestId: repair.requestId,
  });
});

// @desc    Track repair by requestId or _id (public)
// @route   GET /api/repairs/track/:requestId
exports.trackRepair = asyncHandler(async (req, res) => {
  const mongoose = require('mongoose');
  const paramId = req.params.requestId;
  const isObjectId = mongoose.Types.ObjectId.isValid(paramId);
  const query = isObjectId
    ? { $or: [{ requestId: { $regex: `^${paramId}$`, $options: 'i' } }, { _id: paramId }] }
    : { requestId: { $regex: `^${paramId}$`, $options: 'i' } };

  const repair = await RepairRequest.findOne(query)
    .select('requestId customerName deviceType brand model problem serviceRequired status statusHistory estimatedCost finalCost homeVisit address preferredDate preferredTime createdAt');

  if (!repair) {
    return res.status(404).json({ success: false, message: 'Repair request not found' });
  }

  res.status(200).json({ success: true, repair });
});

// @desc    Get user's repair requests
// @route   GET /api/repairs/my
exports.getMyRepairs = asyncHandler(async (req, res) => {
  const repairs = await RepairRequest.find({ user: req.user._id }).sort('-createdAt');
  res.status(200).json({ success: true, repairs });
});

// @desc    Get all repair requests (admin)
// @route   GET /api/repairs/admin/all
exports.getAllRepairs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, search, sort = '-createdAt' } = req.query;
  const query = {};

  if (status) query.status = status;
  if (search) {
    query.$or = [
      { requestId: { $regex: search, $options: 'i' } },
      { customerName: { $regex: search, $options: 'i' } },
      { mobile: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await RepairRequest.countDocuments(query);
  const repairs = await RepairRequest.find(query).sort(sort).skip(skip).limit(Number(limit));

  res.status(200).json({ success: true, total, totalPages: Math.ceil(total / Number(limit)), repairs });
});

// @desc    Get single repair (admin)
// @route   GET /api/repairs/admin/:id
exports.getRepairById = asyncHandler(async (req, res) => {
  const repair = await RepairRequest.findById(req.params.id).populate('user', 'name email phone');
  if (!repair) {
    return res.status(404).json({ success: false, message: 'Repair request not found' });
  }
  res.status(200).json({ success: true, repair });
});

// @desc    Update repair status (admin)
// @route   PUT /api/repairs/admin/:id
exports.updateRepair = asyncHandler(async (req, res) => {
  const { status, technician, estimatedCost, finalCost, adminNotes } = req.body;
  const repair = await RepairRequest.findById(req.params.id);

  if (!repair) {
    return res.status(404).json({ success: false, message: 'Repair request not found' });
  }

  if (status) {
    repair.status = status;
    repair.statusHistory.push({ status, note: req.body.note || '', date: new Date() });
  }
  if (technician !== undefined) repair.technician = technician;
  if (estimatedCost !== undefined) repair.estimatedCost = estimatedCost;
  if (finalCost !== undefined) repair.finalCost = finalCost;
  if (adminNotes !== undefined) repair.adminNotes = adminNotes;

  await repair.save();

  res.status(200).json({ success: true, message: 'Repair request updated', repair });
});
