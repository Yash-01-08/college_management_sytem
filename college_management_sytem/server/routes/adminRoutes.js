const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const {
  getUsers,
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
} = require("../controllers/adminController");

const router = express.Router();

router.use(authMiddleware);
router.use(authorizeRoles("admin"));

// Users
router.get("/users", getUsers);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Departments
router.get("/departments", getDepartments);
router.post("/departments", createDepartment);
router.put("/departments/:id", updateDepartment);
router.delete("/departments/:id", deleteDepartment);

// Courses
router.get("/courses", getCourses);
router.post("/courses", createCourse);
router.put("/courses/:id", updateCourse);
router.delete("/courses/:id", deleteCourse);

// Subjects
router.get("/subjects", getSubjects);
router.post("/subjects", createSubject);
router.put("/subjects/:id", updateSubject);
router.delete("/subjects/:id", deleteSubject);

// Enrollments
router.get("/enrollments", getEnrollments);
router.post("/enrollments", createEnrollment);
router.put("/enrollments/:id", updateEnrollment);
router.delete("/enrollments/:id", deleteEnrollment);

// Assignments
router.get("/assignments", getAssignments);
router.post("/assignments", createAssignment);
router.put("/assignments/:id", updateAssignment);
router.delete("/assignments/:id", deleteAssignment);

// Attendance
router.get("/attendance", getAttendance);
router.put("/attendance/:id", updateAttendance);
router.delete("/attendance/:id", deleteAttendance);

// Results
router.get("/results", getResults);
router.post("/results", createResult);
router.put("/results/:id", updateResult);
router.delete("/results/:id", deleteResult);

// Timetable
router.get("/timetable", getTimetable);
router.post("/timetable", createTimetable);
router.put("/timetable/:id", updateTimetable);
router.delete("/timetable/:id", deleteTimetable);

// Fees
router.get("/fees", getFees);
router.post("/fees", createFee);
router.put("/fees/:id", updateFee);
router.delete("/fees/:id", deleteFee);

// Events
router.get("/events", getEvents);
router.post("/events", createEvent);
router.put("/events/:id", updateEvent);
router.delete("/events/:id", deleteEvent);

// Notifications
router.get("/notifications", getNotifications);
router.post("/notifications", createNotification);
router.delete("/notifications/:id", deleteNotification);

module.exports = router;
