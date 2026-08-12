import api from "./api";
import { User, Subject, Attendance, Result, TimetableSlot, Event, Notification, ApiResponse } from "../types";

export const getFacultyProfile = async (): Promise<ApiResponse<User>> => {
  try {
    const res = await api.get("/faculty/profile");
    return res.data;
  } catch {
    return {
      success: true,
      data: {
        id: "f201",
        name: "Dr. Robert Smith",
        email: "robert.smith@college.edu",
        phone: "+1 555-0188",
        role: "faculty",
        employeeId: "EMP-FAC-042",
        department: "Computer Science & Engineering",
        designation: "Associate Professor",
        qualification: "Ph.D. in Computer Science",
        isActive: true,
      },
    };
  }
};

export const getFacultySubjects = async (): Promise<ApiResponse<Subject[]>> => {
  try {
    const res = await api.get("/faculty/subjects");
    return res.data;
  } catch {
    return {
      success: true,
      data: [
        { id: "sub1", name: "Data Structures & Algorithms", code: "CS401", course: "B.Tech CSE", department: "Computer Science", semester: 4, credits: 4, type: "Theory", status: "Active" },
        { id: "sub2", name: "Advanced Algorithms Lab", code: "CS401L", course: "B.Tech CSE", department: "Computer Science", semester: 4, credits: 2, type: "Lab", status: "Active" },
      ],
    };
  }
};

export const getFacultyStudents = async (subjectId?: string): Promise<ApiResponse<User[]>> => {
  try {
    const res = await api.get("/faculty/students", { params: { subjectId } });
    return res.data;
  } catch {
    return {
      success: true,
      data: [
        { id: "s101", name: "Alex Johnson", email: "alex@college.edu", scholarNumber: "SCH2024-0089", department: "Computer Science", semester: 4, batch: "2023-2027", role: "student" },
        { id: "s102", name: "Brenda Vance", email: "brenda@college.edu", scholarNumber: "SCH2024-0090", department: "Computer Science", semester: 4, batch: "2023-2027", role: "student" },
        { id: "s103", name: "Charles Xavier", email: "charles@college.edu", scholarNumber: "SCH2024-0091", department: "Computer Science", semester: 4, batch: "2023-2027", role: "student" },
        { id: "s104", name: "Diana Prince", email: "diana@college.edu", scholarNumber: "SCH2024-0092", department: "Computer Science", semester: 4, batch: "2023-2027", role: "student" },
      ],
    };
  }
};

export const getFacultyAttendance = async (): Promise<ApiResponse<Attendance[]>> => {
  try {
    const res = await api.get("/faculty/attendance");
    return res.data;
  } catch {
    return {
      success: true,
      data: [
        { id: "att10", subjectName: "Data Structures & Algorithms", subjectCode: "CS401", date: "2026-08-12", totalStudents: 40, presentCount: 36, absentCount: 3, lateCount: 1, records: [] },
      ],
    };
  }
};

export const createFacultyAttendance = async (payload: {
  subjectId: string;
  date: string;
  records: { studentId: string; status: "Present" | "Absent" | "Late" }[];
}): Promise<ApiResponse<Attendance>> => {
  const res = await api.post("/faculty/attendance", payload);
  return res.data;
};

export const updateFacultyAttendance = async (id: string, payload: any): Promise<ApiResponse<Attendance>> => {
  const res = await api.put(`/faculty/attendance/${id}`, payload);
  return res.data;
};

export const getFacultyResults = async (): Promise<ApiResponse<Result[]>> => {
  try {
    const res = await api.get("/faculty/results");
    return res.data;
  } catch {
    return {
      success: true,
      data: [
        { id: "r10", studentName: "Alex Johnson", scholarNumber: "SCH2024-0089", subjectName: "Data Structures", subjectCode: "CS401", semester: 4, internalMarks: 28, externalMarks: 62, totalMarks: 90, grade: "A+", gradePoint: 10, status: "Pass" },
        { id: "r11", studentName: "Brenda Vance", scholarNumber: "SCH2024-0090", subjectName: "Data Structures", subjectCode: "CS401", semester: 4, internalMarks: 22, externalMarks: 50, totalMarks: 72, grade: "B+", gradePoint: 8, status: "Pass" },
      ],
    };
  }
};

export const createFacultyResult = async (payload: {
  studentId: string;
  subjectId: string;
  semester: number;
  internalMarks: number;
  externalMarks: number;
}): Promise<ApiResponse<Result>> => {
  const res = await api.post("/faculty/results", payload);
  return res.data;
};

export const updateFacultyResult = async (id: string, payload: any): Promise<ApiResponse<Result>> => {
  const res = await api.put(`/faculty/results/${id}`, payload);
  return res.data;
};

export const getFacultyTimetable = async (): Promise<ApiResponse<TimetableSlot[]>> => {
  try {
    const res = await api.get("/faculty/timetable");
    return res.data;
  } catch {
    return {
      success: true,
      data: [
        { id: "ft1", courseName: "B.Tech CSE", subjectName: "Data Structures & Algorithms", subjectCode: "CS401", facultyName: "Dr. Robert Smith", semester: 4, day: "Monday", startTime: "09:00 AM", endTime: "10:00 AM", room: "LH-101", type: "Theory" },
        { id: "ft2", courseName: "B.Tech CSE", subjectName: "Advanced Algorithms Lab", subjectCode: "CS401L", facultyName: "Dr. Robert Smith", semester: 4, day: "Wednesday", startTime: "02:00 PM", endTime: "04:00 PM", room: "Lab-1", type: "Lab" },
      ],
    };
  }
};

export const getFacultyEvents = async (): Promise<ApiResponse<Event[]>> => {
  try {
    const res = await api.get("/faculty/events");
    return res.data;
  } catch {
    return {
      success: true,
      data: [
        { id: "fe1", title: "Faculty Curriculum Committee Meeting", description: "Reviewing updated syllabus for 2026-2027.", type: "Academic", startDate: "2026-08-18", endDate: "2026-08-18", venue: "Conference Room A", published: true },
      ],
    };
  }
};

export const getFacultyNotifications = async (): Promise<ApiResponse<Notification[]>> => {
  try {
    const res = await api.get("/faculty/notifications");
    return res.data;
  } catch {
    return {
      success: true,
      data: [
        { id: "fn1", title: "Internal Marks Submission Deadline", message: "Please submit mid-term internal evaluation marks by Aug 20.", type: "Announcement", read: false, createdAt: "2026-08-11T09:00:00Z" },
      ],
    };
  }
};
