const mongoose = require("mongoose");

const assignmentSubmissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: [true, "Assignment reference is required"],
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student reference is required"],
    },
    solutionText: {
      type: String,
      default: "",
    },
    file: {
      name: { type: String, default: "" },
      url: { type: String, default: "" },
      fileType: { type: String, default: "" },
    },
    githubLink: {
      type: String,
      default: "",
      trim: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    isLate: {
      type: Boolean,
      default: false,
    },
    marksObtained: {
      type: Number,
      default: null,
    },
    feedback: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: {
        values: ["submitted", "late", "reviewed", "resubmission_requested"],
        message: "Status must be submitted, late, reviewed, or resubmission_requested",
      },
      default: "submitted",
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index so a student submits only once per assignment
assignmentSubmissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

const AssignmentSubmission = mongoose.model("AssignmentSubmission", assignmentSubmissionSchema);

module.exports = AssignmentSubmission;
