import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar, { SidebarNavItem } from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import {
  LayoutDashboard,
  UserCircle,
  BookOpen,
  Users,
  ClipboardList,
  Award,
  Calendar,
  Sparkles,
  Bell,
} from "lucide-react";
import { getFacultyNotifications } from "../services/facultyService";
import { Notification } from "../types";

export const FacultyLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    getFacultyNotifications()
      .then((res) => {
        const raw = res.data;
        const list = Array.isArray(raw)
          ? raw
          : (raw as any)?.notifications && Array.isArray((raw as any).notifications)
          ? (raw as any).notifications
          : [];
        setNotifications(list);
      })
      .catch(() => {});
  }, []);

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id || n._id === id ? { ...n, read: true, isRead: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true, isRead: true })));
  };

  const navItems: SidebarNavItem[] = [
    { label: "Dashboard", path: "/faculty/dashboard", icon: LayoutDashboard },
    { label: "Profile", path: "/faculty/profile", icon: UserCircle },
    { label: "My Subjects", path: "/faculty/subjects", icon: BookOpen },
    { label: "Students", path: "/faculty/students", icon: Users },
    { label: "Attendance", path: "/faculty/attendance", icon: ClipboardList },
    { label: "Results", path: "/faculty/results", icon: Award },
    { label: "Timetable", path: "/faculty/timetable", icon: Calendar },
    { label: "Events", path: "/faculty/events", icon: Sparkles },
    { label: "Notifications", path: "/faculty/notifications", icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 flex transition-colors duration-200">
      <Sidebar
        roleTitle="Faculty Portal"
        navItems={navItems}
        isOpenMobile={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onToggleMobileSidebar={() => setMobileOpen(!mobileOpen)}
          notifications={notifications}
          profilePath="/faculty/profile"
          notificationsPath="/faculty/notifications"
          onMarkNotificationRead={handleMarkRead}
          onMarkAllNotificationsRead={handleMarkAllRead}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default FacultyLayout;
