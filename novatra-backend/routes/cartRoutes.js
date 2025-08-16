const express = require('express');
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart
} = require('../controllers/cartController');

const { protect } = require('../middleware/auth');

// Wishlist routes
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/:productId', protect, addToWishlist);
router.delete('/wishlist/:productId', protect, removeFromWishlist);

// Cart routes
router.get('/cart', protect, getCart);
router.post('/cart', protect, addToCart);
router.patch('/cart/:productId', protect, updateCartItem);
router.delete('/cart/:productId', protect, removeFromCart);

module.exports = router;
