import { getAdminEnrollments, createAdminEnrollment, updateAdminEnrollment, deleteAdminEnrollment } from "./adminService";
import { getCoordinatorEnrollments, createCoordinatorEnrollment, updateCoordinatorEnrollment } from "./coordinatorService";
import { getStudentEnrollments, createStudentEnrollment } from "./studentService";
import { Enrollment, ApiResponse } from "../types";

export const getEnrollments = async (role?: string): Promise<ApiResponse<Enrollment[]>> => {
  if (role === "student") return await getStudentEnrollments();
  try {
    return await getAdminEnrollments();
  } catch {
    return await getCoordinatorEnrollments();
  }
};

export const createEnrollment = async (payload: Partial<Enrollment> & { subjectId?: string }): Promise<ApiResponse<Enrollment>> => {
  if (payload.subjectId && !payload.student) {
    return await createStudentEnrollment({ subjectId: payload.subjectId });
  }
  try {
    return await createAdminEnrollment(payload);
  } catch {
    return await createCoordinatorEnrollment(payload);
  }
};

export const updateEnrollment = async (id: string, payload: Partial<Enrollment>): Promise<ApiResponse<Enrollment>> => {
  try {
    return await updateAdminEnrollment(id, payload);
  } catch {
    return await updateCoordinatorEnrollment(id, payload);
  }
};

export const deleteEnrollment = async (id: string): Promise<ApiResponse> => {
  return await deleteAdminEnrollment(id);
};
