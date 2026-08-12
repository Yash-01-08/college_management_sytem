const mongoose = require("mongoose");
const User = require("../models/User");
const Course = require("../models/Course");
const Subject = require("../models/Subject");
const Enrollment = require("../models/Enrollment");
const Attendance = require("../models/Attendance");
const Result = require("../models/Result");
const Timetable = require("../models/Timetable");
const Fee = require("../models/Fee");
const Event = require("../models/Event");
const Notification = require("../models/Notification");

// GET /api/student/profile
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("department", "name code")
      .populate("course", "name code duration totalSemesters");

    return res.status(200).json({
      success: true,
      message: "Student profile fetched successfully",
      data: {
        user: user.toSafeObject(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/student/courses
const getCourses = async (req, res, next) => {
  try {
    let courses;
    if (req.user.course) {
      courses = await Course.find({ _id: req.user.course, isActive: true }).populate("department", "name code");
    } else {
      courses = await Course.find({ isActive: true }).populate("department", "name code");
    }

    return res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: { courses },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/student/subjects
const getSubjects = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id, status: "active" }).populate({
      path: "subject",
      populate: { path: "course", select: "name code" },
    });

    let subjects = enrollments.map((e) => e.subject).filter(Boolean);

    // Fallback if not explicitly enrolled in subjects yet: return subjects for student's course and semester
    if (subjects.length === 0 && req.user.course && req.user.semester) {
      subjects = await Subject.find({
        course: req.user.course,
        semester: req.user.semester,
        isActive: true,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Subjects fetched successfully",
      data: { subjects },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/student/enrollment
const getEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate("subject", "name code semester credits type")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Enrollments fetched successfully",
      data: { enrollments },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/student/enrollment
const createEnrollment = async (req, res, next) => {
  try {
    const { subjectId, academicYear, semester } = req.body;

    if (!subjectId || !academicYear) {
      return res.status(400).json({
        success: false,
        message: "subjectId and academicYear are required",
      });
    }

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    const existing = await Enrollment.findOne({
      student: req.user._id,
      subject: subjectId,
      academicYear,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Already enrolled in this subject for the specified academic year",
      });
    }

    const enrollment = await Enrollment.create({
      student: req.user._id, // Enforce logged-in student ID
      subject: subjectId,
      semester: semester || subject.semester || req.user.semester || 1,
      academicYear,
      status: "active",
    });

    return res.status(201).json({
      success: true,
      message: "Enrolled in subject successfully",
      data: { enrollment },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/student/attendance
const getAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.find({ student: req.user._id })
      .populate("subject", "name code")
      .populate("faculty", "name email")
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      message: "Attendance fetched successfully",
      data: { attendance },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/student/results
const getResults = async (req, res, next) => {
  try {
    // ALWAYS force student = req.user._id. Ignore frontend studentId inputs.
    const results = await Result.find({ student: req.user._id })
      .populate("subject", "name code credits")
      .sort({ semester: 1 });

    return res.status(200).json({
      success: true,
      message: "Results fetched successfully",
      data: { results },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/student/timetable
const getTimetable = async (req, res, next) => {
  try {
    const query = {};
    if (req.user.course) query.course = req.user.course;
    if (req.user.semester) query.semester = req.user.semester;

    const timetable = await Timetable.find(query)
      .populate("subject", "name code type")
      .populate("faculty", "name email")
      .sort({ day: 1, startTime: 1 });

    return res.status(200).json({
      success: true,
      message: "Timetable fetched successfully",
      data: { timetable },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/student/fees
const getFees = async (req, res, next) => {
  try {
    const fees = await Fee.find({ student: req.user._id }).sort({ dueDate: -1 });

    return res.status(200).json({
      success: true,
      message: "Fees fetched successfully",
      data: { fees },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/student/events
const getEvents = async (req, res, next) => {
  try {
    const filter = {
      isPublished: true,
      $or: [{ department: null }],
    };

    if (req.user.department && mongoose.Types.ObjectId.isValid(req.user.department)) {
      filter.$or.push({ department: req.user.department });
    }

    const events = await Event.find(filter)
      .populate("department", "name code")
      .populate("createdBy", "name role")
      .sort({ startDate: 1 });

    return res.status(200).json({
      success: true,
      message: "Events fetched successfully",
      data: { events },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/student/notifications
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      data: { notifications },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  getCourses,
  getSubjects,
  getEnrollments,
  createEnrollment,
  getAttendance,
  getResults,
  getTimetable,
  getFees,
  getEvents,
  getNotifications,
};
