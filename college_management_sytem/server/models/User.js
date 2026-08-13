const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

/**
 * A single "User" collection is used for all four roles (admin, faculty,
 * student, coordinator) instead of separate collections. This is the
 * common "discriminator-style" pattern for role-based systems:
 *
 * - Shared fields (name, email, phone, password, role, ...) live at the
 *   top level.
 * - Role-specific fields (currently only student fields) are added as
 *   optional fields, validated conditionally based on `role`.
 *
 * This keeps auth logic (login/JWT/middleware) simple - it only ever
 * has to deal with ONE model - while still leaving room to add
 * faculty-specific or coordinator-specific fields later without
 * restructuring anything.
 */

const ROLES = ["admin", "faculty", "student", "coordinator"];

const userSchema = new mongoose.Schema(
  {
    // ----- Common fields (all roles) -----
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [100, "Name must be under 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "Please provide a valid email address",
      },
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      validate: {
        validator: (value) => /^[6-9]\d{9}$/.test(value),
        message: "Please provide a valid 10-digit phone number",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false, // never returned by default in queries
    },
    role: {
      type: String,
      enum: {
        values: ROLES,
        message: "Role must be one of: admin, faculty, student, coordinator",
      },
      required: [true, "Role is required"],
      default: "student",
    },
    profileImage: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // ----- Student-specific fields -----
    scholarNumber: {
      type: String,
      unique: true,
      sparse: true, // allows non-student docs to omit this field without violating uniqueness
      index: true,
    },
    department: {
      type: String,
      trim: true,
      required: [
        function () {
          return this.role === "student";
        },
        "Department is required for students",
      ],
    },
    course: {
      type: String,
      trim: true,
      required: [
        function () {
          return this.role === "student";
        },
        "Course is required for students",
      ],
    },
    semester: {
      type: Number,
      min: [1, "Semester must be between 1 and 12"],
      max: [12, "Semester must be between 1 and 12"],
      required: [
        function () {
          return this.role === "student";
        },
        "Semester is required for students",
      ],
    },
    batch: {
      type: String,
      trim: true,
      required: [
        function () {
          return this.role === "student";
        },
        "Batch is required for students",
      ],
    },
    dateOfBirth: {
      type: Date,
      required: [
        function () {
          return this.role === "student";
        },
        "Date of birth is required for students",
      ],
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);



// ----- Hash password before saving (only if modified) -----
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// ----- Instance method: compare a plaintext password to the hash -----
userSchema.methods.comparePassword = async function (candidatePassword) {

  return bcrypt.compare(candidatePassword, this.password);
};

// ----- Instance method: return a "safe" user object (no password) -----
userSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    role: this.role,
    profileImage: this.profileImage,
    isActive: this.isActive,
    scholarNumber: this.scholarNumber,
    department: this.department,
    course: this.course,
    semester: this.semester,
    batch: this.batch,
    dateOfBirth: this.dateOfBirth,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const User = mongoose.model("User", userSchema);

module.exports = User;
