import React from "react";
import { useAuth } from "../../context/AuthContext";
import { User, Mail, Phone, Hash, Building2, BookOpen, Calendar, ShieldCheck, CheckCircle2, XCircle } from "lucide-react";

export const Profile: React.FC = () => {
  const { user } = useAuth();

  const formattedDate = user?.dateOfBirth
    ? new Date(user.dateOfBirth).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Profile Header Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          {/* Avatar */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-500 p-1 shadow-xl shadow-indigo-500/20 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center overflow-hidden">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-indigo-400" />
              )}
            </div>
          </div>

          {/* User Basic Summary */}
          <div className="text-center sm:text-left space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {user?.name}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
                <ShieldCheck className="w-3.5 h-3.5" />
                {user?.role}
              </span>
            </div>

            <p className="text-slate-400 text-sm flex items-center justify-center sm:justify-start gap-2">
              <Mail className="w-4 h-4 text-slate-500" />
              <span>{user?.email}</span>
            </p>

            <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-2">
              <span className="px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 font-mono">
                Scholar #: <strong className="text-indigo-400">{user?.scholarNumber || "N/A"}</strong>
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
                Course: <strong className="text-cyan-400">{user?.course || "N/A"}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Profile Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Academic Details */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <span>Academic Information</span>
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400 flex items-center gap-2">
                <Hash className="w-4 h-4 text-slate-500" /> Scholar Number
              </span>
              <span className="text-white font-mono font-semibold">{user?.scholarNumber || "N/A"}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-500" /> Department
              </span>
              <span className="text-white font-semibold">{user?.department || "N/A"}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-slate-500" /> Course
              </span>
              <span className="text-white font-semibold">{user?.course || "N/A"}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" /> Current Semester
              </span>
              <span className="text-white font-semibold">Semester {user?.semester ?? "N/A"}</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-slate-400 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" /> Academic Batch
              </span>
              <span className="text-white font-semibold">{user?.batch || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Personal & Account Details */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-400" />
            <span>Personal & Account Details</span>
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400 flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-500" /> Phone Number
              </span>
              <span className="text-white font-mono font-semibold">{user?.phone || "N/A"}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400 flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500" /> Email Address
              </span>
              <span className="text-white font-semibold truncate max-w-[200px]">{user?.email || "N/A"}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" /> Date of Birth
              </span>
              <span className="text-white font-semibold">{formattedDate}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-500" /> Assigned Role
              </span>
              <span className="text-indigo-400 font-semibold uppercase text-xs px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                {user?.role}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-slate-400">Account Status</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
                {user?.isActive ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Active
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> Inactive
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
