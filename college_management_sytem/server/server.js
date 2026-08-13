const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
require("dotenv").config(); // fallback to root .env if present

const app = require("./app");
const connectDB = require("./config/db");
const seedAdmin = require("./seed/seedAdmin");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  
  try {
    await seedAdmin();
  } catch (err) {
    console.warn("Warning: Admin auto-seed skipped or failed:", err.message);
  }

  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV } mode on port ${PORT}`);
  });
};

startServer();

// Safety net for unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  process.exit(1);
});
