const User = require("../models/User");
const Department = require("../models/Department");
const Course = require("../models/Course");
const Subject = require("../models/Subject");
const Enrollment = require("../models/Enrollment");
const TeachingAssignment = require("../models/TeachingAssignment");
const Timetable = require("../models/Timetable");
const Event = require("../models/Event");
const Notification = require("../models/Notification");

// GET /api/coordinator/profile
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("department", "name code");

    return res.status(200).json({
      success: true,
      message: "Coordinator profile fetched successfully",
      data: {
        user: user.toSafeObject(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ----- DEPARTMENTS -----
const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find().populate("hod", "name email phone");
    return res.status(200).json({
      success: true,
      message: "Departments fetched successfully",
      data: { departments },
    });
  } catch (error) {
    next(error);
  }
};

const createDepartment = async (req, res, next) => {
  try {
    const { name, code, description, hod } = req.body;
    if (!name || !code) {
      return res.status(400).json({ success: false, message: "name and code are required" });
    }
    const department = await Department.create({ name, code, description, hod: hod || null });
    return res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: { department },
    });
  } catch (error) {
    next(error);
  }
};

const updateDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const department = await Department.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!department) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Department updated successfully",
      data: { department },
    });
  } catch (error) {
    next(error);
  }
};

const deleteDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const department = await Department.findByIdAndDelete(id);
    if (!department) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ----- COURSES -----
const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().populate("department", "name code");
    return res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: { courses },
    });
  } catch (error) {
    next(error);
  }
};

const createCourse = async (req, res, next) => {
  try {
    const { name, code, department, duration, totalSemesters } = req.body;
    if (!name || !code || !department || !totalSemesters) {
      return res.status(400).json({ success: false, message: "name, code, department, and totalSemesters are required" });
    }
    const course = await Course.create({ name, code, department, duration: duration || 4, totalSemesters });
    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: { course },
    });
  } catch (error) {
    next(error);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: { course },
    });
  } catch (error) {
    next(error);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ----- SUBJECTS -----
const getSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find().populate("course", "name code").populate("department", "name code");
    return res.status(200).json({
      success: true,
      message: "Subjects fetched successfully",
      data: { subjects },
    });
  } catch (error) {
    next(error);
  }
};

const createSubject = async (req, res, next) => {
  try {
    const { name, code, course, department, semester, credits, type } = req.body;
    if (!name || !code || !course || !department || !semester) {
      return res.status(400).json({ success: false, message: "name, code, course, department, and semester are required" });
    }
    const subject = await Subject.create({ name, code, course, department, semester, credits: credits || 3, type: type || "theory" });
    return res.status(201).json({
      success: true,
      message: "Subject created successfully",
      data: { subject },
    });
  } catch (error) {
    next(error);
  }
};

const updateSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!subject) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Subject updated successfully",
      data: { subject },
    });
  } catch (error) {
    next(error);
  }
};

const deleteSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findByIdAndDelete(id);
    if (!subject) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Subject deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ----- ENROLLMENTS -----
const getEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("student", "name email scholarNumber")
      .populate("subject", "name code");
    return res.status(200).json({
      success: true,
      message: "Enrollments fetched successfully",
      data: { enrollments },
    });
  } catch (error) {
    next(error);
  }
};

const createEnrollment = async (req, res, next) => {
  try {
    const { studentId, subjectId, semester, academicYear, status } = req.body;
    if (!studentId || !subjectId || !academicYear) {
      return res.status(400).json({ success: false, message: "studentId, subjectId, and academicYear are required" });
    }

    const studentUser = await User.findById(studentId);
    if (!studentUser || studentUser.role !== "student") {
      return res.status(400).json({ success: false, message: "Only users with role student can be enrolled" });
    }

    const enrollment = await Enrollment.create({
      student: studentId,
      subject: subjectId,
      semester: semester || studentUser.semester || 1,
      academicYear,
      status: status || "active",
    });

    return res.status(201).json({
      success: true,
      message: "Enrollment created successfully",
      data: { enrollment },
    });
  } catch (error) {
    next(error);
  }
};

const updateEnrollment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const enrollment = await Enrollment.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!enrollment) {
      return res.status(404).json({ success: false, message: "Enrollment not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Enrollment updated successfully",
      data: { enrollment },
    });
  } catch (error) {
    next(error);
  }
};

// ----- TEACHING ASSIGNMENTS -----
const getAssignments = async (req, res, next) => {
  try {
    const assignments = await TeachingAssignment.find()
      .populate("faculty", "name email phone")
      .populate("subject", "name code")
      .populate("course", "name code");
    return res.status(200).json({
      success: true,
      message: "Teaching assignments fetched successfully",
      data: { assignments },
    });
  } catch (error) {
    next(error);
  }
};

const createAssignment = async (req, res, next) => {
  try {
    const { facultyId, subjectId, courseId, semester, academicYear } = req.body;
    if (!facultyId || !subjectId || !courseId || !semester || !academicYear) {
      return res.status(400).json({ success: false, message: "facultyId, subjectId, courseId, semester, and academicYear are required" });
    }

    const facultyUser = await User.findById(facultyId);
    if (!facultyUser || facultyUser.role !== "faculty") {
      return res.status(400).json({ success: false, message: "Only users with role faculty can be assigned to subjects" });
    }

    const assignment = await TeachingAssignment.create({
      faculty: facultyId,
      subject: subjectId,
      course: courseId,
      semester,
      academicYear,
    });

    return res.status(201).json({
      success: true,
      message: "Teaching assignment created successfully",
      data: { assignment },
    });
  } catch (error) {
    next(error);
  }
};

const updateAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const assignment = await TeachingAssignment.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!assignment) {
      return res.status(404).json({ success: false, message: "Teaching assignment not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Teaching assignment updated successfully",
      data: { assignment },
    });
  } catch (error) {
    next(error);
  }
};

const deleteAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const assignment = await TeachingAssignment.findByIdAndDelete(id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: "Teaching assignment not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Teaching assignment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ----- USERS LIST (STUDENTS & FACULTY) -----
const getStudents = async (req, res, next) => {
  try {
    const students = await User.find({ role: "student" }).select("-password");
    return res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      data: { students },
    });
  } catch (error) {
    next(error);
  }
};

const getFaculty = async (req, res, next) => {
  try {
    const faculty = await User.find({ role: "faculty" }).select("-password");
    return res.status(200).json({
      success: true,
      message: "Faculty fetched successfully",
      data: { faculty },
    });
  } catch (error) {
    next(error);
  }
};

// ----- TIMETABLE -----
const getTimetable = async (req, res, next) => {
  try {
    const timetable = await Timetable.find()
      .populate("course", "name code")
      .populate("subject", "name code")
      .populate("faculty", "name email");
    return res.status(200).json({
      success: true,
      message: "Timetable entries fetched successfully",
      data: { timetable },
    });
  } catch (error) {
    next(error);
  }
};

const createTimetable = async (req, res, next) => {
  try {
    const { courseId, subjectId, facultyId, semester, day, startTime, endTime, room, type } = req.body;
    if (!courseId || !subjectId || !facultyId || !semester || !day || !startTime || !endTime || !room) {
      return res.status(400).json({ success: false, message: "courseId, subjectId, facultyId, semester, day, startTime, endTime, and room are required" });
    }

    // Validate that the faculty is assigned to this subject
    const isAssigned = await TeachingAssignment.findOne({ faculty: facultyId, subject: subjectId });
    if (!isAssigned) {
      return res.status(400).json({ success: false, message: "Faculty member does not belong to the teaching assignment for this subject" });
    }

    const entry = await Timetable.create({
      course: courseId,
      subject: subjectId,
      faculty: facultyId,
      semester,
      day,
      startTime,
      endTime,
      room,
      type: type || "lecture",
    });

    return res.status(201).json({
      success: true,
      message: "Timetable entry created successfully",
      data: { timetable: entry },
    });
  } catch (error) {
    next(error);
  }
};

const updateTimetable = async (req, res, next) => {
  try {
    const { id } = req.params;
    const entry = await Timetable.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!entry) {
      return res.status(404).json({ success: false, message: "Timetable entry not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Timetable entry updated successfully",
      data: { timetable: entry },
    });
  } catch (error) {
    next(error);
  }
};

const deleteTimetable = async (req, res, next) => {
  try {
    const { id } = req.params;
    const entry = await Timetable.findByIdAndDelete(id);
    if (!entry) {
      return res.status(404).json({ success: false, message: "Timetable entry not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Timetable entry deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ----- EVENTS -----
const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find().populate("department", "name code").populate("createdBy", "name role");
    return res.status(200).json({
      success: true,
      message: "Events fetched successfully",
      data: { events },
    });
  } catch (error) {
    next(error);
  }
};

const createEvent = async (req, res, next) => {
  try {
    const { title, description, type, startDate, endDate, venue, department, isPublished } = req.body;
    if (!title || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: "title, startDate, and endDate are required" });
    }
    const event = await Event.create({
      title,
      description,
      type: type || "academic",
      startDate,
      endDate,
      venue,
      department: department || null,
      createdBy: req.user._id,
      isPublished: isPublished !== undefined ? isPublished : true,
    });
    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: { event },
    });
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: { event },
    });
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ----- NOTIFICATIONS -----
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      data: { notifications },
    });
  } catch (error) {
    next(error);
  }
};

const createNotification = async (req, res, next) => {
  try {
    const { recipientId, title, message, type, referenceId } = req.body;
    if (!recipientId || !title || !message || !type) {
      return res.status(400).json({ success: false, message: "recipientId, title, message, and type are required" });
    }
    const notification = await Notification.create({
      recipient: recipientId,
      title,
      message,
      type,
      referenceId: referenceId || null,
    });
    return res.status(201).json({
      success: true,
      message: "Notification created successfully",
      data: { notification },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  getEnrollments,
  createEnrollment,
  updateEnrollment,
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getStudents,
  getFaculty,
  getTimetable,
  createTimetable,
  updateTimetable,
  deleteTimetable,
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getNotifications,
  createNotification,
};
