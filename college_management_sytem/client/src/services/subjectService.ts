import { getAdminSubjects, createAdminSubject, updateAdminSubject, deleteAdminSubject } from "./adminService";
import { getCoordinatorSubjects, createCoordinatorSubject, updateCoordinatorSubject, deleteCoordinatorSubject } from "./coordinatorService";
import { Subject, ApiResponse } from "../types";

export const getSubjects = async (): Promise<ApiResponse<Subject[]>> => {
  try {
    return await getAdminSubjects();
  } catch {
    return await getCoordinatorSubjects();
  }
};

export const createSubject = async (payload: Partial<Subject>): Promise<ApiResponse<Subject>> => {
  try {
    return await createAdminSubject(payload);
  } catch {
    return await createCoordinatorSubject(payload);
  }
};

export const updateSubject = async (id: string, payload: Partial<Subject>): Promise<ApiResponse<Subject>> => {
  try {
    return await updateAdminSubject(id, payload);
  } catch {
    return await updateCoordinatorSubject(id, payload);
  }
};

export const deleteSubject = async (id: string): Promise<ApiResponse> => {
  try {
    return await deleteAdminSubject(id);
  } catch {
    return await deleteCoordinatorSubject(id);
  }
};
