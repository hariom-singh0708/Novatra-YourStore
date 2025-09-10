const User = require('../models/User');
const Merchant = require('../models/Merchant');
const Admin = require('../models/Admin');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth');
const { sendEmail, generateOTP, otpTemplate } = require('../utils/email');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

// Get model based on role
const getModelByRole = (role) => {
  switch (role) {
    case 'merchant': return Merchant;
    case 'admin': return Admin;
    default: return User;
  }
};

// Google Login
const googleLoginHandler = async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ message: 'Credential is required' });

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    let user = await findUserByEmail(payload.email);

    if (!user) {
      user = await User.create({
        name: payload.name,
        email: payload.email,
        googleId: payload.sub
      });
    }

    const token = generateToken(user._id, user.role); // Using existing generateToken util
    res.status(200).json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Google login failed' });
  }
};

// Register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, storeName } = req.body;
    const existing = await findUserByEmail(email);
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await hashPassword(password);
    const otpCode = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const Model = getModelByRole(role);

    const payload = { name, email, password: hashedPassword, role, otp: { code: otpCode, expires: otpExpiry } };
    if (role === 'merchant') {
      if (!storeName) return res.status(400).json({ message: "Store name required for merchants" });
      payload.storeName = storeName;
    }

    const user = await Model.create(payload);
    const emailContent = otpTemplate(name, otpCode);
    await sendEmail(email, "Verify Your Email - Novatra", emailContent);

    res.status(201).json({ message: "OTP sent to email", userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  console.log("verifyOTP body:", req.body); // DEBUG
  try {
    const { userId, otp } = req.body;
    const user = await findUserById(userId);
    if (!user || !user.otp?.code || !user.otp?.expires) 
      return res.status(400).json({ message: 'Invalid request or OTP expired' });

    if (new Date(user.otp.expires) < new Date())
      return res.status(400).json({ message: 'OTP expired' });

    if (String(user.otp.code) !== String(otp).trim())
      return res.status(400).json({ message: 'Incorrect OTP' });

    // user.otp = null;
    // await user.save();

    const token = generateToken(user._id, user.role);
    res.status(200).json({ message: 'OTP verified', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Login
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
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Login OTP
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
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Forgot Password
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
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { userId, otp, newPassword } = req.body;
    const user = await findUserById(userId);
    if (!user || !user.otp?.code || !user.otp?.expires)
      return res.status(400).json({ message: 'Invalid OTP or user' });

    if (String(user.otp.code) !== String(otp) || user.otp.expires < new Date())
      return res.status(400).json({ message: 'OTP expired or incorrect' });

    user.password = await hashPassword(newPassword);
    user.otp = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get Profile
const getProfile = async (req, res) => {
  res.status(200).json(req.user);
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const user = req.user;
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.password) user.password = await hashPassword(req.body.password);

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get Me
const getMe = async (req, res) => {
  try {
    const user = await findUserById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
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
  updateProfile,
  getMe,
  googleLoginHandler
};
