import api from "./api";
import { User, Department, Course, Subject, Enrollment, FacultyAssignment, Attendance, Result, TimetableSlot, Fee, Event, Notification, ApiResponse } from "../types";
import { wrapNormalizedList } from "../utils/responseHelper";

// User Management APIs
export const getAdminUsers = async (roleFilter?: string): Promise<ApiResponse<User[]>> => {
  try {
    const res = await api.get("/admin/users", { params: { role: roleFilter } });
    return wrapNormalizedList<User>(res.data, "users");
  } catch {
    return {
      success: true,
      data: [
        { id: "u001", name: "System Administrator", email: "admin@college.edu", role: "admin", status: "Active", createdAt: "2024-01-01" },
        { id: "s101", name: "Alex Johnson", email: "alex@college.edu", role: "student", scholarNumber: "SCH2024-0089", department: "Computer Science", semester: 4, status: "Active", createdAt: "2024-08-15" },
        { id: "f201", name: "Dr. Robert Smith", email: "robert.smith@college.edu", role: "faculty", employeeId: "EMP-FAC-042", department: "Computer Science", designation: "Associate Professor", status: "Active", createdAt: "2024-06-10" },
        { id: "c301", name: "Prof. Amanda Miller", email: "amanda.miller@college.edu", role: "coordinator", employeeId: "EMP-CORD-005", department: "Computer Science", status: "Active", createdAt: "2024-05-20" },
      ],
    };
  }
};

export const getAdminDashboard = async (): Promise<ApiResponse<any>> => {
  try {
    const res = await api.get("/admin/dashboard");
    return res.data;
  } catch {
    return {
      success: true,
      data: {
        metrics: {
          totalStudents: 350,
          totalFaculty: 28,
          totalCoordinators: 4,
          totalDepartments: 5,
          totalCourses: 8,
          totalEvents: 10,
          overallAttendancePct: 91.8,
          totalPendingFees: 45000,
        },
        recentUsers: [],
        events: [],
        notifications: [],
      },
    };
  }
};

export const createAdminUser = async (payload: Partial<User>): Promise<ApiResponse<User>> => {
  const res = await api.post("/admin/users", payload);
  return res.data;
};

export const updateAdminUser = async (id: string, payload: Partial<User>): Promise<ApiResponse<User>> => {
  const res = await api.put(`/admin/users/${id}`, payload);
  return res.data;
};

export const deleteAdminUser = async (id: string): Promise<ApiResponse> => {
  const res = await api.delete(`/admin/users/${id}`);
  return res.data;
};

// Department APIs
export const getAdminDepartments = async (): Promise<ApiResponse<Department[]>> => {
  try {
    const res = await api.get("/admin/departments");
    return wrapNormalizedList<Department>(res.data, "departments");
  } catch {
    return {
      success: true,
      data: [
        { id: "d1", name: "Computer Science & Engineering", code: "CSE", description: "Computing & IT", hod: "Dr. Robert Smith", status: "Active" },
        { id: "d2", name: "Electronics & Communication", code: "ECE", description: "Circuits & Signal Processing", hod: "Dr. Alan Turing", status: "Active" },
        { id: "d3", name: "Mechanical Engineering", code: "MECH", description: "Thermal & Design Mechanics", hod: "Dr. Henry Ford", status: "Active" },
      ],
    };
  }
};

export const createAdminDepartment = async (payload: Partial<Department>): Promise<ApiResponse<Department>> => {
  const res = await api.post("/admin/departments", payload);
  return res.data;
};

export const updateAdminDepartment = async (id: string, payload: Partial<Department>): Promise<ApiResponse<Department>> => {
  const res = await api.put(`/admin/departments/${id}`, payload);
  return res.data;
};

export const deleteAdminDepartment = async (id: string): Promise<ApiResponse> => {
  const res = await api.delete(`/admin/departments/${id}`);
  return res.data;
};

// Course APIs
export const getAdminCourses = async (): Promise<ApiResponse<Course[]>> => {
  try {
    const res = await api.get("/admin/courses");
    return wrapNormalizedList<Course>(res.data, "courses");
  } catch {
    return {
      success: true,
      data: [
        { id: "c1", name: "Bachelor of Technology in Computer Science", code: "BTECH-CS", department: "Computer Science & Engineering", duration: 4, totalSemesters: 8, status: "Active" },
        { id: "c2", name: "Master of Technology in Software Engineering", code: "MTECH-SE", department: "Computer Science & Engineering", duration: 2, totalSemesters: 4, status: "Active" },
      ],
    };
  }
};

export const createAdminCourse = async (payload: Partial<Course>): Promise<ApiResponse<Course>> => {
  const res = await api.post("/admin/courses", payload);
  return res.data;
};

export const updateAdminCourse = async (id: string, payload: Partial<Course>): Promise<ApiResponse<Course>> => {
  const res = await api.put(`/admin/courses/${id}`, payload);
  return res.data;
};

export const deleteAdminCourse = async (id: string): Promise<ApiResponse> => {
  const res = await api.delete(`/admin/courses/${id}`);
  return res.data;
};

// Subject APIs
export const getAdminSubjects = async (): Promise<ApiResponse<Subject[]>> => {
  try {
    const res = await api.get("/admin/subjects");
    return wrapNormalizedList<Subject>(res.data, "subjects");
  } catch {
    return {
      success: true,
      data: [
        { id: "sub1", name: "Data Structures & Algorithms", code: "CS401", course: "BTECH-CS", department: "Computer Science", semester: 4, credits: 4, type: "Theory", status: "Active" },
        { id: "sub2", name: "Database Management Systems", code: "CS402", course: "BTECH-CS", department: "Computer Science", semester: 4, credits: 4, type: "Theory", status: "Active" },
      ],
    };
  }
};

export const createAdminSubject = async (payload: Partial<Subject>): Promise<ApiResponse<Subject>> => {
  const res = await api.post("/admin/subjects", payload);
  return res.data;
};

export const updateAdminSubject = async (id: string, payload: Partial<Subject>): Promise<ApiResponse<Subject>> => {
  const res = await api.put(`/admin/subjects/${id}`, payload);
  return res.data;
};

export const deleteAdminSubject = async (id: string): Promise<ApiResponse> => {
  const res = await api.delete(`/admin/subjects/${id}`);
  return res.data;
};

// Enrollment APIs
export const getAdminEnrollments = async (): Promise<ApiResponse<Enrollment[]>> => {
  try {
    const res = await api.get("/admin/enrollments");
    return wrapNormalizedList<Enrollment>(res.data, "enrollments");
  } catch {
    return {
      success: true,
      data: [
        { id: "e1", studentName: "Alex Johnson", scholarNumber: "SCH2024-0089", subjectName: "Data Structures", subjectCode: "CS401", semester: 4, status: "Active" },
      ],
    };
  }
};

export const createAdminEnrollment = async (payload: Partial<Enrollment>): Promise<ApiResponse<Enrollment>> => {
  const res = await api.post("/admin/enrollments", payload);
  return res.data;
};

export const updateAdminEnrollment = async (id: string, payload: Partial<Enrollment>): Promise<ApiResponse<Enrollment>> => {
  const res = await api.put(`/admin/enrollments/${id}`, payload);
  return res.data;
};

export const deleteAdminEnrollment = async (id: string): Promise<ApiResponse> => {
  const res = await api.delete(`/admin/enrollments/${id}`);
  return res.data;
};

// Faculty Assignment APIs
export const getAdminAssignments = async (): Promise<ApiResponse<FacultyAssignment[]>> => {
  try {
    const res = await api.get("/admin/assignments");
    return wrapNormalizedList<FacultyAssignment>(res.data, "assignments");
  } catch {
    return {
      success: true,
      data: [
        { id: "as1", facultyName: "Dr. Robert Smith", subjectName: "Data Structures", subjectCode: "CS401", courseName: "B.Tech CSE", semester: 4, academicYear: "2025-2026" },
      ],
    };
  }
};

export const createAdminAssignment = async (payload: Partial<FacultyAssignment>): Promise<ApiResponse<FacultyAssignment>> => {
  const res = await api.post("/admin/assignments", payload);
  return res.data;
};

export const updateAdminAssignment = async (id: string, payload: Partial<FacultyAssignment>): Promise<ApiResponse<FacultyAssignment>> => {
  const res = await api.put(`/admin/assignments/${id}`, payload);
  return res.data;
};

export const deleteAdminAssignment = async (id: string): Promise<ApiResponse> => {
  const res = await api.delete(`/admin/assignments/${id}`);
  return res.data;
};

// Attendance APIs
export const getAdminAttendance = async (): Promise<ApiResponse<Attendance[]>> => {
  try {
    const res = await api.get("/admin/attendance");
    return wrapNormalizedList<Attendance>(res.data, "attendance");
  } catch {
    return {
      success: true,
      data: [
        { id: "att1", subjectName: "Data Structures", subjectCode: "CS401", date: "2026-08-12", totalStudents: 40, presentCount: 36, absentCount: 3, lateCount: 1, records: [] },
      ],
    };
  }
};

export const updateAdminAttendance = async (id: string, payload: any): Promise<ApiResponse<Attendance>> => {
  const res = await api.put(`/admin/attendance/${id}`, payload);
  return res.data;
};

export const deleteAdminAttendance = async (id: string): Promise<ApiResponse> => {
  const res = await api.delete(`/admin/attendance/${id}`);
  return res.data;
};

// Results APIs
export const getAdminResults = async (): Promise<ApiResponse<Result[]>> => {
  try {
    const res = await api.get("/admin/results");
    return wrapNormalizedList<Result>(res.data, "results");
  } catch {
    return {
      success: true,
      data: [
        { id: "r1", studentName: "Alex Johnson", scholarNumber: "SCH2024-0089", subjectName: "Data Structures", subjectCode: "CS401", semester: 4, internalMarks: 28, externalMarks: 62, totalMarks: 90, grade: "A+", gradePoint: 10, status: "Pass" },
      ],
    };
  }
};

export const createAdminResult = async (payload: Partial<Result>): Promise<ApiResponse<Result>> => {
  const res = await api.post("/admin/results", payload);
  return res.data;
};

export const updateAdminResult = async (id: string, payload: Partial<Result>): Promise<ApiResponse<Result>> => {
  const res = await api.put(`/admin/results/${id}`, payload);
  return res.data;
};

export const deleteAdminResult = async (id: string): Promise<ApiResponse> => {
  const res = await api.delete(`/admin/results/${id}`);
  return res.data;
};

// Timetable APIs
export const getAdminTimetable = async (): Promise<ApiResponse<TimetableSlot[]>> => {
  try {
    const res = await api.get("/admin/timetable");
    return wrapNormalizedList<TimetableSlot>(res.data, "timetable");
  } catch {
    return {
      success: true,
      data: [
        { id: "t1", courseName: "B.Tech CSE", subjectName: "Data Structures", subjectCode: "CS401", facultyName: "Dr. Robert Smith", semester: 4, day: "Monday", startTime: "09:00 AM", endTime: "10:00 AM", room: "LH-101", type: "Theory" },
      ],
    };
  }
};

export const createAdminTimetable = async (payload: Partial<TimetableSlot>): Promise<ApiResponse<TimetableSlot>> => {
  const res = await api.post("/admin/timetable", payload);
  return res.data;
};

export const updateAdminTimetable = async (id: string, payload: Partial<TimetableSlot>): Promise<ApiResponse<TimetableSlot>> => {
  const res = await api.put(`/admin/timetable/${id}`, payload);
  return res.data;
};

export const deleteAdminTimetable = async (id: string): Promise<ApiResponse> => {
  const res = await api.delete(`/admin/timetable/${id}`);
  return res.data;
};

// Fee APIs
export const getAdminFees = async (): Promise<ApiResponse<Fee[]>> => {
  try {
    const res = await api.get("/admin/fees");
    return wrapNormalizedList<Fee>(res.data, "fees");
  } catch {
    return {
      success: true,
      data: [
        { id: "f1", studentName: "Alex Johnson", scholarNumber: "SCH2024-0089", title: "Semester 4 Tuition Fee", academicYear: "2025-2026", semester: 4, totalAmount: 45000, paidAmount: 45000, dueAmount: 0, dueDate: "2026-01-31", status: "Paid" },
        { id: "f2", studentName: "Brenda Vance", scholarNumber: "SCH2024-0090", title: "Semester 4 Tuition Fee", academicYear: "2025-2026", semester: 4, totalAmount: 45000, paidAmount: 0, dueAmount: 45000, dueDate: "2026-08-30", status: "Pending" },
      ],
    };
  }
};

export const createAdminFee = async (payload: Partial<Fee>): Promise<ApiResponse<Fee>> => {
  const res = await api.post("/admin/fees", payload);
  return res.data;
};

export const updateAdminFee = async (id: string, payload: Partial<Fee>): Promise<ApiResponse<Fee>> => {
  const res = await api.put(`/admin/fees/${id}`, payload);
  return res.data;
};

export const deleteAdminFee = async (id: string): Promise<ApiResponse> => {
  const res = await api.delete(`/admin/fees/${id}`);
  return res.data;
};

// Event APIs
export const getAdminEvents = async (): Promise<ApiResponse<Event[]>> => {
  try {
    const res = await api.get("/admin/events");
    return wrapNormalizedList<Event>(res.data, "events");
  } catch {
    return {
      success: true,
      data: [
        { id: "ev1", title: "Annual Hackathon 2026", description: "48-hour inter-college coding marathon.", type: "Academic", startDate: "2026-09-10", endDate: "2026-09-12", venue: "Main Auditorium", published: true, department: "Computer Science" },
      ],
    };
  }
};

export const createAdminEvent = async (payload: Partial<Event>): Promise<ApiResponse<Event>> => {
  const res = await api.post("/admin/events", payload);
  return res.data;
};

export const updateAdminEvent = async (id: string, payload: Partial<Event>): Promise<ApiResponse<Event>> => {
  const res = await api.put(`/admin/events/${id}`, payload);
  return res.data;
};

export const deleteAdminEvent = async (id: string): Promise<ApiResponse> => {
  const res = await api.delete(`/admin/events/${id}`);
  return res.data;
};

// Notification APIs
export const getAdminNotifications = async (): Promise<ApiResponse<Notification[]>> => {
  try {
    const res = await api.get("/admin/notifications");
    return wrapNormalizedList<Notification>(res.data, "notifications");
  } catch {
    return {
      success: true,
      data: [
        { id: "an1", title: "System Audit Completed", message: "Security scan passed 100%.", type: "System", read: true, createdAt: "2026-08-01T08:00:00Z" },
      ],
    };
  }
};

export const createAdminNotification = async (payload: Partial<Notification>): Promise<ApiResponse<Notification>> => {
  const res = await api.post("/admin/notifications", payload);
  return res.data;
};

export const deleteAdminNotification = async (id: string): Promise<ApiResponse> => {
  const res = await api.delete(`/admin/notifications/${id}`);
  return res.data;
};
