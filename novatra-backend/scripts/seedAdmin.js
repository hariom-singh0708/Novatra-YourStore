// scripts/seedAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const { hashPassword } = require('../utils/auth');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@novatra.com';
  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log('Admin already exists');
    process.exit(0);
  }
  const admin = new Admin({
    name: 'Owner',
    email,
    password: await hashPassword(process.env.SEED_ADMIN_PASS || 'Admin@123')
  });
  await admin.save();
  console.log('Admin created:', admin.email);
  process.exit(0);
};
run().catch((e) => { console.error(e); process.exit(1); });
