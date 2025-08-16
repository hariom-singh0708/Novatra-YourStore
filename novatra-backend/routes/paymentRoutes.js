const express = require('express');
const router = express.Router();
const { createPaymentOrder, verifyWebhook } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/razorpay', protect, authorize('user'), createPaymentOrder);

// For Razorpay webhook: raw body required — mount this route BEFORE express.json() middleware or use raw parser on this route
router.post('/webhook', express.raw({ type: 'application/json' }), verifyWebhook);

module.exports = router;
