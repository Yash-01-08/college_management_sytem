const User = require("../models/User");
const generateScholarNumber = require("../utils/generateScholarNumber");
const generateTokenAndSetCookie = require("../utils/generateToken");

const PHONE_REGEX = /^[6-9]\d{9}$/;

/**
 * @route   POST /api/auth/register
 * @desc    Public registration for student, faculty, and coordinator (admin prohibited)
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role = "student",
      department,
      course,
      semester,
      batch,
      dateOfBirth,
      scholarNumber: customScholarNumber,
    } = req.body;

    // Reject admin registration via public endpoint
    if (role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Admin registration is not allowed through public endpoint",
      });
    }

    const allowedRoles = ["student", "faculty", "coordinator"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Role must be one of: ${allowedRoles.join(", ")}`,
      });
    }

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone, and password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    if (!PHONE_REGEX.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid 10-digit phone number",
      });
    }

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

    const userData = {
      name,
      email,
      password,
      phone,
      role,
      department: department || undefined,
    };

    if (role === "student") {
      if (!department || !course || !semester || !batch || !dateOfBirth) {
        return res.status(400).json({
          success: false,
          message:
            "department, course, semester, batch, and dateOfBirth are required for student registration",
        });
      }
      userData.department = department;
      userData.course = course;
      userData.semester = Number(semester);
      userData.batch = batch;
      userData.dateOfBirth = dateOfBirth;
      userData.scholarNumber =
        customScholarNumber || (await generateScholarNumber(User));
    }

    const user = await User.create(userData);

    generateTokenAndSetCookie(res, {
      userId: user._id,
      role: user.role,
      scholarNumber: user.scholarNumber,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        user: user.toSafeObject(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Log in for all roles (email/identifier + password + role)
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, identifier, password, role: requestedRole } = req.body;
    const rawId = email || identifier || req.body.loginId || "";
    const loginId = String(rawId).trim();

    if (!loginId || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/identifier and password are required",
      });
    }

    // Query user by phone, scholarNumber, or email
    const user = await User.findOne({
      $or: [
        { phone: loginId },
        { scholarNumber: loginId },
        { email: loginId.toLowerCase() },
      ],
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is inactive",
      });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Role check: backend authorization is the final authority
    if (requestedRole && requestedRole !== user.role) {
      return res.status(403).json({
        success: false,
        message: "Invalid role for this account",
      });
    }

    generateTokenAndSetCookie(res, {
      userId: user._id,
      role: user.role,
      scholarNumber: user.scholarNumber,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: user.toSafeObject(),
      },
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
      message: "Logged out successfully",
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
    return res.status(200).json({
      success: true,
      data: {
        user: req.user.toSafeObject(),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  // Backwards compatibility aliases if needed internally
  registerStudent: register,
  loginStudent: login,
};
