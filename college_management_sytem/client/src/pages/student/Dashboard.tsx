import React from "react";
import { useAuth } from "../../context/AuthContext";
import { UserCheck, BookOpen, Calendar, Building2, Hash, ArrowUpRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

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
              Welcome, {user?.name || "Student"}!
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              You are currently logged into the official Student Portal. Access your profile, academic stats, and department notices.
            </p>
          </div>

          <Link
            to="/student/profile"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all shrink-0 self-start sm:self-auto"
          >
            <span>View Full Profile</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Scholar Number */}
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-lg group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Scholar Number
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
              <Hash className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xl font-mono font-bold text-white tracking-wider">
            {user?.scholarNumber || "N/A"}
          </p>
          <span className="text-[11px] text-indigo-400 mt-2 block font-medium">
            Unique Identity Code
          </span>
        </div>

        {/* Department */}
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-lg group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Department
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-lg font-bold text-white truncate">
            {user?.department || "N/A"}
          </p>
          <span className="text-[11px] text-cyan-400 mt-2 block font-medium">
            Enrolled Department
          </span>
        </div>

        {/* Course */}
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-lg group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Course
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <p className="text-lg font-bold text-white truncate">
            {user?.course || "N/A"}
          </p>
          <span className="text-[11px] text-emerald-400 mt-2 block font-medium">
            Degree Program
          </span>
        </div>

        {/* Semester */}
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-lg group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Semester
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xl font-bold text-white">
            Semester {user?.semester ?? "N/A"}
          </p>
          <span className="text-[11px] text-amber-400 mt-2 block font-medium">
            Current Academic Level
          </span>
        </div>
      </div>

      {/* Quick Summary Section */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-indigo-400" />
          <span>Student Account Overview</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <span className="text-xs text-slate-400 block mb-1">Registered Phone</span>
            <span className="text-white font-mono font-medium">{user?.phone || "N/A"}</span>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <span className="text-xs text-slate-400 block mb-1">Registered Email</span>
            <span className="text-white font-medium truncate block">{user?.email || "N/A"}</span>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <span className="text-xs text-slate-400 block mb-1">Batch / Academic Period</span>
            <span className="text-white font-medium">{user?.batch || "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
