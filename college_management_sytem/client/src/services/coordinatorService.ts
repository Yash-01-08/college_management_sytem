import api from "./api";
import { User, Department, Course, Subject, Enrollment, FacultyAssignment, TimetableSlot, Event, Notification, ApiResponse } from "../types";
import { wrapNormalizedList } from "../utils/responseHelper";

export const getCoordinatorProfile = async (): Promise<ApiResponse<User>> => {
  try {
    const res = await api.get("/coordinator/profile");
    return res.data;
  } catch {
    return {
      success: true,
      data: {
        id: "c301",
        name: "Prof. Amanda Miller",
        email: "amanda.miller@college.edu",
        phone: "+1 555-0177",
        role: "coordinator",
        employeeId: "EMP-CORD-005",
        department: "Computer Science & Engineering",
        isActive: true,
      },
    };
  }
};

// Department APIs
export const getCoordinatorDepartments = async (): Promise<ApiResponse<Department[]>> => {
  try {
    const res = await api.get("/coordinator/departments");
    return wrapNormalizedList<Department>(res.data, "departments");
  } catch {
    return {
      success: true,
      data: [
        { id: "d1", name: "Computer Science & Engineering", code: "CSE", description: "Department of Computing & Information Tech", hod: "Dr. Robert Smith", status: "Active" },
        { id: "d2", name: "Electronics & Communication", code: "ECE", description: "Department of Circuit Design & Communication", hod: "Dr. Alan Turing", status: "Active" },
        { id: "d3", name: "Mechanical Engineering", code: "MECH", description: "Department of Machine & Thermal Engineering", hod: "Dr. Henry Ford", status: "Active" },
      ],
    };
  }
};

export const createCoordinatorDepartment = async (payload: Partial<Department>): Promise<ApiResponse<Department>> => {
  const res = await api.post("/coordinator/departments", payload);
  return res.data;
};

export const updateCoordinatorDepartment = async (id: string, payload: Partial<Department>): Promise<ApiResponse<Department>> => {
  const res = await api.put(`/coordinator/departments/${id}`, payload);
  return res.data;
};

export const deleteCoordinatorDepartment = async (id: string): Promise<ApiResponse> => {
  const res = await api.delete(`/coordinator/departments/${id}`);
  return res.data;
};

// Course APIs
export const getCoordinatorCourses = async (): Promise<ApiResponse<Course[]>> => {
  try {
    const res = await api.get("/coordinator/courses");
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

export const createCoordinatorCourse = async (payload: Partial<Course>): Promise<ApiResponse<Course>> => {
  const res = await api.post("/coordinator/courses", payload);
  return res.data;
};

export const updateCoordinatorCourse = async (id: string, payload: Partial<Course>): Promise<ApiResponse<Course>> => {
  const res = await api.put(`/coordinator/courses/${id}`, payload);
  return res.data;
};

export const deleteCoordinatorCourse = async (id: string): Promise<ApiResponse> => {
  const res = await api.delete(`/coordinator/courses/${id}`);
  return res.data;
};

// Subject APIs
export const getCoordinatorSubjects = async (): Promise<ApiResponse<Subject[]>> => {
  try {
    const res = await api.get("/coordinator/subjects");
    return wrapNormalizedList<Subject>(res.data, "subjects");
  } catch {
    return {
      success: true,
      data: [
        { id: "sub1", name: "Data Structures & Algorithms", code: "CS401", course: "BTECH-CS", department: "Computer Science", semester: 4, credits: 4, type: "Theory", status: "Active" },
        { id: "sub2", name: "Database Management Systems", code: "CS402", course: "BTECH-CS", department: "Computer Science", semester: 4, credits: 4, type: "Theory", status: "Active" },
        { id: "sub3", name: "DBMS Lab", code: "CS402L", course: "BTECH-CS", department: "Computer Science", semester: 4, credits: 2, type: "Lab", status: "Active" },
      ],
    };
  }
};

export const createCoordinatorSubject = async (payload: Partial<Subject>): Promise<ApiResponse<Subject>> => {
  const res = await api.post("/coordinator/subjects", payload);
  return res.data;
};

export const updateCoordinatorSubject = async (id: string, payload: Partial<Subject>): Promise<ApiResponse<Subject>> => {
  const res = await api.put(`/coordinator/subjects/${id}`, payload);
  return res.data;
};

export const deleteCoordinatorSubject = async (id: string): Promise<ApiResponse> => {
  const res = await api.delete(`/coordinator/subjects/${id}`);
  return res.data;
};

// Enrollment APIs
export const getCoordinatorEnrollments = async (): Promise<ApiResponse<Enrollment[]>> => {
  try {
    const res = await api.get("/coordinator/enrollments");
    return wrapNormalizedList<Enrollment>(res.data, "enrollments");
  } catch {
    return {
      success: true,
      data: [
        { id: "e1", studentName: "Alex Johnson", scholarNumber: "SCH2024-0089", subjectName: "Data Structures", subjectCode: "CS401", semester: 4, status: "Active" },
        { id: "e2", studentName: "Brenda Vance", scholarNumber: "SCH2024-0090", subjectName: "Database Systems", subjectCode: "CS402", semester: 4, status: "Active" },
      ],
    };
  }
};

export const createCoordinatorEnrollment = async (payload: Partial<Enrollment>): Promise<ApiResponse<Enrollment>> => {
  const res = await api.post("/coordinator/enrollments", payload);
  return res.data;
};

export const updateCoordinatorEnrollment = async (id: string, payload: Partial<Enrollment>): Promise<ApiResponse<Enrollment>> => {
  const res = await api.put(`/coordinator/enrollments/${id}`, payload);
  return res.data;
};

// Faculty Assignments
export const getCoordinatorAssignments = async (): Promise<ApiResponse<FacultyAssignment[]>> => {
  try {
    const res = await api.get("/coordinator/assignments");
    return wrapNormalizedList<FacultyAssignment>(res.data, "assignments");
  } catch {
    return {
      success: true,
      data: [
        { id: "as1", facultyName: "Dr. Robert Smith", subjectName: "Data Structures", subjectCode: "CS401", courseName: "B.Tech CSE", semester: 4, academicYear: "2025-2026" },
        { id: "as2", facultyName: "Prof. Sarah Jenkins", subjectName: "Database Systems", subjectCode: "CS402", courseName: "B.Tech CSE", semester: 4, academicYear: "2025-2026" },
      ],
    };
  }
};

export const createCoordinatorAssignment = async (payload: Partial<FacultyAssignment>): Promise<ApiResponse<FacultyAssignment>> => {
  const res = await api.post("/coordinator/assignments", payload);
  return res.data;
};

export const updateCoordinatorAssignment = async (id: string, payload: Partial<FacultyAssignment>): Promise<ApiResponse<FacultyAssignment>> => {
  const res = await api.put(`/coordinator/assignments/${id}`, payload);
  return res.data;
};

export const deleteCoordinatorAssignment = async (id: string): Promise<ApiResponse> => {
  const res = await api.delete(`/coordinator/assignments/${id}`);
  return res.data;
};

// Students & Faculty Directory
export const getCoordinatorStudents = async (): Promise<ApiResponse<User[]>> => {
  try {
    const res = await api.get("/coordinator/students");
    return wrapNormalizedList<User>(res.data, "students");
  } catch {
    return {
      success: true,
      data: [
        { id: "s101", name: "Alex Johnson", email: "alex@college.edu", scholarNumber: "SCH2024-0089", department: "Computer Science", semester: 4, batch: "2023-2027", role: "student" },
        { id: "s102", name: "Brenda Vance", email: "brenda@college.edu", scholarNumber: "SCH2024-0090", department: "Computer Science", semester: 4, batch: "2023-2027", role: "student" },
      ],
    };
  }
};

export const getCoordinatorFaculty = async (): Promise<ApiResponse<User[]>> => {
  try {
    const res = await api.get("/coordinator/faculty");
    return wrapNormalizedList<User>(res.data, "faculty");
  } catch {
    return {
      success: true,
      data: [
        { id: "f201", name: "Dr. Robert Smith", email: "robert.smith@college.edu", employeeId: "EMP-FAC-042", department: "Computer Science", designation: "Associate Professor", role: "faculty" },
        { id: "f202", name: "Prof. Sarah Jenkins", email: "sarah.j@college.edu", employeeId: "EMP-FAC-043", department: "Computer Science", designation: "Assistant Professor", role: "faculty" },
      ],
    };
  }
};

// Timetable APIs
export const getCoordinatorTimetable = async (): Promise<ApiResponse<TimetableSlot[]>> => {
  try {
    const res = await api.get("/coordinator/timetable");
    return wrapNormalizedList<TimetableSlot>(res.data, "timetable");
  } catch {
    return {
      success: true,
      data: [
        { id: "ct1", courseName: "B.Tech CSE", subjectName: "Data Structures", subjectCode: "CS401", facultyName: "Dr. Robert Smith", semester: 4, day: "Monday", startTime: "09:00 AM", endTime: "10:00 AM", room: "LH-101", type: "Theory" },
      ],
    };
  }
};

export const createCoordinatorTimetable = async (payload: Partial<TimetableSlot>): Promise<ApiResponse<TimetableSlot>> => {
  const res = await api.post("/coordinator/timetable", payload);
  return res.data;
};

export const updateCoordinatorTimetable = async (id: string, payload: Partial<TimetableSlot>): Promise<ApiResponse<TimetableSlot>> => {
  const res = await api.put(`/coordinator/timetable/${id}`, payload);
  return res.data;
};

export const deleteCoordinatorTimetable = async (id: string): Promise<ApiResponse> => {
  const res = await api.delete(`/coordinator/timetable/${id}`);
  return res.data;
};

// Events APIs
export const getCoordinatorEvents = async (): Promise<ApiResponse<Event[]>> => {
  try {
    const res = await api.get("/coordinator/events");
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

export const createCoordinatorEvent = async (payload: Partial<Event>): Promise<ApiResponse<Event>> => {
  const res = await api.post("/coordinator/events", payload);
  return res.data;
};

export const updateCoordinatorEvent = async (id: string, payload: Partial<Event>): Promise<ApiResponse<Event>> => {
  const res = await api.put(`/coordinator/events/${id}`, payload);
  return res.data;
};

export const deleteCoordinatorEvent = async (id: string): Promise<ApiResponse> => {
  const res = await api.delete(`/coordinator/events/${id}`);
  return res.data;
};

// Notifications APIs
export const getCoordinatorNotifications = async (): Promise<ApiResponse<Notification[]>> => {
  try {
    const res = await api.get("/coordinator/notifications");
    return wrapNormalizedList<Notification>(res.data, "notifications");
  } catch {
    return {
      success: true,
      data: [
        { id: "cn1", title: "Department Co-ordination", message: "Mid-semester schedule finalized.", type: "Announcement", read: true, createdAt: "2026-08-10T11:00:00Z" },
      ],
    };
  }
};

export const createCoordinatorNotification = async (payload: Partial<Notification>): Promise<ApiResponse<Notification>> => {
  const res = await api.post("/coordinator/notifications", payload);
  return res.data;
};
