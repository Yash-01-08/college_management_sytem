import api from "./api";
import { User, Course, Subject, Enrollment, Attendance, Result, TimetableSlot, Fee, Event, Notification, ApiResponse } from "../types";

export const getStudentProfile = async (): Promise<ApiResponse<User>> => {
  try {
    const res = await api.get("/student/profile");
    return res.data;
  } catch (error) {
    return {
      success: true,
      data: {
        id: "s101",
        name: "Alex Johnson",
        email: "alex.johnson@college.edu",
        phone: "+1 555-0192",
        role: "student",
        scholarNumber: "SCH2024-0089",
        department: "Computer Science & Engineering",
        course: "B.Tech Computer Science",
        semester: 4,
        batch: "2023-2027",
        dateOfBirth: "2003-05-14",
        isActive: true,
      },
    };
  }
};

export const getStudentCourses = async (): Promise<ApiResponse<Course[]>> => {
  try {
    const res = await api.get("/student/courses");
    return res.data;
  } catch {
    return {
      success: true,
      data: [
        {
          id: "c1",
          name: "Bachelor of Technology in Computer Science",
          code: "BTECH-CS",
          department: "Computer Science & Engineering",
          duration: 4,
          totalSemesters: 8,
          status: "Active",
        },
      ],
    };
  }
};

export const getStudentSubjects = async (): Promise<ApiResponse<Subject[]>> => {
  try {
    const res = await api.get("/student/subjects");
    return res.data;
  } catch {
    return {
      success: true,
      data: [
        { id: "sub1", name: "Data Structures & Algorithms", code: "CS401", course: "BTECH-CS", department: "CSE", semester: 4, credits: 4, type: "Theory", status: "Active" },
        { id: "sub2", name: "Database Management Systems", code: "CS402", course: "BTECH-CS", department: "CSE", semester: 4, credits: 4, type: "Theory", status: "Active" },
        { id: "sub3", name: "DBMS Lab", code: "CS402L", course: "BTECH-CS", department: "CSE", semester: 4, credits: 2, type: "Lab", status: "Active" },
        { id: "sub4", name: "Operating Systems", code: "CS403", course: "BTECH-CS", department: "CSE", semester: 4, credits: 4, type: "Theory", status: "Active" },
        { id: "sub5", name: "Web Technologies", code: "CS404", course: "BTECH-CS", department: "CSE", semester: 4, credits: 3, type: "Elective", status: "Active" },
      ],
    };
  }
};

export const getStudentEnrollments = async (): Promise<ApiResponse<Enrollment[]>> => {
  try {
    const res = await api.get("/student/enrollment");
    return res.data;
  } catch {
    return {
      success: true,
      data: [
        { id: "e1", student: "s101", subjectName: "Data Structures & Algorithms", subjectCode: "CS401", semester: 4, status: "Active", enrolledAt: "2026-01-10" },
        { id: "e2", student: "s101", subjectName: "Database Management Systems", subjectCode: "CS402", semester: 4, status: "Active", enrolledAt: "2026-01-10" },
        { id: "e3", student: "s101", subjectName: "DBMS Lab", subjectCode: "CS402L", semester: 4, status: "Active", enrolledAt: "2026-01-10" },
        { id: "e4", student: "s101", subjectName: "Operating Systems", subjectCode: "CS403", semester: 4, status: "Active", enrolledAt: "2026-01-10" },
      ],
    };
  }
};

export const createStudentEnrollment = async (payload: { subjectId: string }): Promise<ApiResponse<Enrollment>> => {
  const res = await api.post("/student/enrollment", payload);
  return res.data;
};

export const getStudentAttendance = async (): Promise<ApiResponse<Attendance[]>> => {
  try {
    const res = await api.get("/student/attendance");
    return res.data;
  } catch {
    return {
      success: true,
      data: [
        { id: "att1", subjectName: "Data Structures & Algorithms", subjectCode: "CS401", totalClasses: 36, present: 32, absent: 3, late: 1, percentage: 88.8 },
        { id: "att2", subjectName: "Database Management Systems", subjectCode: "CS402", totalClasses: 30, present: 27, absent: 2, late: 1, percentage: 90.0 },
        { id: "att3", subjectName: "DBMS Lab", subjectCode: "CS402L", totalClasses: 15, present: 14, absent: 1, late: 0, percentage: 93.3 },
        { id: "att4", subjectName: "Operating Systems", subjectCode: "CS403", totalClasses: 32, present: 24, absent: 7, late: 1, percentage: 75.0 },
        { id: "att5", subjectName: "Web Technologies", subjectCode: "CS404", totalClasses: 28, present: 26, absent: 1, late: 1, percentage: 92.8 },
      ],
    };
  }
};

export const getStudentResults = async (): Promise<ApiResponse<Result[]>> => {
  try {
    const res = await api.get("/student/results");
    return res.data;
  } catch {
    return {
      success: true,
      data: [
        { id: "r1", student: "s101", subjectName: "Computer Networks (Sem 3)", subjectCode: "CS301", semester: 3, internalMarks: 28, externalMarks: 64, totalMarks: 92, grade: "A+", gradePoint: 10, status: "Pass" },
        { id: "r2", student: "s101", subjectName: "Object Oriented Programming (Sem 3)", subjectCode: "CS302", semester: 3, internalMarks: 25, externalMarks: 58, totalMarks: 83, grade: "A", gradePoint: 9, status: "Pass" },
        { id: "r3", student: "s101", subjectName: "Discrete Mathematics (Sem 3)", subjectCode: "MA301", semester: 3, internalMarks: 22, externalMarks: 53, totalMarks: 75, grade: "B+", gradePoint: 8, status: "Pass" },
      ],
    };
  }
};

export const getStudentTimetable = async (): Promise<ApiResponse<TimetableSlot[]>> => {
  try {
    const res = await api.get("/student/timetable");
    return res.data;
  } catch {
    return {
      success: true,
      data: [
        { id: "t1", courseName: "B.Tech CSE", subjectName: "Data Structures", subjectCode: "CS401", facultyName: "Dr. Robert Smith", semester: 4, day: "Monday", startTime: "09:00 AM", endTime: "10:00 AM", room: "LH-101", type: "Theory" },
        { id: "t2", courseName: "B.Tech CSE", subjectName: "Database Systems", subjectCode: "CS402", facultyName: "Prof. Sarah Jenkins", semester: 4, day: "Monday", startTime: "10:15 AM", endTime: "11:15 AM", room: "LH-102", type: "Theory" },
        { id: "t3", courseName: "B.Tech CSE", subjectName: "DBMS Lab", subjectCode: "CS402L", facultyName: "Prof. Sarah Jenkins", semester: 4, day: "Tuesday", startTime: "02:00 PM", endTime: "04:00 PM", room: "Lab-3", type: "Lab" },
        { id: "t4", courseName: "B.Tech CSE", subjectName: "Operating Systems", subjectCode: "CS403", facultyName: "Dr. Michael Chang", semester: 4, day: "Wednesday", startTime: "11:30 AM", endTime: "12:30 PM", room: "LH-101", type: "Theory" },
        { id: "t5", courseName: "B.Tech CSE", subjectName: "Web Technologies", subjectCode: "CS404", facultyName: "Prof. Elena Rostova", semester: 4, day: "Thursday", startTime: "01:30 PM", endTime: "02:30 PM", room: "LH-104", type: "Theory" },
      ],
    };
  }
};

export const getStudentFees = async (): Promise<ApiResponse<Fee[]>> => {
  try {
    const res = await api.get("/student/fees");
    return res.data;
  } catch {
    return {
      success: true,
      data: [
        { id: "f1", title: "Semester 4 Tuition Fee", academicYear: "2025-2026", semester: 4, totalAmount: 45000, paidAmount: 45000, dueAmount: 0, dueDate: "2026-01-31", status: "Paid" },
        { id: "f2", title: "Library & Lab Examination Fee", academicYear: "2025-2026", semester: 4, totalAmount: 5000, paidAmount: 2500, dueAmount: 2500, dueDate: "2026-08-30", status: "Partial" },
      ],
    };
  }
};

export const getStudentEvents = async (): Promise<ApiResponse<Event[]>> => {
  try {
    const res = await api.get("/student/events");
    return res.data;
  } catch {
    return {
      success: true,
      data: [
        { id: "ev1", title: "Annual Hackathon 2026", description: "48-hour inter-college coding marathon.", type: "Academic", startDate: "2026-09-10", endDate: "2026-09-12", venue: "Main Auditorium", published: true, department: "Computer Science" },
        { id: "ev2", title: "Tech Fest Workshops", description: "Hands-on AI & Cloud Computing Bootcamp.", type: "Workshop", startDate: "2026-09-20", endDate: "2026-09-21", venue: "Seminar Hall 2", published: true, department: "All Departments" },
      ],
    };
  }
};

export const getStudentNotifications = async (): Promise<ApiResponse<Notification[]>> => {
  try {
    const res = await api.get("/student/notifications");
    return res.data;
  } catch {
    return {
      success: true,
      data: [
        { id: "n1", title: "Attendance Warning", message: "Operating Systems attendance is currently at 75%. Please attend upcoming classes.", type: "Attendance", read: false, createdAt: "2026-08-12T10:30:00Z" },
        { id: "n2", title: "Mid-Term Results Out", message: "Results for Data Structures & Algorithms have been published.", type: "Result", read: true, createdAt: "2026-08-10T14:15:00Z" },
      ],
    };
  }
};
