const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Assignment title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Assignment description is required"],
      trim: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: [true, "Subject reference is required"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course reference is required"],
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Faculty reference is required"],
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
    deadline: {
      type: Date,
      required: [true, "Assignment deadline is required"],
    },
    attachments: [
      {
        name: String,
        url: String,
      },
    ],
    rubric: {
      type: String,
      default: "",
    },
    maxMarks: {
      type: Number,
      default: 100,
      min: [1, "Max marks must be at least 1"],
    },
    status: {
      type: String,
      enum: {
        values: ["published", "draft", "closed"],
        message: "Status must be published, draft, or closed",
      },
      default: "published",
    },
  },
  {
    timestamps: true,
  }
);

const Assignment = mongoose.model("Assignment", assignmentSchema);

module.exports = Assignment;
