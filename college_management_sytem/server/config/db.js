const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/college_management";

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    if (!process.env.MONGO_URI) {
      console.warn("Hint: MONGO_URI is missing from process.env. Using default fallback.");
    }
  }
};

module.exports = connectDB;
