const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student reference is required"],
    },
    academicYear: {
      type: String,
      required: [true, "Academic year is required"],
      trim: true,
    },
    semester: {
      type: Number,
      required: [true, "Semester is required"],
      min: [1, "Semester must be at least 1"],
      max: [12, "Semester cannot exceed 12"],
    },
    amount: {
      type: Number,
      required: [true, "Fee amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: [0, "Paid amount cannot be negative"],
    },
    dueAmount: {
      type: Number,
      default: function () {
        return this.amount - (this.paidAmount || 0);
      },
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "partial", "paid", "overdue"],
        message: "Status must be pending, partial, paid, or overdue",
      },
      default: "pending",
    },
    transactionId: {
      type: String,
      default: "",
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

feeSchema.pre("save", function (next) {
  this.dueAmount = Math.max(0, this.amount - (this.paidAmount || 0));

  if (this.paidAmount >= this.amount && this.amount > 0) {
    this.status = "paid";
  } else if (this.paidAmount > 0 && this.paidAmount < this.amount) {
    this.status = "partial";
  } else if (new Date() > new Date(this.dueDate) && this.paidAmount < this.amount) {
    this.status = "overdue";
  } else if (this.paidAmount === 0) {
    this.status = "pending";
  }

  next();
});

const Fee = mongoose.model("Fee", feeSchema);

module.exports = Fee;
