import { getAdminNotifications, createAdminNotification, deleteAdminNotification } from "./adminService";
import { getCoordinatorNotifications, createCoordinatorNotification } from "./coordinatorService";
import { getFacultyNotifications } from "./facultyService";
import { getStudentNotifications } from "./studentService";
import { Notification, ApiResponse } from "../types";

export const getNotifications = async (role?: string): Promise<ApiResponse<Notification[]>> => {
  if (role === "student") return await getStudentNotifications();
  if (role === "faculty") return await getFacultyNotifications();
  try {
    return await getAdminNotifications();
  } catch {
    return await getCoordinatorNotifications();
  }
};

export const createNotification = async (payload: Partial<Notification>): Promise<ApiResponse<Notification>> => {
  try {
    return await createAdminNotification(payload);
  } catch {
    return await createCoordinatorNotification(payload);
  }
};

export const deleteNotification = async (id: string): Promise<ApiResponse> => {
  return await deleteAdminNotification(id);
};
