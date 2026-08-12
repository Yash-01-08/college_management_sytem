import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar, { SidebarNavItem } from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import {
  LayoutDashboard,
  UserCircle,
  Building2,
  GraduationCap,
  BookOpen,
  UserCheck,
  UserPlus,
  Users,
  UserCog,
  Calendar,
  Sparkles,
  Bell,
} from "lucide-react";
import { getCoordinatorNotifications } from "../services/coordinatorService";
import { Notification } from "../types";

export const CoordinatorLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    getCoordinatorNotifications()
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
    { label: "Dashboard", path: "/coordinator/dashboard", icon: LayoutDashboard },
    { label: "Profile", path: "/coordinator/profile", icon: UserCircle },
    { label: "Departments", path: "/coordinator/departments", icon: Building2 },
    { label: "Courses", path: "/coordinator/courses", icon: GraduationCap },
    { label: "Subjects", path: "/coordinator/subjects", icon: BookOpen },
    { label: "Enrollments", path: "/coordinator/enrollments", icon: UserCheck },
    { label: "Faculty Assignments", path: "/coordinator/assignments", icon: UserPlus },
    { label: "Students", path: "/coordinator/students", icon: Users },
    { label: "Faculty", path: "/coordinator/faculty", icon: UserCog },
    { label: "Timetable", path: "/coordinator/timetable", icon: Calendar },
    { label: "Events", path: "/coordinator/events", icon: Sparkles },
    { label: "Notifications", path: "/coordinator/notifications", icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 flex transition-colors duration-200">
      <Sidebar
        roleTitle="Coordinator Portal"
        navItems={navItems}
        isOpenMobile={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onToggleMobileSidebar={() => setMobileOpen(!mobileOpen)}
          notifications={notifications}
          profilePath="/coordinator/profile"
          notificationsPath="/coordinator/notifications"
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

export default CoordinatorLayout;
