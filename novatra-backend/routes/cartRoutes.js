const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearUserCart
} = require("../controllers/cartController");
const { protect } = require("../middleware/auth");

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.put("/:productId", protect, updateCartItem);
router.delete("/:productId", protect, removeFromCart);
router.post("/clear", protect, clearUserCart);

module.exports = router;
