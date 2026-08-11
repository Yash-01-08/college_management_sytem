export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "student" | "faculty" | "admin" | "coordinator";
  scholarNumber?: string;
  profileImage?: string | null;
  department?: string;
  course?: string;
  semester?: number;
  batch?: string;
  dateOfBirth?: string;
  isActive: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  department: string;
  course: string;
  semester: number;
  batch: string;
  dateOfBirth: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface MeResponse {
  success: boolean;
  message?: string;
  user: User;
}
