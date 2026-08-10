"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  QrCode,
  FileCheck,
  Calendar,
  Briefcase,
  Clock,
  ArrowUpRight,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Bell,
  BookOpen,
} from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { Sidebar } from "@/components/common/Sidebar";
import { GlobalSearch } from "@/components/common/GlobalSearch";
import { AIChatbot } from "@/components/common/AIChatbot";
import { db } from "@/lib/db";
import { getStoredUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";

export default function StudentDashboard() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const user = getStoredUser();

  const studentId = user?.id || "user-student-1";
  const records = db.getAttendanceRecords(studentId);
  const assignments = db.getAssignments();
  const submissions = db.getSubmissions(undefined, studentId);
  const events = db.getEvents();
  const eventRegs = db.getEventRegistrations(studentId);
  const placements = db.getPlacements();

  const presentCount = records.filter((r) => r.status === "PRESENT").length;
  const attendanceRate = records.length > 0 ? Math.round((presentCount / records.length) * 100) : 92;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar onOpenSearch={() => setSearchOpen(true)} onOpenAIChat={() => setAiChatOpen(true)} />
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <AIChatbot isOpen={aiChatOpen} onClose={() => setAiChatOpen(false)} />

      <div className="max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 flex gap-8">
        <Sidebar />

        <main className="flex-1 space-y-8">
          {/* Welcome Banner */}
          <div className="glass-card p-6 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10 space-y-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-[11px] font-semibold tracking-wide uppercase">
                Student Portal • Semester {user?.semester || 6}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold">Welcome back, {user?.name || "Aarav"}! 👋</h1>
              <p className="text-xs text-indigo-100 font-medium max-w-xl">
                You have 2 pending assignments due this week and 1 upcoming placement interview round with Google Cloud.
              </p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                <span>Overall Attendance</span>
                <QrCode className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">{attendanceRate}%</div>
              <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Safe Zone (&gt;75% required)
              </div>
            </div>

            <div className="glass-card p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                <span>Pending Submissions</span>
                <FileCheck className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {assignments.length - submissions.length}
              </div>
              <div className="text-[10px] text-purple-600 font-semibold">Next due in 8 days</div>
            </div>

            <div className="glass-card p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                <span>Registered Events</span>
                <Calendar className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{eventRegs.length}</div>
              <div className="text-[10px] text-amber-600 font-semibold">QR Ticket Pass Ready</div>
            </div>

            <div className="glass-card p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                <span>Placement Notices</span>
                <Briefcase className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{placements.length}</div>
              <div className="text-[10px] text-emerald-600 font-semibold">Avg CTC ₹27 LPA</div>
            </div>
          </div>

          {/* Main Grid Section */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Upcoming Classes & Schedule */}
            <div className="glass-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-500" /> Today&apos;s Class Timeline
                </h3>
                <Link href="/attendance" className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                  Mark Attendance &rarr;
                </Link>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Advanced Database Management</div>
                    <div className="text-[11px] text-slate-500">10:00 AM - 11:30 AM • Lab 4</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-extrabold">
                    Present (QR Verified)
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Cloud Architecture & DevOps</div>
                    <div className="text-[11px] text-slate-500">02:00 PM - 03:30 PM • Seminar Hall</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-[10px] font-extrabold">
                    Upcoming Session
                  </span>
                </div>
              </div>
            </div>

            {/* Assignments Action Queue */}
            <div className="glass-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-purple-500" /> Active Assignments
                </h3>
                <Link href="/assignments" className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                  View All &rarr;
                </Link>
              </div>

              <div className="space-y-3">
                {assignments.map((a) => (
                  <div key={a.id} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{a.title}</span>
                      <span className="text-[10px] font-semibold text-rose-500">Due {formatDate(a.deadline)}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{a.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
