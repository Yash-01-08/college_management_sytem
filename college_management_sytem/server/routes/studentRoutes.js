const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const {
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
} = require("../controllers/studentController");

const router = express.Router();

router.use(authMiddleware);
router.use(authorizeRoles("student"));

router.get("/profile", getProfile);
router.get("/dashboard", getDashboard);
router.get("/courses", getCourses);
router.get("/subjects", getSubjects);
router.get("/enrollment", getEnrollments);
router.post("/enrollment", createEnrollment);

router.get("/assignments", getStudentAssignments);
router.get("/assignments/:id", getAssignmentSubmission);
router.post("/assignments/:id/submit", submitAssignment);

router.get("/attendance", getAttendance);
router.get("/results", getResults);
router.get("/timetable", getTimetable);
router.get("/fees", getFees);
router.get("/events", getEvents);
router.get("/notifications", getNotifications);
router.put("/notifications/read-all", markAllNotificationsRead);
router.put("/notifications/:id/read", markNotificationRead);
router.delete("/notifications/:id", deleteNotification);

router.get("/announcements", getAnnouncements);

module.exports = router;
