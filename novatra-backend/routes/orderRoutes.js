const express = require("express");
const { protect } = require("../middleware/auth");
const router = express.Router();

const {
  placeOrder,
  markOrderPaid,
  getUserOrders,
  createRazorpayOrder,
} = require("../controllers/orderController");

// Create order (COD or online)
router.post("/", protect, placeOrder);

// Create Razorpay order (online payment)
router.post("/razorpay", protect, createRazorpayOrder);

// Verify payment and mark order as paid
router.post("/:id/payment-success", protect, markOrderPaid);

// Get logged-in user's orders
router.get("/my-orders", protect, getUserOrders);

module.exports = router;
