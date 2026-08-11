import api from "../api/axios";
import { RegisterPayload, RegisterResponse, LoginResponse, MeResponse } from "../types/auth";

export const registerStudent = async (data: RegisterPayload) => {
  const response = await api.post<RegisterResponse>("/api/auth/register", data);
  return response.data;
};

export const loginStudent = async (identifier: string, password: string) => {
  const response = await api.post<LoginResponse>("/api/auth/login", {
    identifier,
    password,
  });
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post<{ success: boolean; message: string }>("/api/auth/logout");
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get<MeResponse>("/api/auth/me");
  return response.data;
};
