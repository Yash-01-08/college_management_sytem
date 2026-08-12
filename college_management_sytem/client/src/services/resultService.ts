import { getAdminResults, createAdminResult, updateAdminResult, deleteAdminResult } from "./adminService";
import { getFacultyResults, createFacultyResult, updateFacultyResult } from "./facultyService";
import { getStudentResults } from "./studentService";
import { Result, ApiResponse } from "../types";

export const getResults = async (role?: string): Promise<ApiResponse<Result[]>> => {
  if (role === "student") return await getStudentResults();
  if (role === "faculty") return await getFacultyResults();
  return await getAdminResults();
};

export const createResult = async (payload: any): Promise<ApiResponse<Result>> => {
  try {
    return await createAdminResult(payload);
  } catch {
    return await createFacultyResult(payload);
  }
};

export const updateResult = async (id: string, payload: any): Promise<ApiResponse<Result>> => {
  try {
    return await updateAdminResult(id, payload);
  } catch {
    return await updateFacultyResult(id, payload);
  }
};

export const deleteResult = async (id: string): Promise<ApiResponse> => {
  return await deleteAdminResult(id);
};
