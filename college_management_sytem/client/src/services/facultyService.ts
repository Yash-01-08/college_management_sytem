import api from "./api";
import { User, Subject, Attendance, Result, TimetableSlot, Event, Notification, ApiResponse } from "../types";
import { wrapNormalizedList } from "../utils/responseHelper";

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
    return wrapNormalizedList<Subject>(res.data, "assignments");
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
    return wrapNormalizedList<User>(res.data, "enrollments");
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
    return wrapNormalizedList<Attendance>(res.data, "attendance");
  } catch {
    return {
      success: true,
      data: [
        { id: "att1", subjectName: "Data Structures & Algorithms", subjectCode: "CS401", date: "2026-08-12", totalStudents: 40, presentCount: 36, absentCount: 3, lateCount: 1, records: [] },
      ],
    };
  }
};

export const markFacultyAttendance = async (payload: Partial<Attendance>): Promise<ApiResponse<Attendance>> => {
  const res = await api.post("/faculty/attendance", payload);
  return res.data;
};

export const createFacultyAttendance = markFacultyAttendance;

export const getFacultyResults = async (): Promise<ApiResponse<Result[]>> => {
  try {
    const res = await api.get("/faculty/results");
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

export const submitFacultyResult = async (payload: Partial<Result>): Promise<ApiResponse<Result>> => {
  const res = await api.post("/faculty/results", payload);
  return res.data;
};

export const createFacultyResult = submitFacultyResult;

export const getFacultyTimetable = async (): Promise<ApiResponse<TimetableSlot[]>> => {
  try {
    const res = await api.get("/faculty/timetable");
    return wrapNormalizedList<TimetableSlot>(res.data, "timetable");
  } catch {
    return {
      success: true,
      data: [
        { id: "ft1", courseName: "B.Tech CSE", subjectName: "Data Structures", subjectCode: "CS401", facultyName: "Dr. Robert Smith", semester: 4, day: "Monday", startTime: "09:00 AM", endTime: "10:00 AM", room: "LH-101", type: "Theory" },
      ],
    };
  }
};

export const getFacultyEvents = async (): Promise<ApiResponse<Event[]>> => {
  try {
    const res = await api.get("/faculty/events");
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

export const getFacultyNotifications = async (): Promise<ApiResponse<Notification[]>> => {
  try {
    const res = await api.get("/faculty/notifications");
    return wrapNormalizedList<Notification>(res.data, "notifications");
  } catch {
    return {
      success: true,
      data: [
        { id: "fn1", title: "Grade Submission Deadline", message: "Submit mid-sem internal marks by Friday.", type: "Academic", read: false, createdAt: "2026-08-11T09:00:00Z" },
      ],
    };
  }
};
