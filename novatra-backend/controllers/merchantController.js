const Merchant = require("../models/Merchant");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { hashPassword, comparePassword } = require("../utils/auth");
const jwt = require("jsonwebtoken");

// @desc Register Merchant
const registerMerchant = async (req, res) => {
  try {
    const { name, email, password, storeName } = req.body;

    if (!name || !email || !password || !storeName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await Merchant.findOne({ email });
    if (exists) return res.status(400).json({ message: "Merchant already exists" });

    const hashed = await hashPassword(password);

    const merchant = new Merchant({
      name,
      email,
      password: hashed,
      storeName,
      role: "merchant",
      isApproved: false // default until admin approves
    });

    await merchant.save();

    res.status(201).json({
      message: "Merchant registered successfully. Pending admin approval.",
      merchant: { id: merchant._id, email: merchant.email, storeName: merchant.storeName }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Login Merchant
const loginMerchant = async (req, res) => {
  try {
    const { email, password } = req.body;

    const merchant = await Merchant.findOne({ email });
    if (!merchant) return res.status(400).json({ message: "Invalid credentials" });

    const match = await comparePassword(password, merchant.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    // Block if not approved yet
    if (!merchant.isApproved) {
      return res.status(403).json({ message: "Merchant not approved by admin yet." });
    }

    const token = jwt.sign(
      { id: merchant._id, role: merchant.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      token,
      merchant: {
        id: merchant._id,
        name: merchant.name,
        email: merchant.email,
        storeName: merchant.storeName,
        role: merchant.role,
        isApproved: merchant.isApproved
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get Merchant Profile
const getMerchantProfile = async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.user._id).select("-password");
    if (!merchant) return res.status(404).json({ message: "Merchant not found" });

    // Fetch counts for dashboard
    const productCount = await Product.countDocuments({ merchant: merchant._id });
    const orderCount = await Order.countDocuments({ merchant: merchant._id });

    res.json({ ...merchant.toObject(), productCount, orderCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update Merchant Profile
const updateMerchantProfile = async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.user._id);
    if (!merchant) return res.status(404).json({ message: "Merchant not found" });

    merchant.name = req.body.name || merchant.name;
    merchant.storeName = req.body.storeName || merchant.storeName;
    merchant.email = req.body.email || merchant.email;

    if (req.body.password) {
      merchant.password = await hashPassword(req.body.password);
    }

    await merchant.save();

    res.json({ message: "Profile updated successfully", merchant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get Merchant Orders
const getMerchantOrders = async (req, res) => {
  try {
    const merchantId = req.user._id;

    // Fetch all orders for this merchant
    const orders = await Order.find({ merchant: merchantId })
      .populate("user", "name email")
      .populate("orderItems.product", "name price")
      .sort({ createdAt: -1 })
      .lean();

    console.log("Merchant Orders:", orders); // Debug
    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load orders" });
  }
};



module.exports = {
  registerMerchant,
  loginMerchant,
  getMerchantProfile,
  updateMerchantProfile,
  getMerchantOrders
};
