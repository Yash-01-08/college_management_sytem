require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/college_management";
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
      console.log("Connected to MongoDB for admin seeding...");
    }

    const adminEmail = (process.env.ADMIN_EMAIL || "admin@college.edu").toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123456";
    const adminName = process.env.ADMIN_NAME || "System Admin";
    const adminPhone = process.env.ADMIN_PHONE || "9999999999";

    const existingAdmin = await User.findOne({
      $or: [{ email: adminEmail }, { role: "admin" }],
    });

    if (existingAdmin) {
      console.log(`Admin account already exists (${existingAdmin.email}). Skipping seed.`);
      return existingAdmin;
    }

    const admin = await User.create({
      name: adminName,
      email: adminEmail,
      phone: adminPhone,
      password: adminPassword, // pre-save hook hashes password with bcrypt
      role: "admin",
      isActive: true,
    });

    console.log(`Admin created successfully! Email: ${admin.email}`);
    return admin;
  } catch (error) {
    console.error("Error seeding admin user:", error.message);
    throw error;
  }
};

if (require.main === module) {
  seedAdmin().then(() => {
    mongoose.connection.close();
    process.exit(0);
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = seedAdmin;
