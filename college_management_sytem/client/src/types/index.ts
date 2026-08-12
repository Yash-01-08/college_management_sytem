export type UserRole = "student" | "faculty" | "coordinator" | "admin";

export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  scholarNumber?: string;
  employeeId?: string;
  department?: string;
  course?: string;
  semester?: number;
  batch?: string;
  dateOfBirth?: string;
  designation?: string;
  qualification?: string;
  profileImage?: string;
  status?: "Active" | "Inactive" | "Pending";
  isActive?: boolean;
  createdAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  user?: User;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Department {
  _id?: string;
  id?: string;
  name: string;
  code: string;
  description?: string;
  hod?: string;
  status?: "Active" | "Inactive";
  createdAt?: string;
}

export interface Course {
  _id?: string;
  id?: string;
  name: string;
  code: string;
  department?: string | Department;
  duration?: number;
  totalSemesters?: number;
  status?: "Active" | "Inactive";
  createdAt?: string;
}

export interface Subject {
  _id?: string;
  id?: string;
  name: string;
  code: string;
  course?: string | Course;
  department?: string | Department;
  semester?: number;
  credits?: number;
  type?: "Theory" | "Lab" | "Elective" | "Practical" | "Hybrid";
  status?: "Active" | "Inactive";
  createdAt?: string;
}

export interface Enrollment {
  _id?: string;
  id?: string;
  student?: string | User;
  studentName?: string;
  scholarNumber?: string;
  subject?: string | Subject;
  subjectName?: string;
  subjectCode?: string;
  course?: string;
  semester?: number;
  academicYear?: string;
  status?: "Active" | "Completed" | "Dropped";
  enrolledAt?: string;
}

export interface FacultyAssignment {
  _id?: string;
  id?: string;
  faculty?: string | User;
  facultyName?: string;
  subject?: string | Subject;
  subjectName?: string;
  subjectCode?: string;
  course?: string | Course;
  courseName?: string;
  semester?: number;
  academicYear?: string;
  createdAt?: string;
}

export interface AttendanceRecord {
  student?: string | User;
  studentName?: string;
  scholarNumber?: string;
  status?: "Present" | "Absent" | "Late";
  remarks?: string;
}

export interface Attendance {
  _id?: string;
  id?: string;
  subject?: string | Subject;
  subjectName?: string;
  subjectCode?: string;
  faculty?: string | User;
  date?: string;
  records?: AttendanceRecord[];
  totalStudents?: number;
  presentCount?: number;
  absentCount?: number;
  lateCount?: number;
  // For student aggregated view:
  totalClasses?: number;
  present?: number;
  absent?: number;
  late?: number;
  percentage?: number;
}

export interface Result {
  _id?: string;
  id?: string;
  student?: string | User;
  studentName?: string;
  scholarNumber?: string;
  subject?: string | Subject;
  subjectName?: string;
  subjectCode?: string;
  semester?: number;
  internalMarks?: number;
  externalMarks?: number;
  maxInternalMarks?: number;
  maxExternalMarks?: number;
  totalMarks?: number;
  maxTotalMarks?: number;
  grade?: string;
  gradePoint?: number;
  status?: "Pass" | "Fail" | "Pending";
  academicYear?: string;
}

export interface TimetableSlot {
  _id?: string;
  id?: string;
  course?: string | Course;
  courseName?: string;
  subject?: string | Subject;
  subjectName?: string;
  subjectCode?: string;
  faculty?: string | User;
  facultyName?: string;
  semester?: number;
  day?: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  startTime?: string;
  endTime?: string;
  room?: string;
  type?: "Theory" | "Lab" | "Tutorial" | "Practical" | "Hybrid";
  academicYear?: string;
}

export interface Fee {
  _id?: string;
  id?: string;
  student?: string | User;
  studentName?: string;
  scholarNumber?: string;
  title?: string;
  academicYear?: string;
  semester?: number;
  totalAmount?: number;
  paidAmount?: number;
  dueAmount?: number;
  dueDate?: string;
  status?: "Paid" | "Partial" | "Pending" | "Overdue";
  paymentHistory?: {
    amount: number;
    date: string;
    transactionId?: string;
    paymentMode?: string;
  }[];
}

export interface Event {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  type?: "Academic" | "Cultural" | "Sports" | "Workshop" | "Seminar" | "General";
  startDate: string;
  endDate: string;
  venue: string;
  department?: string;
  published?: boolean;
  organizer?: string;
  createdAt?: string;
}

export interface Notification {
  _id?: string;
  id?: string;
  recipient?: string;
  title: string;
  message: string;
  type?: "Attendance" | "Result" | "Fee" | "Event" | "Announcement" | "System" | "Academic" | "Alert";
  read?: boolean;
  isRead?: boolean;
  createdAt?: string;
  link?: string;
}
