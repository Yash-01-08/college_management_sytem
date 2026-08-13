const mongoose = require("mongoose");
const User = require("../models/User");
const TeachingAssignment = require("../models/TeachingAssignment");
const Subject = require("../models/Subject");
const Enrollment = require("../models/Enrollment");
const Attendance = require("../models/Attendance");
const Result = require("../models/Result");
const Timetable = require("../models/Timetable");
const Event = require("../models/Event");
const Notification = require("../models/Notification");
const Assignment = require("../models/Assignment");
const AssignmentSubmission = require("../models/AssignmentSubmission");

// GET /api/faculty/profile
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("department", "name code");

    return res.status(200).json({
      success: true,
      message: "Faculty profile fetched successfully",
      data: {
        user: user.toSafeObject(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/faculty/subjects
const getAssignedSubjects = async (req, res, next) => {
  try {
    const assignments = await TeachingAssignment.find({ faculty: req.user._id })
      .populate({
        path: "subject",
        select: "name code credits type semester",
        populate: { path: "course", select: "name code" },
      })
      .populate("course", "name code");

    return res.status(200).json({
      success: true,
      message: "Assigned subjects fetched successfully",
      data: { assignments },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/faculty/students
const getStudents = async (req, res, next) => {
  try {
    // Find all subject IDs assigned to this faculty
    const assignments = await TeachingAssignment.find({ faculty: req.user._id });
    const subjectIds = assignments.map((a) => a.subject);

    const enrollments = await Enrollment.find({ subject: { $in: subjectIds } })
      .populate("student", "name email phone scholarNumber batch semester course department")
      .populate("subject", "name code");

    return res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      data: { enrollments },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/faculty/attendance
const getAttendance = async (req, res, next) => {
  try {
    const { subjectId, date } = req.query;
    const query = { faculty: req.user._id };

    if (subjectId) query.subject = subjectId;
    if (date) {
      const d = new Date(date);
      const start = new Date(d.setHours(0, 0, 0, 0));
      const end = new Date(d.setHours(23, 59, 59, 999));
      query.date = { $gte: start, $lte: end };
    }

    const attendance = await Attendance.find(query)
      .populate("student", "name scholarNumber email")
      .populate("subject", "name code")
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      message: "Attendance records fetched successfully",
      data: { attendance },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/faculty/attendance
const markAttendance = async (req, res, next) => {
  try {
    const { studentId, subjectId, date, status, remarks } = req.body;

    if (!studentId || !subjectId || !date || !status) {
      return res.status(400).json({
        success: false,
        message: "studentId, subjectId, date, and status are required",
      });
    }

    // CRITICAL SECURITY CHECK: Verify faculty is assigned to this subject
    const isAssigned = await TeachingAssignment.findOne({
      faculty: req.user._id,
      subject: subjectId,
    });

    if (!isAssigned) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to mark attendance for this subject",
      });
    }

    const attendanceDate = new Date(date);

    // Prevent duplicate attendance for student, subject, and date
    const existing = await Attendance.findOne({
      student: studentId,
      subject: subjectId,
      date: attendanceDate,
    });

    if (existing) {
      existing.status = status;
      if (remarks !== undefined) existing.remarks = remarks;
      await existing.save();

      return res.status(200).json({
        success: true,
        message: "Attendance updated successfully",
        data: { attendance: existing },
      });
    }

    const attendance = await Attendance.create({
      student: studentId,
      subject: subjectId,
      faculty: req.user._id,
      date: attendanceDate,
      status,
      remarks: remarks || "",
    });

    return res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      data: { attendance },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/faculty/attendance/:id
const updateAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    const attendance = await Attendance.findById(id);
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    // Verify faculty assignment for subject
    const isAssigned = await TeachingAssignment.findOne({
      faculty: req.user._id,
      subject: attendance.subject,
    });

    if (!isAssigned && String(attendance.faculty) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update attendance for this subject",
      });
    }

    if (status) attendance.status = status;
    if (remarks !== undefined) attendance.remarks = remarks;
    await attendance.save();

    return res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      data: { attendance },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/faculty/results
const getResults = async (req, res, next) => {
  try {
    const assignments = await TeachingAssignment.find({ faculty: req.user._id });
    const subjectIds = assignments.map((a) => a.subject);

    const results = await Result.find({ subject: { $in: subjectIds } })
      .populate("student", "name scholarNumber email")
      .populate("subject", "name code");

    return res.status(200).json({
      success: true,
      message: "Results fetched successfully",
      data: { results },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/faculty/results
const createResult = async (req, res, next) => {
  try {
    const { studentId, subjectId, semester, academicYear, internalMarks, externalMarks } = req.body;

    if (!studentId || !subjectId || !semester || !academicYear) {
      return res.status(400).json({
        success: false,
        message: "studentId, subjectId, semester, and academicYear are required",
      });
    }

    // CRITICAL SECURITY CHECK: Verify faculty assignment
    const isAssigned = await TeachingAssignment.findOne({
      faculty: req.user._id,
      subject: subjectId,
    });

    if (!isAssigned) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to enter results for this subject",
      });
    }

    const result = await Result.create({
      student: studentId,
      subject: subjectId,
      semester: Number(semester),
      academicYear,
      internalMarks: Number(internalMarks) || 0,
      externalMarks: Number(externalMarks) || 0,
    });

    return res.status(201).json({
      success: true,
      message: "Result created successfully",
      data: { result },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/faculty/results/:id
const updateResult = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { internalMarks, externalMarks, status } = req.body;

    const result = await Result.findById(id);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result record not found",
      });
    }

    // Verify faculty assignment
    const isAssigned = await TeachingAssignment.findOne({
      faculty: req.user._id,
      subject: result.subject,
    });

    if (!isAssigned) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update results for this subject",
      });
    }

    if (internalMarks !== undefined) result.internalMarks = Number(internalMarks);
    if (externalMarks !== undefined) result.externalMarks = Number(externalMarks);
    if (status) result.status = status;

    await result.save();

    return res.status(200).json({
      success: true,
      message: "Result updated successfully",
      data: { result },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/faculty/timetable
const getTimetable = async (req, res, next) => {
  try {
    const timetable = await Timetable.find({ faculty: req.user._id })
      .populate("subject", "name code")
      .populate("course", "name code")
      .sort({ day: 1, startTime: 1 });

    return res.status(200).json({
      success: true,
      message: "Teaching timetable fetched successfully",
      data: { timetable },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/faculty/events
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

// GET /api/faculty/notifications
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

const getDashboard = async (req, res, next) => {
  try {
    const facultyId = req.user._id;

    // 1. Assigned subjects count
    const assignments = await TeachingAssignment.find({ faculty: facultyId })
      .populate({
        path: "subject",
        select: "name code credits type semester",
        populate: { path: "course", select: "name code" },
      })
      .populate("course", "name code");
    const assignedSubjectsCount = assignments.length;

    // 2. Total students count across assigned subjects
    const subjectIds = assignments.map((a) => a.subject?._id || a.subject).filter(Boolean);
    const enrollments = await Enrollment.find({ subject: { $in: subjectIds } }).distinct("student");
    const totalStudentsCount = enrollments.length;

    // 3. Today's classes / timetable
    const timetable = await Timetable.find({ faculty: facultyId })
      .populate("subject", "name code")
      .populate("course", "name code");

    // 4. Attendance count marked
    const attendanceCount = await Attendance.countDocuments({ faculty: facultyId });

    // 5. Unread notifications count & list
    const notifications = await Notification.find({ recipient: facultyId })
      .sort({ createdAt: -1 })
      .limit(5);
    const unreadNotificationsCount = await Notification.countDocuments({
      recipient: facultyId,
      isRead: false,
    });

    // 6. Events
    const events = await Event.find({ isPublished: true }).sort({ startDate: 1 }).limit(4);

    // 7. Pending Submissions
    const facultyAssignments = await Assignment.find({ faculty: facultyId });
    const assignmentIds = facultyAssignments.map((a) => a._id);
    const pendingSubmissionsCount = await AssignmentSubmission.countDocuments({
      assignment: { $in: assignmentIds },
      status: { $in: ["submitted", "late"] },
    });

    return res.status(200).json({
      success: true,
      message: "Faculty dashboard metrics fetched successfully",
      data: {
        metrics: {
          assignedSubjectsCount,
          totalStudentsCount,
          todaysClassesCount: timetable.length,
          pendingSubmissionsCount,
          attendanceCount,
          unreadNotificationsCount,
        },
        assignments,
        timetable,
        events,
        notifications,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/faculty/assignments
const createAssignment = async (req, res, next) => {
  try {
    const { title, description, subjectId, courseId, semester, academicYear, deadline, maxMarks, rubric } = req.body;

    if (!title || !description || !subjectId || !deadline) {
      return res.status(400).json({
        success: false,
        message: "Title, description, subjectId, and deadline are required",
      });
    }

    const isAssigned = await TeachingAssignment.findOne({
      faculty: req.user._id,
      subject: subjectId,
    });

    if (!isAssigned) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to create assignments for this subject",
      });
    }

    const subjectObj = await Subject.findById(subjectId);
    const courseIdFinal = courseId || subjectObj?.course || isAssigned.course;
    const semesterFinal = semester || subjectObj?.semester || isAssigned.semester || 1;
    const academicYearFinal = academicYear || isAssigned.academicYear || "2024-2025";

    const assignment = await Assignment.create({
      title,
      description,
      subject: subjectId,
      course: courseIdFinal,
      faculty: req.user._id,
      semester: semesterFinal,
      academicYear: academicYearFinal,
      deadline: new Date(deadline),
      maxMarks: maxMarks || 100,
      rubric: rubric || "",
      status: "published",
    });

    const enrollments = await Enrollment.find({ subject: subjectId, status: "active" });
    for (const e of enrollments) {
      await Notification.create({
        recipient: e.student,
        title: "New Assignment Published",
        message: `A new assignment "${title}" has been published. Deadline: ${new Date(deadline).toLocaleDateString()}.`,
        type: "announcement",
        referenceId: assignment._id,
      }).catch(() => {});
    }

    return res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      data: { assignment },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/faculty/assignments
const getFacultyAssignments = async (req, res, next) => {
  try {
    const assignments = await Assignment.find({ faculty: req.user._id })
      .populate("subject", "name code")
      .populate("course", "name code")
      .sort({ createdAt: -1 });

    const assignmentsWithSubmissions = await Promise.all(
      assignments.map(async (a) => {
        const submissionCount = await AssignmentSubmission.countDocuments({ assignment: a._id });
        return {
          ...a.toObject(),
          submissionCount,
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: "Faculty assignments fetched successfully",
      data: { assignments: assignmentsWithSubmissions },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/faculty/assignments/:id/submissions
const getAssignmentSubmissions = async (req, res, next) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id).populate("subject", "name code");

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    if (String(assignment.faculty) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view submissions for this assignment",
      });
    }

    const submissions = await AssignmentSubmission.find({ assignment: id })
      .populate("student", "name email scholarNumber department course semester")
      .sort({ submittedAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Submissions fetched successfully",
      data: { assignment, submissions },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/faculty/submissions/:id/review
const reviewSubmission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { marksObtained, feedback } = req.body;

    const submission = await AssignmentSubmission.findById(id).populate("assignment");
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    if (String(submission.assignment.faculty) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to review this submission",
      });
    }

    submission.marksObtained = marksObtained !== undefined ? Number(marksObtained) : submission.marksObtained;
    submission.feedback = feedback !== undefined ? feedback : submission.feedback;
    submission.status = "reviewed";
    submission.reviewedAt = new Date();
    submission.reviewedBy = req.user._id;

    await submission.save();

    await Notification.create({
      recipient: submission.student,
      title: "Assignment Graded",
      message: `Your submission for "${submission.assignment.title}" has been graded: ${submission.marksObtained}/${submission.assignment.maxMarks}`,
      type: "result",
      referenceId: submission._id,
    }).catch(() => {});

    return res.status(200).json({
      success: true,
      message: "Submission reviewed successfully",
      data: { submission },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  getDashboard,
  getAssignedSubjects,
  getStudents,
  getAttendance,
  markAttendance,
  updateAttendance,
  getResults,
  createResult,
  updateResult,
  getTimetable,
  getEvents,
  getNotifications,
  createAssignment,
  getFacultyAssignments,
  getAssignmentSubmissions,
  reviewSubmission,
};

