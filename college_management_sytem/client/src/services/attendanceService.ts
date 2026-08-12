import { getAdminAttendance, updateAdminAttendance, deleteAdminAttendance } from "./adminService";
import { getFacultyAttendance, createFacultyAttendance, updateFacultyAttendance } from "./facultyService";
import { getStudentAttendance } from "./studentService";
import { Attendance, ApiResponse } from "../types";

export const getAttendance = async (role?: string): Promise<ApiResponse<Attendance[]>> => {
  if (role === "student") return await getStudentAttendance();
  if (role === "faculty") return await getFacultyAttendance();
  return await getAdminAttendance();
};

export const createAttendance = async (payload: {
  subjectId: string;
  date: string;
  records: { studentId: string; status: "Present" | "Absent" | "Late" }[];
}): Promise<ApiResponse<Attendance>> => {
  return await createFacultyAttendance(payload);
};

export const updateAttendance = async (id: string, payload: any): Promise<ApiResponse<Attendance>> => {
  try {
    return await updateAdminAttendance(id, payload);
  } catch {
    return await updateFacultyAttendance(id, payload);
  }
};

export const deleteAttendance = async (id: string): Promise<ApiResponse> => {
  return await deleteAdminAttendance(id);
};
