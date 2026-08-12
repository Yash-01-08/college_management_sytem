import { UserRole } from "../types";

export const getDashboardRoute = (role?: UserRole | string): string => {
  const normalizedRole = role?.toLowerCase();
  switch (normalizedRole) {
    case "student":
      return "/student/dashboard";
    case "faculty":
      return "/faculty/dashboard";
    case "coordinator":
      return "/coordinator/dashboard";
    case "admin":
      return "/admin/dashboard";
    default:
      return "/login";
  }
};
