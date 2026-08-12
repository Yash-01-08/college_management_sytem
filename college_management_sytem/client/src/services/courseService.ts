import { getAdminCourses, createAdminCourse, updateAdminCourse, deleteAdminCourse } from "./adminService";
import { getCoordinatorCourses, createCoordinatorCourse, updateCoordinatorCourse, deleteCoordinatorCourse } from "./coordinatorService";
import { Course, ApiResponse } from "../types";

export const getCourses = async (): Promise<ApiResponse<Course[]>> => {
  try {
    return await getAdminCourses();
  } catch {
    return await getCoordinatorCourses();
  }
};

export const createCourse = async (payload: Partial<Course>): Promise<ApiResponse<Course>> => {
  try {
    return await createAdminCourse(payload);
  } catch {
    return await createCoordinatorCourse(payload);
  }
};

export const updateCourse = async (id: string, payload: Partial<Course>): Promise<ApiResponse<Course>> => {
  try {
    return await updateAdminCourse(id, payload);
  } catch {
    return await updateCoordinatorCourse(id, payload);
  }
};

export const deleteCourse = async (id: string): Promise<ApiResponse> => {
  try {
    return await deleteAdminCourse(id);
  } catch {
    return await deleteCoordinatorCourse(id);
  }
};
