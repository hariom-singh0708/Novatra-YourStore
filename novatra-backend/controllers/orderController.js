const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Place an order
// @route   POST /api/orders
// @access  Private (User)
const placeOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, paymentResult } = req.body;

    const user = await User.findById(req.user._id).populate('cart.product');
    if (user.cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const orderItems = user.cart.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price
    }));

    // Calculate total price
    const totalPrice = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // Create order (merchant can be set to the first product's merchant for simplicity)
    const order = new Order({
      user: user._id,
      merchant: user.cart[0].product.merchant,
      orderItems,
      shippingAddress,
      paymentMethod,
      paymentResult,
      totalPrice,
      isPaid: paymentMethod.toLowerCase() === 'cod' ? false : true,
      paidAt: paymentMethod.toLowerCase() === 'cod' ? null : Date.now()
    });

    await order.save();

    // Add order to user's orders
    user.orders.push(order._id);
    user.cart = []; // clear cart after order
    await user.save();

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private (User)
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      'orderItems.product',
      'name price images'
    );
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get merchant orders
// @route   GET /api/orders/merchant
// @access  Private (Merchant)
const getMerchantOrders = async (req, res) => {
  try {
    const orders = await Order.find({ merchant: req.user._id }).populate(
      'orderItems.product user',
      'name email'
    );
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private (Admin)
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

// @desc    Update order status (Admin or Merchant)
// @route   PATCH /api/orders/:id/status
// @access  Private (Admin or Merchant)
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const { status } = req.body;

    // Only merchant or admin can update status
    if (
      req.user.role === 'merchant' &&
      order.merchant.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    order.status = status;

    // Mark delivered if status is delivered
    if (status === 'Delivered') order.deliveredAt = Date.now();

    await order.save();
    res.status(200).json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
  getMerchantOrders,
  getAllOrders,
  updateOrderStatus
};
