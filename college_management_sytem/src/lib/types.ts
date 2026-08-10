export type UserRole = "STUDENT" | "FACULTY" | "COORDINATOR" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department: string;
  phone?: string;
  rollNumber?: string;
  semester?: number;
  skills?: string[];
  bio?: string;
  linkedIn?: string;
  gitHub?: string;
  resumeUrl?: string;
  verified: boolean;
  createdAt: string;
}

export interface AttendanceSession {
  id: string;
  subject: string;
  subjectCode: string;
  facultyId: string;
  facultyName: string;
  department: string;
  date: string;
  timeSlot: string;
  qrCodeToken: string;
  expiresAt: string;
  active: boolean;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  subject: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE";
  markedAt: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  subjectCode: string;
  facultyId: string;
  facultyName: string;
  deadline: string;
  totalMarks: number;
  rubrics: string[];
  attachments?: string[];
  createdAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  submissionDate: string;
  fileUrl?: string;
  gitHubUrl?: string;
  solutionText?: string;
  status: "SUBMITTED" | "GRADED" | "LATE";
  marksObtained?: number;
  feedback?: string;
  plagiarismScore?: number;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  category: "TECHNICAL" | "CULTURAL" | "SPORTS" | "WORKSHOP";
  banner: string;
  venue: string;
  date: string;
  time: string;
  registrationDeadline: string;
  capacity: number;
  registeredCount: number;
  organizer: string;
  speakers: string[];
  active: boolean;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  eventTitle: string;
  studentId: string;
  studentName: string;
  registeredAt: string;
  ticketQrCode: string;
  status: "CONFIRMED" | "CANCELLED";
}

export interface PlacementNotice {
  id: string;
  companyName: string;
  companyLogo?: string;
  jobRole: string;
  ctc: string;
  location: string;
  eligibility: string;
  deadline: string;
  description: string;
  requirements: string[];
  postedAt: string;
  appliedCount: number;
}

export interface PlacementApplication {
  id: string;
  placementId: string;
  companyName: string;
  jobRole: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  resumeUrl: string;
  appliedAt: string;
  status: "APPLIED" | "SHORTLISTED" | "INTERVIEW" | "OFFERED" | "REJECTED";
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "ASSIGNMENT" | "ATTENDANCE" | "EVENT" | "PLACEMENT" | "SYSTEM";
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}
