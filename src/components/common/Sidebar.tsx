"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  QrCode,
  FileCheck,
  CalendarDays,
  Briefcase,
  User,
  Settings,
  ShieldAlert,
  Users,
  LogOut,
} from "lucide-react";
import { User as UserType } from "@/lib/types";
import { getStoredUser, setStoredUser } from "@/lib/auth";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const role = user?.role || "STUDENT";

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["STUDENT", "FACULTY", "COORDINATOR", "ADMIN"] },
    { label: "Attendance", href: "/attendance", icon: QrCode, roles: ["STUDENT", "FACULTY", "ADMIN"] },
    { label: "Assignments", href: "/assignments", icon: FileCheck, roles: ["STUDENT", "FACULTY", "ADMIN"] },
    { label: "Campus Events", href: "/events", icon: CalendarDays, roles: ["STUDENT", "FACULTY", "COORDINATOR", "ADMIN"] },
    { label: "Placements", href: "/placements", icon: Briefcase, roles: ["STUDENT", "FACULTY", "COORDINATOR", "ADMIN"] },
    { label: "Admin Control", href: "/dashboard/admin", icon: ShieldAlert, roles: ["ADMIN", "COORDINATOR"] },
    { label: "Profile", href: "/profile", icon: User, roles: ["STUDENT", "FACULTY", "COORDINATOR", "ADMIN"] },
    { label: "Settings", href: "/settings", icon: Settings, roles: ["STUDENT", "FACULTY", "COORDINATOR", "ADMIN"] },
  ];

  const filteredItems = navItems.filter((item) => item.roles.includes(role));

  const handleLogout = () => {
    setStoredUser(null);
    window.location.href = "/login";
  };

  return (
    <aside className="w-64 shrink-0 hidden md:block">
      <div className="sticky top-20 glass-card p-4 space-y-6">
        {/* User Card */}
        {user && (
          <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</h4>
              <p className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                {user.role}
              </p>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="space-y-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-500"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
