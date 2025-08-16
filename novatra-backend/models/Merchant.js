// models/Merchant.js
const mongoose = require('mongoose');

const merchantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Merchant name is required']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    storeName: {
      type: String,
      required: [true, 'Store name is required']
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ],
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
      }
    ],
    role: {
      type: String,
      enum: ['merchant'],
      default: 'merchant'
    },
    otp: {
      code: String,
      expires: Date
    },
    // NEW: admin must approve merchant before they can sell
    isApproved: {
      type: Boolean,
      default: false
    },
    // optional: keep track if the merchant was notified of approval
    approvedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Merchant', merchantSchema);
