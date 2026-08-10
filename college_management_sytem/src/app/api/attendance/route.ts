import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");
  const sessions = db.getAttendanceSessions();
  const records = db.getAttendanceRecords(studentId || undefined);
  return NextResponse.json({ sessions, records });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "CREATE_SESSION") {
      const { subject, subjectCode, facultyId, facultyName, department } = body;
      const qrCodeToken = `QR-${subjectCode}-${Date.now()}`;
      const session = db.createAttendanceSession({
        id: `session-${Date.now()}`,
        subject,
        subjectCode,
        facultyId,
        facultyName,
        department: department || "Computer Science",
        date: new Date().toISOString().split("T")[0],
        timeSlot: "Current Lecture Session",
        qrCodeToken,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        active: true,
      });
      return NextResponse.json({ message: "Attendance Session & QR Token generated", session });
    }

    if (action === "MARK_ATTENDANCE") {
      const { qrToken, studentId, studentName, rollNumber } = body;
      const sessions = db.getAttendanceSessions();
      const session = sessions.find((s) => s.qrCodeToken === qrToken && s.active);

      if (!session) {
        return NextResponse.json({ error: "Invalid or expired QR code session" }, { status: 400 });
      }

      const record = db.markAttendance({
        id: `rec-${Date.now()}`,
        sessionId: session.id,
        studentId,
        studentName,
        rollNumber,
        subject: session.subject,
        date: new Date().toISOString().split("T")[0],
        status: "PRESENT",
        markedAt: new Date().toISOString(),
      });

      return NextResponse.json({ message: "Attendance marked successfully!", record });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
