const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const Razorpay = require("razorpay");
const crypto = require("crypto");

// --- Create Order ---
const placeOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, cart: clientCart } = req.body;
    if (!req.user?._id) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.user._id).populate("cart.product");
    if (!user) return res.status(404).json({ message: "User not found" });

    let cartItems = clientCart?.length ? clientCart : user.cart;
    if (!cartItems?.length) return res.status(400).json({ message: "Cart is empty" });

    const orderItems = [];
    let totalPrice = 0;

    for (const item of cartItems) {
      const productDoc = await Product.findById(item.product._id || item.product);
      if (!productDoc) continue;
      orderItems.push({ product: productDoc._id, quantity: item.quantity || 1, price: productDoc.price });
      totalPrice += productDoc.price * (item.quantity || 1);
    }

    if (!orderItems.length) return res.status(400).json({ message: "No valid products in cart" });

    const order = new Order({
      user: user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      isPaid: paymentMethod.toLowerCase() === "cod" ? false : false,
      status: "Pending",
    });

    await order.save();
    user.orders.push(order._id);
    if (!clientCart?.length) user.cart = [];
    await user.save();

    res.status(201).json({ message: "Order created", order });
  } catch (err) {
    console.error("placeOrder error:", err);
    res.status(500).json({ message: err.message });
  }
};

// --- Create Razorpay Order ---
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, orderId } = req.body;
    if (!amount || !orderId) return res.status(400).json({ message: "Missing amount or orderId" });

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const razorpayOrder = await instance.orders.create({
      amount: Math.round(amount * 100), // in paise
      currency: "INR",
      receipt: `order_${orderId}`,
      notes: { orderId: String(orderId) },
    });

    res.status(200).json({
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (err) {
    console.error("createRazorpayOrder error:", err);
    res.status(500).json({ message: err.message });
  }
};

// --- Verify Payment & Mark Order Paid ---
const markOrderPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, email } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature)
      return res.status(400).json({ message: "Invalid payment signature" });

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: razorpay_payment_id,
      status: "captured",
      update_time: new Date().toISOString(),
      email_address: email || "",
    };

    await order.save();
    res.status(200).json({ message: "Payment verified and order marked paid", order });
  } catch (err) {
    console.error("markOrderPaid error:", err);
    res.status(500).json({ message: err.message });
  }
};

// --- Get User Orders ---
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("orderItems.product");
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { placeOrder, createRazorpayOrder, markOrderPaid, getUserOrders };
