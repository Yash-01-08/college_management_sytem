const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const {
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
} = require("../controllers/coordinatorController");

const router = express.Router();

router.use(authMiddleware);
router.use(authorizeRoles("coordinator", "admin"));

router.get("/profile", getProfile);

router.get("/departments", getDepartments);
router.post("/departments", createDepartment);
router.put("/departments/:id", updateDepartment);
router.delete("/departments/:id", deleteDepartment);

router.get("/courses", getCourses);
router.post("/courses", createCourse);
router.put("/courses/:id", updateCourse);
router.delete("/courses/:id", deleteCourse);

router.get("/subjects", getSubjects);
router.post("/subjects", createSubject);
router.put("/subjects/:id", updateSubject);
router.delete("/subjects/:id", deleteSubject);

router.get("/enrollments", getEnrollments);
router.post("/enrollments", createEnrollment);
router.put("/enrollments/:id", updateEnrollment);

router.get("/assignments", getAssignments);
router.post("/assignments", createAssignment);
router.put("/assignments/:id", updateAssignment);
router.delete("/assignments/:id", deleteAssignment);

router.get("/students", getStudents);
router.get("/faculty", getFaculty);

router.get("/timetable", getTimetable);
router.post("/timetable", createTimetable);
router.put("/timetable/:id", updateTimetable);
router.delete("/timetable/:id", deleteTimetable);

router.get("/events", getEvents);
router.post("/events", createEvent);
router.put("/events/:id", updateEvent);
router.delete("/events/:id", deleteEvent);

router.get("/notifications", getNotifications);
router.post("/notifications", createNotification);

module.exports = router;
