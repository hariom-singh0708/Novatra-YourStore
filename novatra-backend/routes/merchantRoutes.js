const express = require("express");
const router = express.Router();
const {
  registerMerchant,
  loginMerchant,
  getMerchantProfile,
  updateMerchantProfile,
  getMerchantOrders
} = require("../controllers/merchantController");

const { protect, authorize } = require("../middleware/auth");

// Public
router.post("/register", registerMerchant);
router.post("/login", loginMerchant);

// Protected (Merchant only)
router.get("/profile", protect, authorize, getMerchantProfile);
router.put("/profile", protect, authorize, updateMerchantProfile);
router.get("/orders", protect, authorize, getMerchantOrders);

module.exports = router;
