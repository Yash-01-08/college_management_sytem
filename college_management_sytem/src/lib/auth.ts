import { User, UserRole } from "./types";
import { db } from "./db";

export const CURRENT_USER_KEY = "campuspulse_active_user";

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(CURRENT_USER_KEY);
  if (!data) {
    // Default to student user for easy testing
    const defaultUser = db.getUserById("user-student-1");
    if (defaultUser) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(defaultUser));
      return defaultUser;
    }
    return null;
  }
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function setStoredUser(user: User | null) {
  if (typeof window === "undefined") return;
  if (!user) {
    localStorage.removeItem(CURRENT_USER_KEY);
  } else {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    STUDENT: 1,
    FACULTY: 2,
    COORDINATOR: 3,
    ADMIN: 4,
  };
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}
