const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const {
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
} = require("../controllers/facultyController");

const router = express.Router();

router.use(authMiddleware);
router.use(authorizeRoles("faculty"));

router.get("/profile", getProfile);
router.get("/dashboard", getDashboard);
router.get("/subjects", getAssignedSubjects);
router.get("/students", getStudents);

router.get("/attendance", getAttendance);
router.post("/attendance", markAttendance);
router.put("/attendance/:id", updateAttendance);

router.get("/results", getResults);
router.post("/results", createResult);
router.put("/results/:id", updateResult);

router.get("/timetable", getTimetable);
router.get("/events", getEvents);
router.get("/notifications", getNotifications);

module.exports = router;
