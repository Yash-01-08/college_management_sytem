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
const Announcement = require("../models/Announcement");
const Assignment = require("../models/Assignment");
const AssignmentSubmission = require("../models/AssignmentSubmission");

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

// PUT /api/student/notifications/:id/read
const markNotificationRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOne({ _id: id, recipient: req.user._id });
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: { notification },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/student/notifications/read-all
const markAllNotificationsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/student/notifications/:id
const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOneAndDelete({ _id: id, recipient: req.user._id });
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/student/announcements
const getAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.find({
      $or: [
        { targetRole: "all" },
        { targetRole: "student" },
        { targetDepartment: req.user.department },
      ],
    })
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Announcements fetched successfully",
      data: { announcements },
    });
  } catch (error) {
    next(error);
  }
};

const getDashboard = async (req, res, next) => {
  try {
    const studentId = req.user._id;

    // 1. Attendance records & percentage
    const attendanceRecords = await Attendance.find({ student: studentId });
    const totalAttendanceCount = attendanceRecords.length;
    const presentCount = attendanceRecords.filter((a) => a.status === "present" || a.status === "Present").length;
    const attendancePercentage = totalAttendanceCount > 0
      ? Number(((presentCount / totalAttendanceCount) * 100).toFixed(1))
      : 100;

    // 2. Pending fees
    const fees = await Fee.find({ student: studentId });
    const outstandingFees = fees.reduce((sum, f) => sum + (f.dueAmount || 0), 0);

    // 3. Unread notifications count
    const unreadNotificationsCount = await Notification.countDocuments({
      recipient: studentId,
      isRead: false,
    });

    // 4. Recent notifications
    const notifications = await Notification.find({ recipient: studentId })
      .sort({ createdAt: -1 })
      .limit(5);

    // 5. Recent results
    const results = await Result.find({ student: studentId })
      .populate("subject", "name code")
      .sort({ createdAt: -1 })
      .limit(5);

    // 6. Timetable
    const timetableQuery = {};
    if (req.user.course) timetableQuery.course = req.user.course;
    if (req.user.semester) timetableQuery.semester = req.user.semester;
    const timetable = await Timetable.find(timetableQuery)
      .populate("subject", "name code")
      .populate("faculty", "name email")
      .limit(6);

    // 7. Upcoming events
    const eventsFilter = {
      isPublished: true,
      $or: [{ department: null }],
    };
    if (req.user.department && mongoose.Types.ObjectId.isValid(req.user.department)) {
      eventsFilter.$or.push({ department: req.user.department });
    }
    const events = await Event.find(eventsFilter).sort({ startDate: 1 }).limit(4);

    // Calculate pending assignments count for student's subjects
    const enrollments = await Enrollment.find({ student: studentId, status: "active" });
    const enrolledSubjectIds = enrollments.map((e) => e.subject);
    const totalAssignments = await Assignment.find({ subject: { $in: enrolledSubjectIds }, status: "published" });
    const submittedAssignments = await AssignmentSubmission.find({
      student: studentId,
      assignment: { $in: totalAssignments.map((a) => a._id) },
    }).distinct("assignment");

    const pendingAssignmentsCount = Math.max(0, totalAssignments.length - submittedAssignments.length);

    return res.status(200).json({
      success: true,
      message: "Student dashboard metrics fetched successfully",
      data: {
        metrics: {
          attendancePercentage,
          currentSemester: req.user.semester || 1,
          pendingAssignmentsCount,
          upcomingEventsCount: events.length,
          outstandingFees,
          unreadNotificationsCount,
        },
        timetable,
        results,
        events,
        notifications,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/student/assignments
const getStudentAssignments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id, status: "active" });
    const enrolledSubjectIds = enrollments.map((e) => e.subject);

    const assignments = await Assignment.find({
      $or: [
        { subject: { $in: enrolledSubjectIds } },
        { course: req.user.course, semester: req.user.semester },
      ],
      status: "published",
    })
      .populate("subject", "name code")
      .populate("faculty", "name email")
      .sort({ deadline: 1 });

    const assignmentIds = assignments.map((a) => a._id);
    const submissions = await AssignmentSubmission.find({
      student: req.user._id,
      assignment: { $in: assignmentIds },
    });

    const submissionMap = new Map();
    submissions.forEach((sub) => {
      submissionMap.set(String(sub.assignment), sub);
    });

    const studentAssignments = assignments.map((a) => {
      const sub = submissionMap.get(String(a._id));
      return {
        ...a.toObject(),
        submissionStatus: sub ? sub.status : new Date() > new Date(a.deadline) ? "overdue" : "pending",
        submission: sub || null,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Student assignments fetched successfully",
      data: { assignments: studentAssignments },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/student/assignments/:id
const getAssignmentSubmission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id)
      .populate("subject", "name code")
      .populate("faculty", "name email");

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    const submission = await AssignmentSubmission.findOne({
      assignment: id,
      student: req.user._id,
    });

    return res.status(200).json({
      success: true,
      message: "Assignment details fetched successfully",
      data: { assignment, submission: submission || null },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/student/assignments/:id/submit
const submitAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { solutionText, githubLink, fileName, fileUrl } = req.body;

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    const now = new Date();
    const isLate = now > new Date(assignment.deadline);

    let submission = await AssignmentSubmission.findOne({
      assignment: id,
      student: req.user._id,
    });

    if (submission) {
      submission.solutionText = solutionText || submission.solutionText;
      submission.githubLink = githubLink || submission.githubLink;
      if (fileName || fileUrl) {
        submission.file = {
          name: fileName || submission.file.name,
          url: fileUrl || submission.file.url,
        };
      }
      submission.submittedAt = now;
      submission.isLate = isLate;
      submission.status = isLate ? "late" : "submitted";
      await submission.save();
    } else {
      submission = await AssignmentSubmission.create({
        assignment: id,
        student: req.user._id,
        solutionText: solutionText || "",
        githubLink: githubLink || "",
        file: {
          name: fileName || "",
          url: fileUrl || "",
        },
        submittedAt: now,
        isLate,
        status: isLate ? "late" : "submitted",
      });
    }

    // Automatic notification to faculty
    await Notification.create({
      recipient: assignment.faculty,
      title: "New Assignment Submission",
      message: `Student ${req.user.name} submitted assignment "${assignment.title}".`,
      type: "system",
      referenceId: submission._id,
    }).catch(() => {});

    return res.status(200).json({
      success: true,
      message: isLate ? "Assignment submitted late" : "Assignment submitted successfully",
      data: { submission },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  getDashboard,
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
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  getAnnouncements,
  getStudentAssignments,
  getAssignmentSubmission,
  submitAssignment,
};

