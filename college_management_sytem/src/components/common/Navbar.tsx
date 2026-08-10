"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Sun,
  Moon,
  Search,
  Bell,
  Sparkles,
  UserCheck,
  LogOut,
  ChevronDown,
  Shield,
  BookOpen,
  Briefcase,
  Calendar,
} from "lucide-react";
import { User, UserRole } from "@/lib/types";
import { getStoredUser, setStoredUser } from "@/lib/auth";
import { db } from "@/lib/db";

interface NavbarProps {
  onOpenSearch?: () => void;
  onOpenAIChat?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, onOpenAIChat }) => {
  const [user, setUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
    if (typeof window !== "undefined") {
      const isDark = document.documentElement.classList.contains("dark");
      setDarkMode(isDark);
    }
  }, []);

  const toggleDarkMode = () => {
    if (typeof window === "undefined") return;
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  };

  const switchRole = (newRole: UserRole) => {
    const matchedUser = db.getUsers().find((u) => u.role === newRole);
    if (matchedUser) {
      setStoredUser(matchedUser);
      setUser(matchedUser);
      setRoleMenuOpen(false);
      window.location.href = "/dashboard";
    }
  };

  const notifications = user ? db.getNotifications(user.id) : [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full glass-card border-b border-slate-200/80 dark:border-slate-800/80 rounded-none px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              CampusPulse <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 font-semibold">AI v4.0</span>
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block -mt-1 font-medium">Smart Campus Platform</span>
          </div>
        </Link>

        {/* Global Search Trigger */}
        <button
          onClick={onOpenSearch}
          className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-medium transition-all w-64 justify-between shadow-inner"
        >
          <span className="flex items-center gap-2">
            <Search className="w-4 h-4 text-indigo-500" />
            <span>Search campus, events, jobs...</span>
          </span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded shadow-xs">
            Ctrl K
          </kbd>
        </button>

        {/* Right Action Icons & Role Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Server Connection Tester Link */}
          <Link
            href="/server-test"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold transition-all shadow-xs"
            title="Test Node.js Backend Connection & File Structure"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="hidden sm:inline">Server Status</span>
          </Link>

          {/* AI Assistant Button */}
          <button
            onClick={onOpenAIChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-200 dark:border-purple-800/50 text-purple-700 dark:text-purple-300 hover:from-purple-500/20 hover:to-indigo-500/20 text-xs font-semibold transition-all shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-pulse" />
            <span className="hidden sm:inline">Campus AI</span>
          </button>

          {/* Quick Demo Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 transition-all"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Role: <strong className="uppercase">{user?.role || "STUDENT"}</strong></span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 glass-card p-2 shadow-xl z-50 animate-in fade-in zoom-in-95">
                <div className="px-2 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Quick Judge Role Switcher
                </div>
                {(["STUDENT", "FACULTY", "COORDINATOR", "ADMIN"] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => switchRole(r)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                      user?.role === r
                        ? "bg-indigo-600 text-white font-semibold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span>{r} View</span>
                    {user?.role === r && <UserCheck className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Drawer */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 animate-ping" />
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 glass-card p-3 shadow-xl z-50 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Notifications ({notifications.length})
                  </h4>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer">
                    Mark read
                  </span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 text-xs"
                    >
                      <div className="font-semibold text-slate-900 dark:text-white">{n.title}</div>
                      <div className="text-slate-500 dark:text-slate-400 mt-0.5 text-[11px] leading-snug">
                        {n.message}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>

          {/* User Profile Avatar Link */}
          {user ? (
            <Link
              href="/profile"
              className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                {user.name.charAt(0)}
              </div>
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
