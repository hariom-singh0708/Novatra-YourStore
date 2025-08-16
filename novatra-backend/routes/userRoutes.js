const express = require('express');
const { body, validationResult } = require('express-validator');

const {
  registerUser,
  verifyOTP,
  loginUser,
  loginUserOTP,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile
} = require('../controllers/userController');

const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * NOTE:
 * OTP limiter removed here to avoid middleware mounting issues.
 * If you want rate limiting later, add it as route-level middleware
 * (e.g. router.post('/register', otpLimiter, validators..., handler))
 * or use a separate middleware/route file (not app.use(path, limiter)).
 */

// Public routes with validation
router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name too short'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  registerUser
);

router.post('/verify-otp', verifyOTP);
router.post('/login', loginUser);
router.post('/login-otp', loginUserOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Private routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
