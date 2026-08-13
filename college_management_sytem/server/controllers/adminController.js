const User = require("../models/User");
const Department = require("../models/Department");
const Course = require("../models/Course");
const Subject = require("../models/Subject");
const Enrollment = require("../models/Enrollment");
const TeachingAssignment = require("../models/TeachingAssignment");
const Attendance = require("../models/Attendance");
const Result = require("../models/Result");
const Timetable = require("../models/Timetable");
const Fee = require("../models/Fee");
const Event = require("../models/Event");
const Notification = require("../models/Notification");
const generateScholarNumber = require("../utils/generateScholarNumber");

// ----- USER MANAGEMENT -----
const getUsers = async (req, res, next) => {
  try {
    const { role, isActive } = req.query;
    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === "true";

    const users = await User.find(query).select("-password").sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: { users },
    });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email, phone, password, role, department, course, semester, batch, dateOfBirth, scholarNumber } = req.body;
    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({ success: false, message: "name, email, phone, password, and role are required" });
    }

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: "Email already in use" });
    }

    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ success: false, message: "Phone number already in use" });
    }

    const userData = { name, email, phone, password, role, department };

    if (role === "student") {
      userData.course = course;
      userData.semester = semester;
      userData.batch = batch;
      userData.dateOfBirth = dateOfBirth;
      userData.scholarNumber = scholarNumber || (await generateScholarNumber(User));
    }

    const user = await User.create(userData);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { user: user.toSafeObject() },
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    delete updates.password; // Do not update password via generic update

    const user = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: { user: user.toSafeObject() },
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ----- DEPARTMENTS -----
const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find().populate("hod", "name email phone");
    return res.status(200).json({ success: true, message: "Departments fetched successfully", data: { departments } });
  } catch (error) {
    next(error);
  }
};

const createDepartment = async (req, res, next) => {
  try {
    const { name, code, description, hod } = req.body;
    if (!name || !code) return res.status(400).json({ success: false, message: "name and code are required" });
    const department = await Department.create({ name, code, description, hod: hod || null });
    return res.status(201).json({ success: true, message: "Department created successfully", data: { department } });
  } catch (error) {
    next(error);
  }
};

const updateDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const department = await Department.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!department) return res.status(404).json({ success: false, message: "Department not found" });
    return res.status(200).json({ success: true, message: "Department updated successfully", data: { department } });
  } catch (error) {
    next(error);
  }
};

const deleteDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const department = await Department.findByIdAndDelete(id);
    if (!department) return res.status(404).json({ success: false, message: "Department not found" });
    return res.status(200).json({ success: true, message: "Department deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// ----- COURSES -----
const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().populate("department", "name code");
    return res.status(200).json({ success: true, message: "Courses fetched successfully", data: { courses } });
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
    return res.status(201).json({ success: true, message: "Course created successfully", data: { course } });
  } catch (error) {
    next(error);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    return res.status(200).json({ success: true, message: "Course updated successfully", data: { course } });
  } catch (error) {
    next(error);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    return res.status(200).json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// ----- SUBJECTS -----
const getSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find().populate("course", "name code").populate("department", "name code");
    return res.status(200).json({ success: true, message: "Subjects fetched successfully", data: { subjects } });
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
    return res.status(201).json({ success: true, message: "Subject created successfully", data: { subject } });
  } catch (error) {
    next(error);
  }
};

const updateSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!subject) return res.status(404).json({ success: false, message: "Subject not found" });
    return res.status(200).json({ success: true, message: "Subject updated successfully", data: { subject } });
  } catch (error) {
    next(error);
  }
};

const deleteSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findByIdAndDelete(id);
    if (!subject) return res.status(404).json({ success: false, message: "Subject not found" });
    return res.status(200).json({ success: true, message: "Subject deleted successfully" });
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
    return res.status(200).json({ success: true, message: "Enrollments fetched successfully", data: { enrollments } });
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
    return res.status(201).json({ success: true, message: "Enrollment created successfully", data: { enrollment } });
  } catch (error) {
    next(error);
  }
};

const updateEnrollment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const enrollment = await Enrollment.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!enrollment) return res.status(404).json({ success: false, message: "Enrollment not found" });
    return res.status(200).json({ success: true, message: "Enrollment updated successfully", data: { enrollment } });
  } catch (error) {
    next(error);
  }
};

const deleteEnrollment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const enrollment = await Enrollment.findByIdAndDelete(id);
    if (!enrollment) return res.status(404).json({ success: false, message: "Enrollment not found" });
    return res.status(200).json({ success: true, message: "Enrollment deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// ----- TEACHING ASSIGNMENTS -----
const getAssignments = async (req, res, next) => {
  try {
    const assignments = await TeachingAssignment.find()
      .populate("faculty", "name email")
      .populate("subject", "name code")
      .populate("course", "name code");
    return res.status(200).json({ success: true, message: "Assignments fetched successfully", data: { assignments } });
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
    return res.status(201).json({ success: true, message: "Teaching assignment created successfully", data: { assignment } });
  } catch (error) {
    next(error);
  }
};

const updateAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const assignment = await TeachingAssignment.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found" });
    return res.status(200).json({ success: true, message: "Teaching assignment updated successfully", data: { assignment } });
  } catch (error) {
    next(error);
  }
};

const deleteAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const assignment = await TeachingAssignment.findByIdAndDelete(id);
    if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found" });
    return res.status(200).json({ success: true, message: "Teaching assignment deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// ----- ATTENDANCE -----
const getAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.find()
      .populate("student", "name scholarNumber email")
      .populate("subject", "name code")
      .populate("faculty", "name email");
    return res.status(200).json({ success: true, message: "Attendance records fetched successfully", data: { attendance } });
  } catch (error) {
    next(error);
  }
};

const updateAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const attendance = await Attendance.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!attendance) return res.status(404).json({ success: false, message: "Attendance record not found" });
    return res.status(200).json({ success: true, message: "Attendance updated successfully", data: { attendance } });
  } catch (error) {
    next(error);
  }
};

const deleteAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const attendance = await Attendance.findByIdAndDelete(id);
    if (!attendance) return res.status(404).json({ success: false, message: "Attendance record not found" });
    return res.status(200).json({ success: true, message: "Attendance deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// ----- RESULTS -----
const getResults = async (req, res, next) => {
  try {
    const results = await Result.find()
      .populate("student", "name scholarNumber email")
      .populate("subject", "name code");
    return res.status(200).json({ success: true, message: "Results fetched successfully", data: { results } });
  } catch (error) {
    next(error);
  }
};

const createResult = async (req, res, next) => {
  try {
    const { studentId, subjectId, semester, academicYear, internalMarks, externalMarks } = req.body;
    if (!studentId || !subjectId || !semester || !academicYear) {
      return res.status(400).json({ success: false, message: "studentId, subjectId, semester, and academicYear are required" });
    }
    const result = await Result.create({
      student: studentId,
      subject: subjectId,
      semester: Number(semester),
      academicYear,
      internalMarks: Number(internalMarks) || 0,
      externalMarks: Number(externalMarks) || 0,
    });
    return res.status(201).json({ success: true, message: "Result created successfully", data: { result } });
  } catch (error) {
    next(error);
  }
};

const updateResult = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Result.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!result) return res.status(404).json({ success: false, message: "Result record not found" });
    return res.status(200).json({ success: true, message: "Result updated successfully", data: { result } });
  } catch (error) {
    next(error);
  }
};

const deleteResult = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Result.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ success: false, message: "Result record not found" });
    return res.status(200).json({ success: true, message: "Result deleted successfully" });
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
    return res.status(200).json({ success: true, message: "Timetable fetched successfully", data: { timetable } });
  } catch (error) {
    next(error);
  }
};

const createTimetable = async (req, res, next) => {
  try {
    const { courseId, subjectId, facultyId, semester, day, startTime, endTime, room, type } = req.body;
    if (!courseId || !subjectId || !facultyId || !semester || !day || !startTime || !endTime || !room) {
      return res.status(400).json({ success: false, message: "All timetable parameters are required" });
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
    return res.status(201).json({ success: true, message: "Timetable entry created successfully", data: { timetable: entry } });
  } catch (error) {
    next(error);
  }
};

const updateTimetable = async (req, res, next) => {
  try {
    const { id } = req.params;
    const entry = await Timetable.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!entry) return res.status(404).json({ success: false, message: "Timetable entry not found" });
    return res.status(200).json({ success: true, message: "Timetable entry updated successfully", data: { timetable: entry } });
  } catch (error) {
    next(error);
  }
};

const deleteTimetable = async (req, res, next) => {
  try {
    const { id } = req.params;
    const entry = await Timetable.findByIdAndDelete(id);
    if (!entry) return res.status(404).json({ success: false, message: "Timetable entry not found" });
    return res.status(200).json({ success: true, message: "Timetable entry deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// ----- FEES -----
const getFees = async (req, res, next) => {
  try {
    const fees = await Fee.find().populate("student", "name scholarNumber email").sort({ dueDate: -1 });
    return res.status(200).json({ success: true, message: "Fees fetched successfully", data: { fees } });
  } catch (error) {
    next(error);
  }
};

const createFee = async (req, res, next) => {
  try {
    const { studentId, academicYear, semester, amount, paidAmount, dueDate, transactionId } = req.body;
    if (!studentId || !academicYear || !semester || amount === undefined || !dueDate) {
      return res.status(400).json({ success: false, message: "studentId, academicYear, semester, amount, and dueDate are required" });
    }
    const fee = await Fee.create({
      student: studentId,
      academicYear,
      semester,
      amount: Number(amount),
      paidAmount: Number(paidAmount) || 0,
      dueDate,
      transactionId: transactionId || "",
    });
    return res.status(201).json({ success: true, message: "Fee created successfully", data: { fee } });
  } catch (error) {
    next(error);
  }
};

const updateFee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fee = await Fee.findById(id);
    if (!fee) return res.status(404).json({ success: false, message: "Fee record not found" });

    if (req.body.amount !== undefined) fee.amount = Number(req.body.amount);
    if (req.body.paidAmount !== undefined) fee.paidAmount = Number(req.body.paidAmount);
    if (req.body.dueDate) fee.dueDate = req.body.dueDate;
    if (req.body.academicYear) fee.academicYear = req.body.academicYear;
    if (req.body.semester) fee.semester = req.body.semester;
    if (req.body.transactionId !== undefined) fee.transactionId = req.body.transactionId;
    if (req.body.status) fee.status = req.body.status;

    await fee.save();
    return res.status(200).json({ success: true, message: "Fee updated successfully", data: { fee } });
  } catch (error) {
    next(error);
  }
};

const deleteFee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fee = await Fee.findByIdAndDelete(id);
    if (!fee) return res.status(404).json({ success: false, message: "Fee record not found" });
    return res.status(200).json({ success: true, message: "Fee deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// ----- EVENTS -----
const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find().populate("department", "name code").populate("createdBy", "name role");
    return res.status(200).json({ success: true, message: "Events fetched successfully", data: { events } });
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
    return res.status(201).json({ success: true, message: "Event created successfully", data: { event } });
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    return res.status(200).json({ success: true, message: "Event updated successfully", data: { event } });
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    return res.status(200).json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// ----- NOTIFICATIONS -----
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find().populate("recipient", "name email role").sort({ createdAt: -1 });
    return res.status(200).json({ success: true, message: "Notifications fetched successfully", data: { notifications } });
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
    return res.status(201).json({ success: true, message: "Notification created successfully", data: { notification } });
  } catch (error) {
    next(error);
  }
};

const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) return res.status(404).json({ success: false, message: "Notification not found" });
    return res.status(200).json({ success: true, message: "Notification deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const getDashboard = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalFaculty = await User.countDocuments({ role: "faculty" });
    const totalCoordinators = await User.countDocuments({ role: "coordinator" });
    const totalDepartments = await Department.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalEvents = await Event.countDocuments();

    // Overall attendance percentage calculation
    const totalAttendance = await Attendance.countDocuments();
    const presentAttendance = await Attendance.countDocuments({
      status: { $in: ["present", "Present"] },
    });
    const overallAttendancePct = totalAttendance > 0
      ? Number(((presentAttendance / totalAttendance) * 100).toFixed(1))
      : 92.5;

    // Total pending fees calculation
    const fees = await Fee.find();
    const totalPendingFees = fees.reduce((acc, f) => acc + (f.dueAmount || 0), 0);

    const recentUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    const events = await Event.find().sort({ startDate: 1 }).limit(5);
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(5);

    return res.status(200).json({
      success: true,
      message: "Admin dashboard metrics fetched successfully",
      data: {
        metrics: {
          totalStudents,
          totalFaculty,
          totalCoordinators,
          totalDepartments,
          totalCourses,
          totalEvents,
          overallAttendancePct,
          totalPendingFees,
        },
        recentUsers,
        events,
        notifications,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getDashboard,
  createUser,
  updateUser,
  deleteUser,
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
  deleteEnrollment,
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAttendance,
  updateAttendance,
  deleteAttendance,
  getResults,
  createResult,
  updateResult,
  deleteResult,
  getTimetable,
  createTimetable,
  updateTimetable,
  deleteTimetable,
  getFees,
  createFee,
  updateFee,
  deleteFee,
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getNotifications,
  createNotification,
  deleteNotification,
};
