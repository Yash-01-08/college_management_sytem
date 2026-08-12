import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar, { SidebarNavItem } from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import {
  LayoutDashboard,
  UserCircle,
  BookOpen,
  FileText,
  UserCheck,
  ClipboardList,
  Award,
  Calendar,
  CreditCard,
  Bell,
  Sparkles,
} from "lucide-react";
import { getStudentNotifications } from "../services/studentService";
import { Notification } from "../types";

export const StudentLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    getStudentNotifications()
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
    { label: "Dashboard", path: "/student/dashboard", icon: LayoutDashboard },
    { label: "Profile", path: "/student/profile", icon: UserCircle },
    { label: "Courses", path: "/student/courses", icon: BookOpen },
    { label: "Subjects", path: "/student/subjects", icon: FileText },
    { label: "Enrollment", path: "/student/enrollment", icon: UserCheck },
    { label: "Attendance", path: "/student/attendance", icon: ClipboardList },
    { label: "Results", path: "/student/results", icon: Award },
    { label: "Timetable", path: "/student/timetable", icon: Calendar },
    { label: "Fees", path: "/student/fees", icon: CreditCard },
    { label: "Events", path: "/student/events", icon: Sparkles },
    { label: "Notifications", path: "/student/notifications", icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 flex transition-colors duration-200">
      <Sidebar
        roleTitle="Student Portal"
        navItems={navItems}
        isOpenMobile={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onToggleMobileSidebar={() => setMobileOpen(!mobileOpen)}
          notifications={notifications}
          profilePath="/student/profile"
          notificationsPath="/student/notifications"
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

export default StudentLayout;
