"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  PlusCircle,
  Users,
  Megaphone,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { Sidebar } from "@/components/common/Sidebar";
import { GlobalSearch } from "@/components/common/GlobalSearch";
import { AIChatbot } from "@/components/common/AIChatbot";
import { db } from "@/lib/db";
import { getStoredUser } from "@/lib/auth";

export default function CoordinatorDashboard() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const user = getStoredUser();

  const events = db.getEvents();
  const eventRegs = db.getEventRegistrations();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar onOpenSearch={() => setSearchOpen(true)} onOpenAIChat={() => setAiChatOpen(true)} />
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <AIChatbot isOpen={aiChatOpen} onClose={() => setAiChatOpen(false)} />

      <div className="max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 flex gap-8">
        <Sidebar />

        <main className="flex-1 space-y-8">
          {/* Welcome Banner */}
          <div className="glass-card p-6 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10 space-y-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-[11px] font-semibold uppercase tracking-wider">
                Coordinator Portal • Events & Clubs
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold">Welcome, {user?.name || "Priya Nair"} 📋</h1>
              <p className="text-xs text-amber-100 font-medium max-w-xl">
                Manage campus hackathons, student club approvals, announcements, and ticket registrations.
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/events" className="glass-card p-4 space-y-2 hover:border-amber-500 transition-colors">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                <span>Total Active Events</span>
                <CalendarDays className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{events.length}</div>
              <div className="text-[10px] text-amber-600 font-bold">+ Create New Event</div>
            </Link>

            <div className="glass-card p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                <span>Registrations</span>
                <Users className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">164</div>
              <div className="text-[10px] text-indigo-600 font-semibold">82% Capacity Filled</div>
            </div>

            <div className="glass-card p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                <span>Club Approvals</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">12 Pending</div>
              <div className="text-[10px] text-emerald-600 font-semibold">Student Memberships</div>
            </div>

            <div className="glass-card p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                <span>Campus Announcements</span>
                <Megaphone className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">8 Active</div>
              <div className="text-[10px] text-purple-600 font-semibold">Broadcast Ready</div>
            </div>
          </div>

          {/* Event Hub List */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Managed Campus Events</h3>
              <Link href="/events" className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                Create Event Modal &rarr;
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {events.map((e) => (
                <div key={e.id} className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{e.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                      {e.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{e.description}</p>
                  <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                    📍 {e.venue} • {e.registeredCount}/{e.capacity} Seats Registered
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
