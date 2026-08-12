import { getAdminDepartments, createAdminDepartment, updateAdminDepartment, deleteAdminDepartment } from "./adminService";
import { getCoordinatorDepartments, createCoordinatorDepartment, updateCoordinatorDepartment, deleteCoordinatorDepartment } from "./coordinatorService";
import { Department, ApiResponse } from "../types";

export const getDepartments = async (): Promise<ApiResponse<Department[]>> => {
  try {
    return await getAdminDepartments();
  } catch {
    return await getCoordinatorDepartments();
  }
};

export const createDepartment = async (payload: Partial<Department>): Promise<ApiResponse<Department>> => {
  try {
    return await createAdminDepartment(payload);
  } catch {
    return await createCoordinatorDepartment(payload);
  }
};

export const updateDepartment = async (id: string, payload: Partial<Department>): Promise<ApiResponse<Department>> => {
  try {
    return await updateAdminDepartment(id, payload);
  } catch {
    return await updateCoordinatorDepartment(id, payload);
  }
};

export const deleteDepartment = async (id: string): Promise<ApiResponse> => {
  try {
    return await deleteAdminDepartment(id);
  } catch {
    return await deleteCoordinatorDepartment(id);
  }
};
