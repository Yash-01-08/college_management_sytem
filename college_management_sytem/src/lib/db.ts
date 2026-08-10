import {
  initialUsers,
  initialAttendanceSessions,
  initialAttendanceRecords,
  initialAssignments,
  initialSubmissions,
  initialEvents,
  initialEventRegistrations,
  initialPlacements,
  initialPlacementApplications,
  initialNotifications,
  initialAuditLogs,
} from "./mockData";

import {
  User,
  AttendanceSession,
  AttendanceRecord,
  Assignment,
  AssignmentSubmission,
  EventItem,
  EventRegistration,
  PlacementNotice,
  PlacementApplication,
  NotificationItem,
  AuditLog,
} from "./types";

class CampusDatabase {
  private users: User[] = [...initialUsers];
  private sessions: AttendanceSession[] = [...initialAttendanceSessions];
  private records: AttendanceRecord[] = [...initialAttendanceRecords];
  private assignments: Assignment[] = [...initialAssignments];
  private submissions: AssignmentSubmission[] = [...initialSubmissions];
  private events: EventItem[] = [...initialEvents];
  private eventRegistrations: EventRegistration[] = [...initialEventRegistrations];
  private placements: PlacementNotice[] = [...initialPlacements];
  private placementApps: PlacementApplication[] = [...initialPlacementApplications];
  private notifications: NotificationItem[] = [...initialNotifications];
  private auditLogs: AuditLog[] = [...initialAuditLogs];

  // USERS
  getUsers() {
    return this.users;
  }
  getUserById(id: string) {
    return this.users.find((u) => u.id === id);
  }
  getUserByEmail(email: string) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }
  addUser(user: User) {
    this.users.unshift(user);
    this.addAuditLog("user-system", "System", "USER_CREATED", `New user created: ${user.email} (${user.role})`);
    return user;
  }
  updateUser(id: string, updates: Partial<User>) {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx !== -1) {
      this.users[idx] = { ...this.users[idx], ...updates };
      return this.users[idx];
    }
    return null;
  }

  // ATTENDANCE
  getAttendanceSessions() {
    return this.sessions;
  }
  createAttendanceSession(session: AttendanceSession) {
    this.sessions.unshift(session);
    this.addAuditLog(session.facultyId, session.facultyName, "ATTENDANCE_SESSION_CREATED", `Created session ${session.subjectCode} (${session.qrCodeToken})`);
    return session;
  }
  getAttendanceRecords(studentId?: string) {
    if (studentId) {
      return this.records.filter((r) => r.studentId === studentId);
    }
    return this.records;
  }
  markAttendance(record: AttendanceRecord) {
    const existing = this.records.find(
      (r) => r.sessionId === record.sessionId && r.studentId === record.studentId
    );
    if (existing) return existing;
    this.records.unshift(record);
    return record;
  }

  // ASSIGNMENTS
  getAssignments() {
    return this.assignments;
  }
  createAssignment(assignment: Assignment) {
    this.assignments.unshift(assignment);
    this.addAuditLog(assignment.facultyId, assignment.facultyName, "ASSIGNMENT_CREATED", `Created assignment ${assignment.title}`);
    return assignment;
  }
  getSubmissions(assignmentId?: string, studentId?: string) {
    let res = this.submissions;
    if (assignmentId) res = res.filter((s) => s.assignmentId === assignmentId);
    if (studentId) res = res.filter((s) => s.studentId === studentId);
    return res;
  }
  submitAssignment(submission: AssignmentSubmission) {
    const existingIdx = this.submissions.findIndex(
      (s) => s.assignmentId === submission.assignmentId && s.studentId === submission.studentId
    );
    if (existingIdx !== -1) {
      this.submissions[existingIdx] = submission;
    } else {
      this.submissions.unshift(submission);
    }
    return submission;
  }
  gradeSubmission(submissionId: string, marks: number, feedback: string) {
    const sub = this.submissions.find((s) => s.id === submissionId);
    if (sub) {
      sub.status = "GRADED";
      sub.marksObtained = marks;
      sub.feedback = feedback;
    }
    return sub;
  }

  // EVENTS
  getEvents() {
    return this.events;
  }
  createEvent(evt: EventItem) {
    this.events.unshift(evt);
    this.addAuditLog("coord-system", evt.organizer, "EVENT_CREATED", `Created event ${evt.title}`);
    return evt;
  }
  getEventRegistrations(studentId?: string) {
    if (studentId) {
      return this.eventRegistrations.filter((r) => r.studentId === studentId);
    }
    return this.eventRegistrations;
  }
  registerEvent(reg: EventRegistration) {
    this.eventRegistrations.unshift(reg);
    const evt = this.events.find((e) => e.id === reg.eventId);
    if (evt) evt.registeredCount += 1;
    return reg;
  }

  // PLACEMENTS
  getPlacements() {
    return this.placements;
  }
  createPlacement(placement: PlacementNotice) {
    this.placements.unshift(placement);
    return placement;
  }
  getPlacementApps(studentId?: string) {
    if (studentId) {
      return this.placementApps.filter((a) => a.studentId === studentId);
    }
    return this.placementApps;
  }
  applyPlacement(app: PlacementApplication) {
    this.placementApps.unshift(app);
    const item = this.placements.find((p) => p.id === app.placementId);
    if (item) item.appliedCount += 1;
    return app;
  }

  // NOTIFICATIONS
  getNotifications(userId: string) {
    return this.notifications.filter((n) => n.userId === userId || n.userId === "all");
  }
  markNotificationRead(id: string) {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) notif.read = true;
    return notif;
  }

  // AUDIT LOGS
  getAuditLogs() {
    return this.auditLogs;
  }
  addAuditLog(actorId: string, actorName: string, action: string, details: string) {
    const log: AuditLog = {
      id: `log-${Date.now()}`,
      actorId,
      actorName,
      action,
      details,
      timestamp: new Date().toISOString(),
      ipAddress: "127.0.0.1",
    };
    this.auditLogs.unshift(log);
    return log;
  }
}

export const db = new CampusDatabase();
