import api from "./api";
import { User, UserRole, ApiResponse } from "../types";

export interface LoginParams {
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterParams {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  scholarNumber?: string;
  employeeId?: string;
  department?: string;
  course?: string;
  semester?: number;
  batch?: string;
  dateOfBirth?: string;
  designation?: string;
  qualification?: string;
}

export const loginUser = async (credentials: LoginParams): Promise<ApiResponse<{ user: User }>> => {
  try {
    const res = await api.post("/auth/login", credentials);
    return res.data;
  } catch (error: any) {
    const msg = error.response?.data?.message || "Login failed. Invalid credentials or role mismatch.";
    throw new Error(msg);
  }
};

export const registerUser = async (data: RegisterParams): Promise<ApiResponse<{ user: User }>> => {
  try {
    const res = await api.post("/auth/register", data);
    return res.data;
  } catch (error: any) {
    const msg = error.response?.data?.message || "Registration failed. Please check form details.";
    throw new Error(msg);
  }
};

export const logoutUser = async (): Promise<ApiResponse> => {
  try {
    const res = await api.post("/auth/logout");
    return res.data;
  } catch (error: any) {
    return { success: true, message: "Logged out locally" };
  }
};

export const getCurrentUser = async (): Promise<ApiResponse<{ user: User }>> => {
  const res = await api.get("/auth/me");
  return res.data;
};

// Legacy exports if needed
export const loginStudent = (email: string, pass: string) => loginUser({ email, password: pass, role: "student" });
