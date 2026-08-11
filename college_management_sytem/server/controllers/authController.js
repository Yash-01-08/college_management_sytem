const User = require("../models/User");
const generateScholarNumber = require("../utils/generateScholarNumber");
const generateTokenAndSetCookie = require("../utils/generateToken");

const PHONE_REGEX = /^[6-9]\d{9}$/;
const SCHOLAR_NUMBER_REGEX = /^\d{10}$/;

/**
 * @route   POST /api/auth/register
 * @desc    Register a new STUDENT (public registration is student-only)
 * @access  Public
 */
const registerStudent = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      department,
      course,
      semester,
      batch,
      dateOfBirth,
    } = req.body;

    // NOTE: `role` and `scholarNumber` are intentionally NEVER read from
    // req.body. Even if the client sends them, they are ignored below.
    // This guarantees public registration can only ever create a student
    // with a backend-generated scholar number.

    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !department ||
      !course ||
      !semester ||
      !batch ||
      !dateOfBirth
    ) {
      return res.status(400).json({
        success: false,
        message:
          "name, email, password, phone, department, course, semester, batch and dateOfBirth are all required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Check for existing email / phone up front for clearer error messages
    // (the schema-level unique index is still the ultimate safety net).
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone number already in use",
      });
    }

    // Backend-generated, never trusted from the client.
    const scholarNumber = await generateScholarNumber(User);

    const student = await User.create({
      name,
      email,
      password,
      phone,
      department,
      course,
      semester,
      batch,
      dateOfBirth,
      role: "student", // forced, regardless of what the client sent
      scholarNumber, // forced, regardless of what the client sent
    });

    generateTokenAndSetCookie(res, {
      userId: student._id,
      role: student.role,
      scholarNumber: student.scholarNumber,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: student.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Log in a student using phone number OR scholar number
 * @access  Public
 */
const loginStudent = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "identifier and password are required",
      });
    }

    const trimmedIdentifier = String(identifier).trim();

    let query;
    if (PHONE_REGEX.test(trimmedIdentifier)) {
      query = { phone: trimmedIdentifier, role: "student" };
    } else if (SCHOLAR_NUMBER_REGEX.test(trimmedIdentifier)) {
      query = { scholarNumber: trimmedIdentifier, role: "student" };
    } else {
      // Doesn't look like either a valid phone or scholar number.
      // Respond generically to avoid hinting at the expected format
      // for enumeration purposes.
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const student = await User.findOne(query).select("+password");

    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!student.isActive) {
      // Deliberately generic — do not reveal that the account exists
      // but is deactivated, to avoid account enumeration.
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordCorrect = await student.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    generateTokenAndSetCookie(res, {
      userId: student._id,
      role: student.role,
      scholarNumber: student.scholarNumber,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: student.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Clear the authentication cookie
 * @access  Public
 */
const logout = async (req, res, next) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Return the currently authenticated user's safe profile
 * @access  Private (requires authMiddleware)
 */
const getCurrentUser = async (req, res, next) => {
  try {
    // req.user is attached by authMiddleware
    return res.status(200).json({
      success: true,
      message: "Current user fetched successfully",
      user: req.user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerStudent,
  loginStudent,
  logout,
  getCurrentUser,
};
