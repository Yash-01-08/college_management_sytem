"use client";

import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Users, Ticket, Download, Plus, CheckCircle2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Navbar } from "@/components/common/Navbar";
import { Sidebar } from "@/components/common/Sidebar";
import { GlobalSearch } from "@/components/common/GlobalSearch";
import { AIChatbot } from "@/components/common/AIChatbot";
import { db } from "@/lib/db";
import { getStoredUser } from "@/lib/auth";
import { EventItem, EventRegistration, User } from "@/lib/types";

export default function EventsPage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [activeTicket, setActiveTicket] = useState<EventRegistration | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    setUser(getStoredUser());
    setEvents(db.getEvents());
    setRegistrations(db.getEventRegistrations(user?.id));
  }, [user?.id]);

  const isCoordinator = user?.role === "COORDINATOR" || user?.role === "ADMIN";

  const handleRegisterEvent = async (evt: EventItem) => {
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "REGISTER_EVENT",
        eventId: evt.id,
        eventTitle: evt.title,
        studentId: user?.id || "user-student-1",
        studentName: user?.name || "Aarav Sharma",
      }),
    });
    const data = await res.json();
    if (data.registration) {
      setRegistrations([data.registration, ...registrations]);
      setActiveTicket(data.registration);
      setSuccessMsg(`Registered for ${evt.title}! Your QR Ticket Pass is ready below.`);
    }
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
                <Calendar className="w-7 h-7 text-amber-500" /> Campus Events & Hackathons
              </h1>
              <p className="text-xs text-slate-500 font-medium">Register for events, claim seat slots, and download verified QR Passes</p>
            </div>
          </div>

          {successMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Ticket Pass Modal preview if active */}
          {activeTicket && (
            <div className="glass-card p-6 border-2 border-indigo-500 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/40 dark:to-purple-950/40 space-y-4 max-w-lg mx-auto text-center shadow-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600 text-white text-[11px] font-bold">
                <Ticket className="w-4 h-4" /> Official Verified Campus Entry Ticket Pass
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{activeTicket.eventTitle}</h3>
              <p className="text-xs text-slate-500">Issued to <strong>{activeTicket.studentName}</strong></p>

              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl w-fit mx-auto border border-slate-200 dark:border-slate-800 shadow-inner">
                <QRCodeSVG value={activeTicket.ticketQrCode} size={150} />
              </div>
              <span className="font-mono text-xs font-bold text-indigo-600 block">{activeTicket.ticketQrCode}</span>

              <button
                onClick={() => setActiveTicket(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Close Pass View
              </button>
            </div>
          )}

          {/* Events Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {events.map((evt) => {
              const isRegistered = registrations.some((r) => r.eventId === evt.id);

              return (
                <div key={evt.id} className="glass-card p-6 space-y-4 flex flex-col justify-between hover:border-amber-500 transition-colors">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                        {evt.category}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">{evt.date} • {evt.time}</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{evt.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{evt.description}</p>

                    <div className="space-y-1 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-rose-500" /> <span>{evt.venue}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-indigo-500" /> <span>{evt.registeredCount} / {evt.capacity} Registered</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                    {isRegistered ? (
                      <div className="w-full py-2.5 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 font-bold text-xs text-center flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Registered (QR Pass Issued)
                      </div>
                    ) : (
                      <button
                        onClick={() => handleRegisterEvent(evt)}
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-md flex items-center justify-center gap-2"
                      >
                        <Ticket className="w-4 h-4" /> Register & Claim Pass
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
