import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Users,
  GraduationCap,
  UserCheck,
  ShieldCheck,
  Building2,
  BookOpen,
  FileText,
  CreditCard,
  Sparkles,
  Bell,
  ArrowUpRight,
  UserCog,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import ErrorMessage from "../../components/ui/ErrorMessage";
import { getAdminDashboard } from "../../services/adminService";

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAdminDashboard()
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        setError(err.message || "Failed to load admin dashboard.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader message="Loading Admin System Metrics..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  }

  const metrics = data?.metrics || {};
  const recentUsers = data?.recentUsers || [];
  const events = data?.events || [];
  const notifications = data?.notifications || [];

  const statCards = [
    { label: "Students Enrolled", value: metrics.totalStudents ?? 0, icon: GraduationCap, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10", link: "/admin/users?role=student" },
    { label: "Faculty Members", value: metrics.totalFaculty ?? 0, icon: UserCheck, color: "text-cyan-500 bg-cyan-50 dark:bg-cyan-500/10", link: "/admin/users?role=faculty" },
    { label: "Coordinators", value: metrics.totalCoordinators ?? 0, icon: ShieldCheck, color: "text-amber-500 bg-amber-50 dark:bg-amber-500/10", link: "/admin/users?role=coordinator" },
    { label: "Departments", value: metrics.totalDepartments ?? 0, icon: Building2, color: "text-rose-500 bg-rose-50 dark:bg-rose-500/10", link: "/admin/departments" },
    { label: "Degree Courses", value: metrics.totalCourses ?? 0, icon: BookOpen, color: "text-violet-500 bg-violet-50 dark:bg-violet-500/10", link: "/admin/courses" },
    { label: "Campus Events", value: metrics.totalEvents ?? 0, icon: Sparkles, color: "text-purple-500 bg-purple-50 dark:bg-purple-500/10", link: "/admin/events" },
    { label: "Overall Attendance %", value: `${metrics.overallAttendancePct ?? 92.5}%`, icon: CheckCircle2, color: "text-teal-500 bg-teal-50 dark:bg-teal-500/10", link: "/admin/attendance" },
    { label: "Pending Fees Balance", value: `₹${metrics.totalPendingFees ?? 0}`, icon: CreditCard, color: "text-orange-500 bg-orange-50 dark:bg-orange-500/10", link: "/admin/fees" },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white shadow-xl border border-indigo-500/20">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Administrator Operations Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {user?.name || "Admin"}!
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              Centralized platform administration. Manage users, departments, degree curricula, attendance, and financials.
            </p>
          </div>

          <Link
            to="/admin/users"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all shrink-0 self-start sm:self-auto"
          >
            <span>Manage All Users</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Reusable Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link key={idx} to={card.link}>
              <Card className="hover:border-indigo-500/40 transition-all duration-200 group hover:-translate-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                    {card.label}
                  </span>
                  <div className={`p-2.5 rounded-xl ${card.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Two Column Layout: Recent Users & Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" />
                <span>Recently Registered Users</span>
              </h2>
              <Link to="/admin/users" className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                View All Users
              </Link>
            </div>

            {recentUsers.length === 0 ? (
              <p className="text-xs text-gray-500 dark:text-slate-400 py-4 text-center">No users found.</p>
            ) : (
              <div className="space-y-2.5">
                {recentUsers.map((u: any, idx: number) => (
                  <div key={u.id || u._id || idx} className="p-3 rounded-xl bg-gray-50 dark:bg-slate-950/60 border border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{u.name}</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">{u.email}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-semibold capitalize">
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* System Notifications */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                <span>System Notifications & Audit Log</span>
              </h2>
              <Link to="/admin/notifications" className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                View All
              </Link>
            </div>

            {notifications.length === 0 ? (
              <p className="text-xs text-gray-500 dark:text-slate-400 py-4 text-center">No system notifications.</p>
            ) : (
              <div className="space-y-3">
                {notifications.map((n: any, idx: number) => (
                  <div key={n.id || n._id || idx} className="p-3 rounded-xl bg-gray-50 dark:bg-slate-950/60 border border-gray-100 dark:border-slate-800">
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">{n.title}</h4>
                    <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">{n.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
