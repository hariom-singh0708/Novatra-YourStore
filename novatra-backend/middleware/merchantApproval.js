// middleware/merchantApproval.js
// Use after `protect` so req.user exists
const ensureMerchantApproved = (req, res, next) => {
  // Only relevant for merchants
  if (req.user && req.user.role === 'merchant') {
    // treat undefined as false (safe for existing records)
    if (!req.user.isApproved) {
      return res.status(403).json({ message: 'Merchant account not approved by admin. Contact administrator.' });
    }
  }
  next();
};

module.exports = { ensureMerchantApproved };
