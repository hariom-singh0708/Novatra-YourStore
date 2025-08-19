const express = require('express');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const googleLoginHandler = require('../controllers/userController');

const {
  registerUser,
  verifyOTP,
  loginUser,
  loginUserOTP,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  getMe 
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const router = express.Router();

// router.post('/google-login', googleLoginHandler);


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
router.get("/me", protect, getMe);
// Private routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
