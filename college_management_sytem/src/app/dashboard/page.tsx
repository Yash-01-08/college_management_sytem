"use client";

import React, { useState, useEffect } from "react";
import { getStoredUser } from "@/lib/auth";
import { User } from "@/lib/types";
import StudentDashboard from "./student/page";
import FacultyDashboard from "./faculty/page";
import CoordinatorDashboard from "./coordinator/page";
import AdminDashboard from "./admin/page";

export default function UnifiedDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getStoredUser());
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-xs font-semibold">
        Loading Dashboard...
      </div>
    );
  }

  const role = user?.role || "STUDENT";

  if (role === "FACULTY") return <FacultyDashboard />;
  if (role === "COORDINATOR") return <CoordinatorDashboard />;
  if (role === "ADMIN") return <AdminDashboard />;
  return <StudentDashboard />;
}
