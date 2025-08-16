const { createRazorpayOrder } = require('../utils/razorpay');
const Order = require('../models/Order');

// @desc    Create Razorpay order
// @route   POST /api/payment/razorpay
// @access  Private (User)
const createPaymentOrder = async (req, res) => {
  try {
    const { amount, orderId } = req.body; // amount in rupees

    // Optional: Validate order belongs to user
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const razorpayOrder = await createRazorpayOrder(amount);

    res.status(200).json({
      id: razorpayOrder.id,
      currency: razorpayOrder.currency,
      amount: razorpayOrder.amount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Optional: Webhook verification (if you use Razorpay webhooks)
const verifyWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const shasum = crypto.createHmac('sha256', secret);
    const body = JSON.stringify(req.body);
    shasum.update(body);
    const digest = shasum.digest('hex');

    const signature = req.headers['x-razorpay-signature'];
    if (digest !== signature) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    // Handle events — example: payment.captured
    const event = req.body.event;
    if (event === 'payment.captured' || event === 'order.paid') {
      const payload = req.body.payload;
      // Extract order/payment identifiers (depends on your frontend)
      // Example assuming you set order_id in notes or pass orderId in payload
      const razorpayPayment = payload.payment?.entity;
      if (razorpayPayment && razorpayPayment.notes && razorpayPayment.notes.orderId) {
        const orderId = razorpayPayment.notes.orderId;
        const order = await Order.findById(orderId);
        if (order) {
          order.isPaid = true;
          order.paidAt = Date.now();
          order.paymentResult = {
            id: razorpayPayment.id,
            status: razorpayPayment.status,
            update_time: razorpayPayment.attempts || new Date().toISOString(),
            email_address: razorpayPayment.email
          };
          await order.save();
        }
      }
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Webhook verify error:', err);
    res.status(500).json({ message: 'Webhook handler error' });
  }
};

module.exports = { createPaymentOrder, verifyWebhook };
