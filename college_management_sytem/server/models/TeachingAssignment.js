const mongoose = require("mongoose");

const teachingAssignmentSchema = new mongoose.Schema(
  {
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Faculty user is required for assignment"],
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: [true, "Subject is required for assignment"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required for assignment"],
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
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent duplicate teaching assignments
teachingAssignmentSchema.index({ faculty: 1, subject: 1, academicYear: 1 }, { unique: true });

const TeachingAssignment = mongoose.model("TeachingAssignment", teachingAssignmentSchema);

module.exports = TeachingAssignment;
