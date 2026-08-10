"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  QrCode,
  FileCheck,
  Users,
  PlusCircle,
  Award,
  Clock,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { Sidebar } from "@/components/common/Sidebar";
import { GlobalSearch } from "@/components/common/GlobalSearch";
import { AIChatbot } from "@/components/common/AIChatbot";
import { db } from "@/lib/db";
import { getStoredUser } from "@/lib/auth";

export default function FacultyDashboard() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const user = getStoredUser();

  const sessions = db.getAttendanceSessions();
  const assignments = db.getAssignments();
  const submissions = db.getSubmissions();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar onOpenSearch={() => setSearchOpen(true)} onOpenAIChat={() => setAiChatOpen(true)} />
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <AIChatbot isOpen={aiChatOpen} onClose={() => setAiChatOpen(false)} />

      <div className="max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 flex gap-8">
        <Sidebar />

        <main className="flex-1 space-y-8">
          {/* Welcome Banner */}
          <div className="glass-card p-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10 space-y-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-[11px] font-semibold uppercase tracking-wider">
                Faculty Portal • Computer Science Dept
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold">Welcome, {user?.name || "Dr. Kulkarni"} 👨‍🏫</h1>
              <p className="text-xs text-purple-100 font-medium max-w-xl">
                Manage your lectures, launch dynamic QR attendance sessions, create assignments, and grade student submissions.
              </p>
            </div>
          </div>

          {/* Quick Actions & Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/attendance" className="glass-card p-4 space-y-2 hover:border-indigo-500 transition-colors">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                <span>Active QR Sessions</span>
                <QrCode className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">{sessions.length}</div>
              <div className="text-[10px] text-indigo-600 font-bold">+ Launch New Session</div>
            </Link>

            <Link href="/assignments" className="glass-card p-4 space-y-2 hover:border-purple-500 transition-colors">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                <span>Created Assignments</span>
                <FileCheck className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">{assignments.length}</div>
              <div className="text-[10px] text-purple-600 font-bold">+ Upload Assignment</div>
            </Link>

            <div className="glass-card p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                <span>Pending Grading</span>
                <Award className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {submissions.filter((s) => s.status === "SUBMITTED").length}
              </div>
              <div className="text-[10px] text-amber-600 font-semibold">Review Rubrics Queue</div>
            </div>

            <div className="glass-card p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                <span>Enrolled Students</span>
                <Users className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">124</div>
              <div className="text-[10px] text-emerald-600 font-semibold">Avg Class Attendance 94%</div>
            </div>
          </div>

          {/* Submissions Review Matrix */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-indigo-500" /> Recent Student Submissions
              </h3>
              <Link href="/assignments" className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                Grade Queue &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {submissions.map((sub) => (
                <div key={sub.id} className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{sub.assignmentTitle}</div>
                    <div className="text-[11px] text-slate-500">
                      Submitted by <strong>{sub.studentName}</strong> ({sub.rollNumber})
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold text-purple-600 bg-purple-50 dark:bg-purple-950 px-2 py-1 rounded">
                      Plagiarism: {sub.plagiarismScore}%
                    </span>
                    <Link
                      href="/assignments"
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs"
                    >
                      Review & Grade
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
