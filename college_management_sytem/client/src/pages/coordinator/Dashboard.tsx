import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getCoordinatorDashboard } from "../../services/coordinatorService";
import { Card } from "../../components/ui/Card";
import { Loader } from "../../components/ui/Loader";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import {
  Building2,
  GraduationCap,
  BookOpen,
  Users,
  UserCog,
  ArrowUpRight,
  Sparkles,
  UserCheck,
  Bell,
  Calendar,
  Plus,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";

export const CoordinatorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCoordinatorDashboard()
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        setError(err.message || "Failed to load coordinator dashboard.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading coordinator console..." />;

  const metrics = data?.metrics || {};
  const departments = data?.departments || [];
  const courses = data?.courses || [];
  const events = data?.events || [];
  const notifications = data?.notifications || [];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/80 via-slate-900 to-indigo-950 border border-purple-500/20 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Academic Coordinator Operations Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name || "Coordinator"}!
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Oversee college departments, degree programs, subjects, class timetables, and teaching assignments.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              to="/coordinator/events"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold shadow-lg shadow-purple-600/30 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </Link>
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <Card className="flex items-center justify-between p-3.5">
          <div>
            <span className="text-[10px] font-semibold uppercase text-gray-500 dark:text-slate-400 block">Students</span>
            <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 block">{metrics.totalStudents ?? 0}</span>
          </div>
          <Users className="w-5 h-5 text-emerald-500" />
        </Card>

        <Card className="flex items-center justify-between p-3.5">
          <div>
            <span className="text-[10px] font-semibold uppercase text-gray-500 dark:text-slate-400 block">Faculty</span>
            <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-0.5 block">{metrics.totalFaculty ?? 0}</span>
          </div>
          <UserCog className="w-5 h-5 text-amber-500" />
        </Card>

        <Card className="flex items-center justify-between p-3.5">
          <div>
            <span className="text-[10px] font-semibold uppercase text-gray-500 dark:text-slate-400 block">Departments</span>
            <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5 block">{metrics.totalDepartments ?? 0}</span>
          </div>
          <Building2 className="w-5 h-5 text-indigo-500" />
        </Card>

        <Card className="flex items-center justify-between p-3.5">
          <div>
            <span className="text-[10px] font-semibold uppercase text-gray-500 dark:text-slate-400 block">Courses</span>
            <span className="text-xl font-extrabold text-purple-600 dark:text-purple-400 mt-0.5 block">{metrics.totalCourses ?? 0}</span>
          </div>
          <GraduationCap className="w-5 h-5 text-purple-500" />
        </Card>

        <Card className="flex items-center justify-between p-3.5">
          <div>
            <span className="text-[10px] font-semibold uppercase text-gray-500 dark:text-slate-400 block">Subjects</span>
            <span className="text-xl font-extrabold text-cyan-600 dark:text-cyan-400 mt-0.5 block">{metrics.totalSubjects ?? 0}</span>
          </div>
          <BookOpen className="w-5 h-5 text-cyan-500" />
        </Card>

        <Card className="flex items-center justify-between p-3.5">
          <div>
            <span className="text-[10px] font-semibold uppercase text-gray-500 dark:text-slate-400 block">Events</span>
            <span className="text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-0.5 block">{metrics.totalEvents ?? 0}</span>
          </div>
          <Sparkles className="w-5 h-5 text-rose-500" />
        </Card>

        <Card className="flex items-center justify-between p-3.5">
          <div>
            <span className="text-[10px] font-semibold uppercase text-gray-500 dark:text-slate-400 block">Attendance</span>
            <span className="text-xl font-extrabold text-teal-600 dark:text-teal-400 mt-0.5 block">{metrics.overallAttendancePct ?? 90}%</span>
          </div>
          <UserCheck className="w-5 h-5 text-teal-500" />
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Departments Preview */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-500" />
                <span>Managed College Departments</span>
              </h2>
              <Link to="/coordinator/departments" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
                Manage All
              </Link>
            </div>
            {departments.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-3">No departments created yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {departments.map((d: any, idx: number) => (
                  <div key={d._id || d.id || idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">{d.code}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">{d.status || "Active"}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{d.name}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">HOD: {d.hod?.name || d.hod || "Unassigned"}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Courses Preview */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-500" />
                <span>Academic Degree Programs</span>
              </h2>
              <Link to="/coordinator/courses" className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-semibold">
                Manage Courses
              </Link>
            </div>
            {courses.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-3">No active courses found.</p>
            ) : (
              <div className="space-y-2">
                {courses.map((c: any, idx: number) => (
                  <div key={c._id || c.id || idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white mr-2">{c.name}</span>
                      <span className="text-slate-500 dark:text-slate-400 font-mono">({c.code})</span>
                    </div>
                    <span className="text-slate-500 dark:text-slate-400">{c.totalSemesters || 8} Semesters</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Action Shortcuts & Notices */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Coordinator Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold">
              <Link to="/coordinator/departments" className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-purple-50 dark:hover:bg-purple-950/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 flex items-center gap-2 transition-all">
                <Building2 className="w-4 h-4 text-indigo-500" />
                <span>Departments</span>
              </Link>
              <Link to="/coordinator/courses" className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-purple-50 dark:hover:bg-purple-950/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 flex items-center gap-2 transition-all">
                <GraduationCap className="w-4 h-4 text-purple-500" />
                <span>Courses</span>
              </Link>
              <Link to="/coordinator/subjects" className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-purple-50 dark:hover:bg-purple-950/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 flex items-center gap-2 transition-all">
                <BookOpen className="w-4 h-4 text-cyan-500" />
                <span>Subjects</span>
              </Link>
              <Link to="/coordinator/assignments" className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-purple-50 dark:hover:bg-purple-950/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 flex items-center gap-2 transition-all">
                <UserCog className="w-4 h-4 text-amber-500" />
                <span>Faculty Assign</span>
              </Link>
              <Link to="/coordinator/enrollments" className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-purple-50 dark:hover:bg-purple-950/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 flex items-center gap-2 transition-all">
                <Users className="w-4 h-4 text-emerald-500" />
                <span>Enrollments</span>
              </Link>
              <Link to="/coordinator/notifications" className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-purple-50 dark:hover:bg-purple-950/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 flex items-center gap-2 transition-all">
                <Bell className="w-4 h-4 text-rose-500" />
                <span>Announce</span>
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Bell className="w-4 h-4 text-purple-500" />
              <span>Coordinator Notifications</span>
            </h3>
            {notifications.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-3">No notifications found.</p>
            ) : (
              <div className="space-y-2">
                {notifications.map((n: any, idx: number) => (
                  <div key={n._id || n.id || idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                    <span className="font-bold text-slate-900 dark:text-white block">{n.title}</span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;
