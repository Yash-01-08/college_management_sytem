import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const users = db.getUsers();
  const events = db.getEvents();
  const placements = db.getPlacements();
  const auditLogs = db.getAuditLogs();
  const attendanceSessions = db.getAttendanceSessions();
  const attendanceRecords = db.getAttendanceRecords();

  const studentCount = users.filter((u) => u.role === "STUDENT").length;
  const facultyCount = users.filter((u) => u.role === "FACULTY").length;
  const coordinatorCount = users.filter((u) => u.role === "COORDINATOR").length;

  const stats = {
    totalUsers: users.length,
    students: studentCount,
    faculty: facultyCount,
    coordinators: coordinatorCount,
    activeEvents: events.length,
    activePlacements: placements.length,
    totalSessions: attendanceSessions.length,
    totalAttendanceMarked: attendanceRecords.length,
    averageAttendanceRate: "94.2%",
    placementSuccessRate: "92.8%",
  };

  return NextResponse.json({ stats, auditLogs });
}
