const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  getAllUsers,
  getAllMerchants,
  setMerchantApproval,
  deleteMerchant,
  getAllProductsAdmin,
  getAllOrders
} = require('../controllers/adminController');

const { protect, authorize } = require('../middleware/auth');

// All admin routes require admin role
router.use(protect, authorize('admin'));

router.get('/analytics', getAnalytics);
router.get('/users', getAllUsers);
router.get('/merchants', getAllMerchants);
router.patch('/merchants/:id/approval', setMerchantApproval); // body: { approve: true|false }
router.delete('/merchants/:id', deleteMerchant);
router.get('/products', getAllProductsAdmin);
router.get('/orders', getAllOrders);

module.exports = router;
