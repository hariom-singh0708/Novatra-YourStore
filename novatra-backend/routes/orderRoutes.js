const express = require('express');
const router = express.Router();

const { ensureMerchantApproved } = require('../middleware/merchantApproval');
const {
  placeOrder,
  getUserOrders,
  getMerchantOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');

const { protect, authorize } = require('../middleware/auth');

// User routes
router.post('/', protect, authorize('user'), placeOrder);
router.get('/my-orders', protect, authorize('user'), getUserOrders);

// Merchant routes
router.get('/merchant', protect, authorize('merchant'), getMerchantOrders);

// Admin routes
router.get('/', protect, authorize('admin'), getAllOrders);

// Update order status (Merchant or Admin)
router.patch('/:id/status', protect, authorize('admin', 'merchant'), ensureMerchantApproved, updateOrderStatus);

module.exports = router;
