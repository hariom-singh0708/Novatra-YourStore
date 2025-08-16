const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const { protect, authorize } = require('../middleware/auth');
const { ensureMerchantApproved } = require('../middleware/merchantApproval');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected: merchants (must be approved) or admin
router.post(
  '/',
  protect,
  authorize('merchant','admin'),
  ensureMerchantApproved,
  [
    body('name').notEmpty(),
    body('price').isNumeric(),
    body('images').isArray().optional(),
    body('stock').isInt({ min: 0 }).optional()
  ],
  (req, res, next) => {
    const { validationResult } = require('express-validator');
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  createProduct
);

router.put('/:id', protect, authorize('merchant','admin'), ensureMerchantApproved, updateProduct);
router.delete('/:id', protect, authorize('merchant','admin'), ensureMerchantApproved, deleteProduct);

module.exports = router;
