// scripts/seedAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/Admin");
const { hashPassword } = require("../utils/auth");

const run = async () => {
  try {
    // 1. Connect to DB
    await mongoose.connect("mongodb://127.0.0.1:27017/Novatra", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // 2. Admin details from ENV or defaults
    const email = process.env.SEED_ADMIN_EMAIL || "admin@gmail.com";
    const password = process.env.SEED_ADMIN_PASS || "123456";
    const name = process.env.SEED_ADMIN_NAME || "Thakur-Sahab";

    // 3. Check if admin already exists
    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log("⚠️ Admin already exists:", existing.email);
      process.exit(0);
    }

    // 4. Create new admin
    const admin = new Admin({
      name,
      email,
      password: await hashPassword(password),
    });

    await admin.save();
    console.log("✅ Admin created successfully:", admin.email);

    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding admin:", err.message);
    process.exit(1);
  }
};

run();
