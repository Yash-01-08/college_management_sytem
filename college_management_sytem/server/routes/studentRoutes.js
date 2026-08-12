const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const {
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
} = require("../controllers/studentController");

const router = express.Router();

router.use(authMiddleware);
router.use(authorizeRoles("student"));

router.get("/profile", getProfile);
router.get("/courses", getCourses);
router.get("/subjects", getSubjects);
router.get("/enrollment", getEnrollments);
router.post("/enrollment", createEnrollment);
router.get("/attendance", getAttendance);
router.get("/results", getResults);
router.get("/timetable", getTimetable);
router.get("/fees", getFees);
router.get("/events", getEvents);
router.get("/notifications", getNotifications);

module.exports = router;
