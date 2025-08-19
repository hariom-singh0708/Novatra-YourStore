const User = require('../models/User');
const Merchant = require('../models/Merchant');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get Admin Dashboard Analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMerchants = await Merchant.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const totalSalesAgg = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } }
    ]);
    const totalSales = totalSalesAgg[0] ? totalSalesAgg[0].totalSales : 0;

    // Optional: Recent 5 orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .populate('merchant', 'storeName');

    res.status(200).json({
      totalUsers,
      totalMerchants,
      totalProducts,
      totalOrders,
      totalSales,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all merchants (with approval status)
const getAllMerchants = async (req, res) => {
  try {
    const merchants = await Merchant.find()
      .select('-password')
      .sort({ createdAt: -1 });
    res.status(200).json(merchants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Approve or revoke merchant
// @route PUT /api/admin/merchants/:id/approve
// @access Private (Admin)
const setMerchantApproval = async (req, res) => {
  try {
    const merchantId = req.params.id;
    const { approve } = req.body; // true or false

    const merchant = await Merchant.findById(merchantId);
    if (!merchant) return res.status(404).json({ message: 'Merchant not found' });

    merchant.isApproved = !!approve;
    merchant.approvedAt = approve ? new Date() : null;
    await merchant.save();

    res.status(200).json({
      message: `Merchant ${approve ? 'approved' : 'approval revoked'}`,
      merchant
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete merchant (admin)
const deleteMerchant = async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.params.id);
    if (!merchant) return res.status(404).json({ message: 'Merchant not found' });

    // Optionally: remove merchant products or reassign them
    await Product.deleteMany({ merchant: merchant._id });

    await merchant.remove();
    res.status(200).json({ message: 'Merchant deleted and products removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all products (admin view)
const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find().populate('merchant', 'storeName isApproved');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('merchant', 'storeName');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAnalytics,
  getAllUsers,
  getAllMerchants,
  setMerchantApproval,
  deleteMerchant,
  getAllProductsAdmin,
  getAllOrders
};