const User = require('../models/User');
const Merchant = require('../models/Merchant');
const Admin = require('../models/Admin');

const { hashPassword, comparePassword, generateToken } = require('../utils/auth');
const { sendEmail, generateOTP, otpTemplate } = require('../utils/email');

// Helper: Find user in any collection
const findUserByEmail = async (email) => {
  return (
    (await User.findOne({ email })) ||
    (await Merchant.findOne({ email })) ||
    (await Admin.findOne({ email }))
  );
};

const findUserById = async (id) => {
  return (
    (await User.findById(id)) ||
    (await Merchant.findById(id)) ||
    (await Admin.findById(id))
  );
};

// Helper: Get model based on role
const getModelByRole = (role) => {
  switch (role) {
    case 'merchant': return Merchant;
    case 'admin': return Admin;
    default: return User;
  }
};

// @desc    Register user/merchant/admin
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await findUserByEmail(email);
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await hashPassword(password);
    const otpCode = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const Model = getModelByRole(role);
    const user = await Model.create({
      name,
      email,
      password: hashedPassword,
      role,
      otp: { code: otpCode, expires: otpExpiry }
    });

    const emailContent = otpTemplate(name, otpCode);
    await sendEmail(email, 'Verify Your Email - Novatra', emailContent);

    res.status(201).json({ message: 'OTP sent to email', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await findUserById(userId);
    if (!user || !user.otp?.code || !user.otp?.expires)
      return res.status(400).json({ message: 'Invalid request or OTP expired' });

    if (new Date(user.otp.expires) < new Date())
      return res.status(400).json({ message: 'OTP expired' });

    if (user.otp.code !== String(otp).trim())
      return res.status(400).json({ message: 'Incorrect OTP' });

    user.otp = null;
    await user.save();

    const token = generateToken(user._id, user.role);
    res.status(200).json({ message: 'OTP verified', token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Login with email/password
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id, user.role);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login with OTP
const loginUserOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otpCode = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = { code: otpCode, expires: otpExpiry };
    await user.save();

    const emailContent = otpTemplate(user.name, otpCode);
    await sendEmail(email, 'Novatra Login OTP', emailContent);

    res.status(200).json({ message: 'OTP sent to email', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot password (send OTP)
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otpCode = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = { code: otpCode, expires: otpExpiry };
    await user.save();

    const emailContent = otpTemplate(user.name, otpCode);
    await sendEmail(email, 'Password Reset OTP - Novatra', emailContent);

    res.status(200).json({ message: 'OTP sent to email', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset password
const resetPassword = async (req, res) => {
  try {
    const { userId, otp, newPassword } = req.body;
    const user = await findUserById(userId);
    if (!user || !user.otp?.code || !user.otp?.expires)
      return res.status(400).json({ message: 'Invalid OTP or user' });

    if (user.otp.code !== otp || user.otp.expires < new Date())
      return res.status(400).json({ message: 'OTP expired or incorrect' });

    user.password = await hashPassword(newPassword);
    user.otp = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get profile
const getProfile = async (req, res) => {
  res.status(200).json(req.user);
};

// @desc    Update profile
const updateProfile = async (req, res) => {
  try {
    const user = req.user;

    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.password) user.password = await hashPassword(req.body.password);

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  verifyOTP,
  loginUser,
  loginUserOTP,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile
};
