import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole } from "../types";
import { getCurrentUser, loginUser, logoutUser } from "../services/authService";

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string; role: UserRole }) => Promise<User>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const res = await getCurrentUser();
      if (res && res.user) {
        setUser(res.user);
        setIsAuthenticated(true);
      } else if (res && res.data && res.data.user) {
        setUser(res.data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    // Listen for unauthorized 401 custom events from axios interceptor
    const handleUnauthorized = () => {
      setUser(null);
      setIsAuthenticated(false);
    };
    window.addEventListener("cms_unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("cms_unauthorized", handleUnauthorized);
    };
  }, []);

  const login = async (credentials: { email: string; password: string; role: UserRole }): Promise<User> => {
    const res = await loginUser(credentials);
    const loggedUser = res.user || (res.data && res.data.user);
    if (!loggedUser) {
      throw new Error(res.message || "Login failed. Please check credentials and role.");
    }
    setUser(loggedUser);
    setIsAuthenticated(true);
    return loggedUser;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
