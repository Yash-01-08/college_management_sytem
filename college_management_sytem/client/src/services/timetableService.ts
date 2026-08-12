import { getAdminTimetable, createAdminTimetable, updateAdminTimetable, deleteAdminTimetable } from "./adminService";
import { getCoordinatorTimetable, createCoordinatorTimetable, updateCoordinatorTimetable, deleteCoordinatorTimetable } from "./coordinatorService";
import { getFacultyTimetable } from "./facultyService";
import { getStudentTimetable } from "./studentService";
import { TimetableSlot, ApiResponse } from "../types";

export const getTimetable = async (role?: string): Promise<ApiResponse<TimetableSlot[]>> => {
  if (role === "student") return await getStudentTimetable();
  if (role === "faculty") return await getFacultyTimetable();
  try {
    return await getAdminTimetable();
  } catch {
    return await getCoordinatorTimetable();
  }
};

export const createTimetable = async (payload: Partial<TimetableSlot>): Promise<ApiResponse<TimetableSlot>> => {
  try {
    return await createAdminTimetable(payload);
  } catch {
    return await createCoordinatorTimetable(payload);
  }
};

export const updateTimetable = async (id: string, payload: Partial<TimetableSlot>): Promise<ApiResponse<TimetableSlot>> => {
  try {
    return await updateAdminTimetable(id, payload);
  } catch {
    return await updateCoordinatorTimetable(id, payload);
  }
};

export const deleteTimetable = async (id: string): Promise<ApiResponse> => {
  try {
    return await deleteAdminTimetable(id);
  } catch {
    return await deleteCoordinatorTimetable(id);
  }
};
