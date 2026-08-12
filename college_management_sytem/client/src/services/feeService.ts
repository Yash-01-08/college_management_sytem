import { getAdminFees, createAdminFee, updateAdminFee, deleteAdminFee } from "./adminService";
import { getStudentFees } from "./studentService";
import { Fee, ApiResponse } from "../types";

export const getFees = async (role?: string): Promise<ApiResponse<Fee[]>> => {
  if (role === "student") return await getStudentFees();
  return await getAdminFees();
};

export const createFee = async (payload: Partial<Fee>): Promise<ApiResponse<Fee>> => {
  return await createAdminFee(payload);
};

export const updateFee = async (id: string, payload: Partial<Fee>): Promise<ApiResponse<Fee>> => {
  return await updateAdminFee(id, payload);
};

export const deleteFee = async (id: string): Promise<ApiResponse> => {
  return await deleteAdminFee(id);
};
