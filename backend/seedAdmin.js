const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const dotenv = require("dotenv");

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI; // replace with your DB

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);

    const existingAdmin = await User.findOne({ email: "admin@erp.com" });
    if (existingAdmin) {
      console.log("Admin already exists ✅");
      process.exit();
    }

    

    const admin = new User({
      name: "Raja sekhar",
      email: "rajaadmin1@gmail.com",
      password: 'raja@2003',
      role: "admin"
    });

    await admin.save();
    console.log("Admin user created 🚀");
    process.exit();
  } catch (err) {
    console.error("Error creating admin:", err);
    process.exit(1);
  }
}

seedAdmin();
