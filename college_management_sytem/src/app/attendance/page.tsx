"use client";

import React, { useState, useEffect } from "react";
import { QrCode, CheckCircle2, Download, Plus, Camera, ShieldCheck } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Navbar } from "@/components/common/Navbar";
import { Sidebar } from "@/components/common/Sidebar";
import { GlobalSearch } from "@/components/common/GlobalSearch";
import { AIChatbot } from "@/components/common/AIChatbot";
import { db } from "@/lib/db";
import { getStoredUser } from "@/lib/auth";
import { exportToCSV } from "@/lib/utils";
import { AttendanceSession, User } from "@/lib/types";

export default function AttendancePage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [qrToken, setQrToken] = useState("");
  const [activeSession, setActiveSession] = useState<AttendanceSession | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setUser(getStoredUser());
    const sessions = db.getAttendanceSessions();
    if (sessions.length > 0) setActiveSession(sessions[0]);
  }, []);

  const isFaculty = user?.role === "FACULTY" || user?.role === "ADMIN";

  const handleCreateSession = async () => {
    const res = await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "CREATE_SESSION",
        subject: "Advanced Database Management",
        subjectCode: "CS601",
        facultyId: user?.id || "faculty-1",
        facultyName: user?.name || "Dr. Kulkarni",
        department: "Computer Science",
      }),
    });
    const data = await res.json();
    if (data.session) {
      setActiveSession(data.session);
      setSuccessMsg("Attendance session & live QR token launched!");
    }
  };

  const handleMarkAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const tokenToUse = qrToken || activeSession?.qrCodeToken;
    const res = await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "MARK_ATTENDANCE",
        qrToken: tokenToUse,
        studentId: user?.id || "user-student-1",
        studentName: user?.name || "Aarav Sharma",
        rollNumber: user?.rollNumber || "CS2024-042",
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setErrorMsg(data.error || "Verification failed");
    } else {
      setSuccessMsg("Attendance marked successfully! (Status: PRESENT)");
    }
  };

  const records = db.getAttendanceRecords(user?.id);

  const handleExportCSV = () => {
    exportToCSV("attendance_records_export", records);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar onOpenSearch={() => setSearchOpen(true)} onOpenAIChat={() => setAiChatOpen(true)} />
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <AIChatbot isOpen={aiChatOpen} onClose={() => setAiChatOpen(false)} />

      <div className="max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 flex gap-8">
        <Sidebar />

        <main className="flex-1 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <QrCode className="w-7 h-7 text-indigo-600" /> Attendance Management Module
              </h1>
              <p className="text-xs text-slate-500 font-medium">Dynamic QR attendance verification & report logs</p>
            </div>

            <div className="flex gap-2">
              {isFaculty && (
                <button
                  onClick={handleCreateSession}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-md"
                >
                  <Plus className="w-4 h-4" /> Create QR Session
                </button>
              )}
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 rounded-xl glass-card font-bold text-xs flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
          </div>

          {successMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Faculty Active Session & QR Generator */}
            <div className="glass-card p-6 space-y-6 text-center">
              <div className="space-y-1">
                <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold">
                  {isFaculty ? "Faculty Live Session QR Generator" : "Current Class Session Code"}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {activeSession?.subject || "Advanced Database Management"} ({activeSession?.subjectCode || "CS601"})
                </h3>
              </div>

              {activeSession && (
                <div className="flex flex-col items-center justify-center space-y-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner w-fit mx-auto">
                  <QRCodeSVG value={activeSession.qrCodeToken} size={180} level="H" />
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-lg">
                    {activeSession.qrCodeToken}
                  </span>
                </div>
              )}
            </div>

            {/* Student Scanner & Token Scanner Form */}
            <div className="glass-card p-6 space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Camera className="w-5 h-5 text-indigo-500" /> Mark Student Attendance
                </h3>
                <p className="text-xs text-slate-500">Scan QR token code or click instant verify</p>
              </div>

              <form onSubmit={handleMarkAttendance} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Session Token / QR Code</label>
                  <input
                    type="text"
                    value={qrToken}
                    onChange={(e) => setQrToken(e.target.value)}
                    placeholder={activeSession?.qrCodeToken || "e.g. QR-CS601-8891"}
                    className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" /> Verify & Mark Present
                </button>
              </form>
            </div>
          </div>

          {/* Attendance Records Table */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Attendance Verification Logs</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold">
                    <th className="pb-3">Subject</th>
                    <th className="pb-3">Student Name</th>
                    <th className="pb-3">Roll Number</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {records.map((r) => (
                    <tr key={r.id}>
                      <td className="py-3 font-semibold text-slate-900 dark:text-white">{r.subject}</td>
                      <td className="py-3 text-slate-600 dark:text-slate-300">{r.studentName}</td>
                      <td className="py-3 font-mono text-slate-500">{r.rollNumber}</td>
                      <td className="py-3 text-slate-500">{r.date}</td>
                      <td className="py-3">
                        <span className="px-2 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
