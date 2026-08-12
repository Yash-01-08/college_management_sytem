const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student reference is required"],
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: [true, "Subject reference is required"],
    },
    semester: {
      type: Number,
      required: [true, "Semester is required"],
      min: [1, "Semester must be at least 1"],
      max: [12, "Semester cannot exceed 12"],
    },
    academicYear: {
      type: String,
      required: [true, "Academic year is required"],
      trim: true,
    },
    internalMarks: {
      type: Number,
      default: 0,
      min: [0, "Internal marks cannot be negative"],
    },
    externalMarks: {
      type: Number,
      default: 0,
      min: [0, "External marks cannot be negative"],
    },
    totalMarks: {
      type: Number,
      default: 0,
    },
    grade: {
      type: String,
      default: "F",
    },
    gradePoint: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: {
        values: ["pass", "fail", "backlog"],
        message: "Status must be pass, fail, or backlog",
      },
      default: "fail",
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save calculation helper for totalMarks, grade, gradePoint, and status
resultSchema.pre("save", function (next) {
  this.totalMarks = (this.internalMarks || 0) + (this.externalMarks || 0);

  if (this.totalMarks >= 90) {
    this.grade = "A+";
    this.gradePoint = 10;
    this.status = "pass";
  } else if (this.totalMarks >= 80) {
    this.grade = "A";
    this.gradePoint = 9;
    this.status = "pass";
  } else if (this.totalMarks >= 70) {
    this.grade = "B";
    this.gradePoint = 8;
    this.status = "pass";
  } else if (this.totalMarks >= 60) {
    this.grade = "C";
    this.gradePoint = 7;
    this.status = "pass";
  } else if (this.totalMarks >= 50) {
    this.grade = "D";
    this.gradePoint = 6;
    this.status = "pass";
  } else if (this.totalMarks >= 40) {
    this.grade = "E";
    this.gradePoint = 5;
    this.status = "pass";
  } else {
    this.grade = "F";
    this.gradePoint = 0;
    this.status = "fail";
  }

  next();
});

// Compound unique index to prevent duplicate result entries
resultSchema.index({ student: 1, subject: 1, academicYear: 1, semester: 1 }, { unique: true });

const Result = mongoose.model("Result", resultSchema);

module.exports = Result;
