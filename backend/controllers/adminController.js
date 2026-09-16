const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const RepairRequest = require('../models/RepairRequest');
const Settings = require('../models/Settings');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [
    totalProducts, totalOrders, totalCustomers,
    totalSales, pendingRepairs, completedRepairs,
    todayOrders, todayRevenue,
  ] = await Promise.all([
    Product.countDocuments({ status: 'active' }),
    Order.countDocuments(),
    User.countDocuments({ role: 'customer' }),
    Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    RepairRequest.countDocuments({ status: { $nin: ['completed', 'cancelled'] } }),
    RepairRequest.countDocuments({ status: 'completed' }),
    Order.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } }),
    Order.aggregate([
      { $match: { createdAt: { $gte: today, $lt: tomorrow }, paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalProducts,
      totalOrders,
      totalCustomers,
      totalSales: totalSales[0]?.total || 0,
      pendingRepairs,
      completedRepairs,
      todayOrders,
      todayRevenue: todayRevenue[0]?.total || 0,
    },
  });
});

// @desc    Get sales analytics (monthly)
// @route   GET /api/admin/analytics
exports.getAnalytics = asyncHandler(async (req, res) => {
  const monthlyOrders = await Order.aggregate([
    {
      $group: {
        _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
        orders: { $sum: 1 },
        revenue: { $sum: '$total' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 12 },
  ]);

  const ordersByStatus = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const topProducts = await Order.aggregate([
    { $unwind: '$items' },
    { $group: { _id: '$items.name', sold: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
    { $sort: { sold: -1 } },
    { $limit: 10 },
  ]);

  res.status(200).json({
    success: true,
    analytics: { monthlyOrders, ordersByStatus, topProducts },
  });
});

// @desc    Get all customers (admin)
// @route   GET /api/admin/customers
exports.getCustomers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const query = { role: 'customer' };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await User.countDocuments(query);
  const customers = await User.find(query).select('-password').sort('-createdAt').skip(skip).limit(Number(limit));

  res.status(200).json({ success: true, total, customers });
});

// @desc    Get real-time financial stats & ledger overview
// @route   GET /api/admin/finance
exports.getFinanceOverview = asyncHandler(async (req, res) => {
  const [
    orderStats,
    repairStats,
    recentOrders,
    recentRepairs,
    monthlyAggregation,
    paymentMethodAggregation
  ] = await Promise.all([
    // Orders Revenue
    Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          totalTax: { $sum: '$tax' },
          totalItemsSold: { $sum: { $size: '$items' } },
          totalOrders: { $sum: 1 },
        }
      }
    ]),
    // Repair Revenue
    RepairRequest.aggregate([
      {
        $group: {
          _id: null,
          totalRepairs: { $sum: 1 },
          completedRepairs: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          repairRevenue: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, { $ifNull: ['$estimatedCost', 1200] }, 0] }
          }
        }
      }
    ]),
    // Recent Orders
    Order.find().sort({ createdAt: -1 }).limit(10),
    // Recent Repairs
    RepairRequest.find().sort({ createdAt: -1 }).limit(10),
    // Monthly aggregations (real past months)
    Order.aggregate([
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          hardwareRevenue: { $sum: '$total' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]),
    // Payment method breakdown
    Order.aggregate([
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          total: { $sum: '$total' }
        }
      }
    ])
  ]);

  const pRev = orderStats[0]?.totalRevenue || 0;
  const rRev = repairStats[0]?.repairRevenue || 0;
  const totalRev = pRev + rRev;
  const gst = orderStats[0]?.totalTax || Math.round(pRev * 0.18);
  const laptopSales = orderStats[0]?.totalItemsSold || orderStats[0]?.totalOrders || 0;
  const devicesRepaired = repairStats[0]?.completedRepairs || 0;

  res.status(200).json({
    success: true,
    finance: {
      totalRevenue: totalRev,
      productRevenue: pRev,
      repairRevenue: rRev,
      gstCollected: gst,
      laptopSalesCount: laptopSales,
      devicesRepairedCount: devicesRepaired,
      totalOrdersCount: orderStats[0]?.totalOrders || 0,
      totalRepairsCount: repairStats[0]?.totalRepairs || 0,
      monthlyAggregation,
      paymentMethodAggregation,
      recentTransactions: [
        ...recentOrders.map(o => ({
          _id: o._id,
          type: 'order',
          customer: o.shippingAddress?.fullName || 'Online Customer',
          item: o.items?.[0]?.name || `${o.items?.length || 1} Product(s)`,
          method: o.paymentMethod || 'UPI / Online',
          amount: o.total || 0,
          status: o.status || 'Delivered',
          createdAt: o.createdAt
        })),
        ...recentRepairs.map(r => ({
          _id: r._id,
          type: 'repair',
          customer: r.fullName || r.customerName || 'Store Client',
          item: `${r.deviceType || 'Laptop'} Repair - ${r.issueType || 'Diagnostic'}`,
          method: 'In-Store / Cash',
          amount: r.estimatedCost || 0,
          status: r.status === 'completed' ? 'Completed' : 'Processing',
          createdAt: r.createdAt
        }))
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10)
    }
  });
});

// @desc    Get/update settings
exports.getSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  res.status(200).json({ success: true, settings });
});

exports.updateSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  Object.assign(settings, req.body);
  await settings.save();
  res.status(200).json({ success: true, message: 'Settings updated', settings });
});
