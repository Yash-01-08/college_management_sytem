const express = require("express");
const {
  registerStudent,
  loginStudent,
  logout,
  getCurrentUser,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.post("/logout", logout);

// Protected route
router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;
