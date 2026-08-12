import { getAdminEvents, createAdminEvent, updateAdminEvent, deleteAdminEvent } from "./adminService";
import { getCoordinatorEvents, createCoordinatorEvent, updateCoordinatorEvent, deleteCoordinatorEvent } from "./coordinatorService";
import { getFacultyEvents } from "./facultyService";
import { getStudentEvents } from "./studentService";
import { Event, ApiResponse } from "../types";

export const getEvents = async (role?: string): Promise<ApiResponse<Event[]>> => {
  if (role === "student") return await getStudentEvents();
  if (role === "faculty") return await getFacultyEvents();
  try {
    return await getAdminEvents();
  } catch {
    return await getCoordinatorEvents();
  }
};

export const createEvent = async (payload: Partial<Event>): Promise<ApiResponse<Event>> => {
  try {
    return await createAdminEvent(payload);
  } catch {
    return await createCoordinatorEvent(payload);
  }
};

export const updateEvent = async (id: string, payload: Partial<Event>): Promise<ApiResponse<Event>> => {
  try {
    return await updateAdminEvent(id, payload);
  } catch {
    return await updateCoordinatorEvent(id, payload);
  }
};

export const deleteEvent = async (id: string): Promise<ApiResponse> => {
  try {
    return await deleteAdminEvent(id);
  } catch {
    return await deleteCoordinatorEvent(id);
  }
};
