import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getFacultyDashboard } from "../../services/facultyService";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Loader } from "../../components/ui/Loader";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import {
  BookOpen,
  Users,
  ClipboardList,
  Calendar,
  ArrowUpRight,
  Award,
  Bell,
  Sparkles,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";

export const FacultyDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getFacultyDashboard()
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        setError(err.message || "Failed to load faculty dashboard.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading faculty console..." />;

  const metrics = data?.metrics || {};
  const assignments = data?.assignments || [];
  const timetable = data?.timetable || [];
  const events = data?.events || [];
  const notifications = data?.notifications || [];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/80 via-slate-900 to-indigo-950 border border-indigo-500/20 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Faculty Academic & Evaluation Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name || "Professor"}!
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Manage your assigned subjects, track student attendance rosters, grade results, and post course updates.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              to="/faculty/attendance"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all shrink-0"
            >
              <span>Mark Attendance</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 block">Assigned Subjects</span>
            <span className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1 block">
              {metrics.assignedSubjectsCount ?? assignments.length}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <BookOpen className="w-6 h-6" />
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 block">Total Students</span>
            <span className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1 block">
              {metrics.totalStudentsCount ?? 0}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
            <Users className="w-6 h-6" />
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 block">Today&apos;s Classes</span>
            <span className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1 block">
              {metrics.todaysClassesCount ?? timetable.length}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Calendar className="w-6 h-6" />
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 block">Attendance Marked</span>
            <span className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1 block">
              {metrics.attendanceCount ?? 0}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <ClipboardList className="w-6 h-6" />
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 block">Department</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white mt-1 block truncate max-w-[110px]">
              {user?.department || "CSE"}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </Card>
      </div>

      {/* Main Grid: Subjects & Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="My Authorized Assigned Subjects">
          <div className="space-y-3">
            {assignments.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-3">No active subject assignments found.</p>
            ) : (
              assignments.map((asItem: any, idx: number) => {
                const sub = asItem.subject || asItem;
                return (
                  <div key={asItem._id || asItem.id || idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-950/60 border border-gray-100 dark:border-slate-800">
                    <div>
                      <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 mr-2">{sub.code || "SUB"}</span>
                      <span className="text-xs font-bold text-gray-900 dark:text-white">{sub.name || "Subject"}</span>
                      <span className="text-[11px] text-slate-400 block">Course: {asItem.course?.name || "B.Tech"} &bull; Sem {sub.semester || 1}</span>
                    </div>
                    <Badge variant="primary">{sub.type || "Theory"}</Badge>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        <Card title="Teaching Schedule & Class Sessions">
          <div className="space-y-3">
            {timetable.length === 0 ? (
              <p className="text-xs text-gray-400 py-3">No teaching sessions scheduled.</p>
            ) : (
              timetable.map((t: any, idx: number) => (
                <div key={t._id || t.id || idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-950/60 border border-gray-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="font-bold text-gray-900 dark:text-white block">{t.subject?.name || t.subjectName || t.subjectCode}</span>
                    <span className="text-gray-500 dark:text-slate-400">{t.day} &bull; {t.startTime} - {t.endTime}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-gray-200 dark:bg-slate-800 font-mono font-bold text-gray-800 dark:text-slate-200">
                    Room {t.room || "101"}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Quick Action Link Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Faculty Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold">
          <Link to="/faculty/attendance" className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-between transition-all">
            <span>Mark Attendance</span>
            <ClipboardList className="w-4 h-4 text-emerald-500" />
          </Link>
          <Link to="/faculty/results" className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-between transition-all">
            <span>Enter Results</span>
            <Award className="w-4 h-4 text-indigo-500" />
          </Link>
          <Link to="/faculty/students" className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-between transition-all">
            <span>Student Roster</span>
            <Users className="w-4 h-4 text-cyan-500" />
          </Link>
          <Link to="/faculty/timetable" className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-between transition-all">
            <span>My Timetable</span>
            <Calendar className="w-4 h-4 text-amber-500" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
