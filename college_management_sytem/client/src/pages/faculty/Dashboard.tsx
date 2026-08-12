import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getFacultyProfile, getFacultySubjects, getFacultyTimetable } from "../../services/facultyService";
import { Subject, TimetableSlot } from "../../types";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Loader } from "../../components/ui/Loader";
import { BookOpen, Users, ClipboardList, Calendar, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export const FacultyDashboard: React.FC = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getFacultySubjects(), getFacultyTimetable()])
      .then(([subRes, ttRes]) => {
        if (subRes.data) setSubjects(subRes.data);
        if (ttRes.data) setTimetable(ttRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading faculty portal..." />;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/80 via-slate-900 to-indigo-950 border border-indigo-500/20 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
              <span>Faculty Academic Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name || "Professor"}!
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Manage your assigned subjects, student attendance rosters, and internal exam results.
            </p>
          </div>

          <Link
            to="/faculty/attendance"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all shrink-0"
          >
            <span>Mark Attendance</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 block">Assigned Subjects</span>
            <span className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1 block">{subjects.length}</span>
          </div>
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <BookOpen className="w-6 h-6" />
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 block">Scheduled Classes</span>
            <span className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1 block">{timetable.length}</span>
          </div>
          <div className="p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
            <Calendar className="w-6 h-6" />
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 block">Pending Attendance</span>
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">0</span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <ClipboardList className="w-6 h-6" />
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 block">Department</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white mt-1 block truncate max-w-[120px]">{user?.department || "CSE"}</span>
          </div>
          <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <Users className="w-6 h-6" />
          </div>
        </Card>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="My Assigned Subjects">
          <div className="space-y-3">
            {subjects.map((s) => (
              <div key={s.id || s._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-950/60 border border-gray-100 dark:border-slate-800">
                <div>
                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 mr-2">{s.code}</span>
                  <span className="text-xs font-bold text-gray-900 dark:text-white">{s.name}</span>
                </div>
                <Badge variant="primary">{s.type}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Today's Teaching Schedule">
          <div className="space-y-3">
            {timetable.length === 0 ? (
              <p className="text-xs text-gray-400">No teaching sessions scheduled for today.</p>
            ) : (
              timetable.map((t) => (
                <div key={t.id || t._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-950/60 border border-gray-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="font-bold text-gray-900 dark:text-white block">{t.subjectName || t.subjectCode}</span>
                    <span className="text-gray-500 dark:text-slate-400">{t.day} &bull; {t.startTime} - {t.endTime}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-gray-200 dark:bg-slate-800 font-mono font-bold text-gray-800 dark:text-slate-200">
                    Room {t.room}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FacultyDashboard;
