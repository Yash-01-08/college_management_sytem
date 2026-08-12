import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types";
import { PageLoader } from "../components/ui/Loader";

interface RoleProtectedRouteProps {
  allowedRoles: UserRole[];
  children?: React.ReactNode;
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader message="Checking permissions..." />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role?.toLowerCase() as UserRole;
  const isAllowed = allowedRoles.some(
    (role) => role.toLowerCase() === userRole
  );

  if (!isAllowed) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default RoleProtectedRoute;
