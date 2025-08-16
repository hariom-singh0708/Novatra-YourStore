const Razorpay = require('razorpay');

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create order
const createRazorpayOrder = async (amount, currency = 'INR') => {
  const options = {
    amount: amount * 100, // amount in paise
    currency,
    payment_capture: 1
  };
  const order = await razorpayInstance.orders.create(options);
  return order;
};

module.exports = { createRazorpayOrder };
