import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getStudentDashboard } from "../../services/studentService";
import { Loader } from "../../components/ui/Loader";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { Link } from "react-router-dom";
import {
  UserCheck,
  BookOpen,
  Calendar,
  Building2,
  Hash,
  ArrowUpRight,
  Sparkles,
  Award,
  Bell,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getStudentDashboard()
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        setError(err.message || "Failed to load dashboard data.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading student dashboard..." />;

  const metrics = data?.metrics || {};
  const timetable = data?.timetable || [];
  const results = data?.results || [];
  const events = data?.events || [];
  const notifications = data?.notifications || [];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-indigo-950/80 border border-indigo-500/20 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Student Academic Session 2024–2028</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name || "Student"}!
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Access your real-time academic stats, class schedule, attendance performance, and notices.
            </p>
          </div>

          <Link
            to="/student/profile"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all shrink-0 self-start sm:self-auto"
          >
            <span>View Profile</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Attendance % */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Attendance</span>
            <UserCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics.attendancePercentage ?? 100}%
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Overall Rate</span>
        </div>

        {/* Current Semester */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Semester</span>
            <Calendar className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            Sem {metrics.currentSemester || user?.semester || 1}
          </p>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">Academic Level</span>
        </div>

        {/* Pending Assignments */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Assignments</span>
            <FileText className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics.pendingAssignmentsCount ?? 0}
          </p>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Pending Review</span>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Events</span>
            <Sparkles className="w-4 h-4 text-cyan-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics.upcomingEventsCount ?? events.length}
          </p>
          <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium">Campus Events</span>
        </div>

        {/* Outstanding Fees */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Due Fees</span>
            <CreditCard className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            ₹{metrics.outstandingFees || 0}
          </p>
          <span className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">Outstanding Balance</span>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Notices</span>
            <Bell className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics.unreadNotificationsCount ?? 0}
          </p>
          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">Unread Alerts</span>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Classes & Recent Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's / Upcoming Classes */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" />
                <span>Class Timetable Schedule</span>
              </h2>
              <Link to="/student/timetable" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
                View Full Timetable
              </Link>
            </div>

            {timetable.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">No scheduled classes found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {timetable.map((slot: any, idx: number) => (
                  <div key={slot._id || slot.id || idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400">{slot.subject?.code || "SUB"}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-semibold">{slot.day}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{slot.subject?.name || "Subject Class"}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Room: {slot.room || "TBA"} | {slot.faculty?.name || "Faculty"}</p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800/60 text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{slot.startTime} - {slot.endTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Results */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-500" />
                <span>Recent Exam Performance & Grades</span>
              </h2>
              <Link to="/student/results" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
                View All Results
              </Link>
            </div>

            {results.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">No published results found.</p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {results.map((resItem: any, idx: number) => (
                  <div key={resItem._id || resItem.id || idx} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white block">{resItem.subject?.name || "Subject"}</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{resItem.subject?.code || ""} | Semester {resItem.semester}</span>
                    </div>
                    <div className="flex items-center gap-3 text-right">
                      <div>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 block">{resItem.totalMarks} Marks</span>
                        <span className="text-[10px] text-slate-400">Grade: {resItem.grade}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-md font-bold text-[10px] ${resItem.status === "Pass" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"}`}>
                        {resItem.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Actions, Events & Announcements */}
        <div className="space-y-6">
          {/* Quick Actions Shortcuts */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Quick Navigation Shortcuts</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link to="/student/attendance" className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-800 font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2 transition-all">
                <UserCheck className="w-4 h-4 text-emerald-500" />
                <span>Attendance</span>
              </Link>
              <Link to="/student/timetable" className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-800 font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2 transition-all">
                <Clock className="w-4 h-4 text-indigo-500" />
                <span>Timetable</span>
              </Link>
              <Link to="/student/results" className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-800 font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2 transition-all">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Results</span>
              </Link>
              <Link to="/student/fees" className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-800 font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2 transition-all">
                <CreditCard className="w-4 h-4 text-rose-500" />
                <span>Fees</span>
              </Link>
              <Link to="/student/events" className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-800 font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2 transition-all">
                <Sparkles className="w-4 h-4 text-cyan-500" />
                <span>Events</span>
              </Link>
              <Link to="/student/notifications" className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-800 font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2 transition-all">
                <Bell className="w-4 h-4 text-purple-500" />
                <span>Notices</span>
              </Link>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-500" />
                <span>Upcoming Campus Events</span>
              </h3>
              <Link to="/student/events" className="text-[11px] text-indigo-500 hover:underline">View All</Link>
            </div>
            {events.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-3">No upcoming events scheduled.</p>
            ) : (
              <div className="space-y-2.5">
                {events.map((evt: any, idx: number) => (
                  <div key={evt._id || evt.id || idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 text-xs">
                    <span className="font-bold text-slate-900 dark:text-white block">{evt.title}</span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{evt.description}</p>
                    <div className="mt-2 text-[10px] text-indigo-600 dark:text-indigo-400 font-medium flex items-center justify-between">
                      <span>Venue: {evt.venue || "Campus"}</span>
                      <span>{evt.startDate ? new Date(evt.startDate).toLocaleDateString() : ""}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Unread Notifications */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-purple-500" />
                <span>Recent Notices & Alerts</span>
              </h3>
              <Link to="/student/notifications" className="text-[11px] text-indigo-500 hover:underline">View All</Link>
            </div>
            {notifications.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-3">No recent notifications.</p>
            ) : (
              <div className="space-y-2">
                {notifications.map((n: any, idx: number) => (
                  <div key={n._id || n.id || idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/60 text-xs">
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

export default StudentDashboard;
