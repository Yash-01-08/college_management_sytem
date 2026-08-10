"use client";

import React, { useState, useEffect } from "react";
import { Briefcase, Building, MapPin, Award, CheckCircle2, Send, ExternalLink } from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { Sidebar } from "@/components/common/Sidebar";
import { GlobalSearch } from "@/components/common/GlobalSearch";
import { AIChatbot } from "@/components/common/AIChatbot";
import { db } from "@/lib/db";
import { getStoredUser } from "@/lib/auth";
import { PlacementNotice, PlacementApplication, User } from "@/lib/types";

export default function PlacementsPage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [placements, setPlacements] = useState<PlacementNotice[]>([]);
  const [applications, setApplications] = useState<PlacementApplication[]>([]);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    setUser(getStoredUser());
    setPlacements(db.getPlacements());
    setApplications(db.getPlacementApps(user?.id));
  }, [user?.id]);

  const handleApply = async (p: PlacementNotice) => {
    const res = await fetch("/api/placements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "APPLY",
        placementId: p.id,
        companyName: p.companyName,
        jobRole: p.jobRole,
        studentId: user?.id || "user-student-1",
        studentName: user?.name || "Aarav Sharma",
        studentEmail: user?.email || "aarav.sharma@campus.edu",
        resumeUrl: user?.resumeUrl || "https://example.com/resumes/aarav-sharma.pdf",
      }),
    });
    const data = await res.json();
    if (data.application) {
      setApplications([data.application, ...applications]);
      setSuccessMsg(`Application for ${p.companyName} (${p.jobRole}) submitted successfully!`);
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
                <Briefcase className="w-7 h-7 text-emerald-600" /> Campus Placement Portal
              </h1>
              <p className="text-xs text-slate-500 font-medium">Explore company opportunities, CTC packages, and track interview pipelines</p>
            </div>
          </div>

          {successMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Placements Cards */}
          <div className="grid lg:grid-cols-2 gap-6">
            {placements.map((p) => {
              const hasApplied = applications.some((a) => a.placementId === p.id);

              return (
                <div key={p.id} className="glass-card p-6 space-y-4 flex flex-col justify-between hover:border-emerald-500 transition-colors">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-indigo-600">
                          {p.companyName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 dark:text-white">{p.companyName}</h3>
                          <p className="text-[11px] text-slate-500">{p.jobRole}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold text-xs">
                        {p.ctc}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{p.description}</p>

                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs space-y-1">
                      <div className="font-bold text-slate-700 dark:text-slate-300">Eligibility Criteria:</div>
                      <div className="text-slate-500">{p.eligibility}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                    {hasApplied ? (
                      <div className="w-full py-2.5 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 font-bold text-xs text-center flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Applied (Status: SHORTLISTED)
                      </div>
                    ) : (
                      <button
                        onClick={() => handleApply(p)}
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-md flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" /> 1-Click Apply with Profile Resume
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Application Pipeline Status Tracker */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Your Placement Applications Pipeline</h3>
            <div className="space-y-3">
              {applications.map((app) => (
                <div key={app.id} className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{app.companyName} - {app.jobRole}</div>
                    <div className="text-[11px] text-slate-500">Applied on {app.appliedAt.slice(0, 10)}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    {["APPLIED", "SHORTLISTED", "INTERVIEW", "OFFERED"].map((step, i) => (
                      <span
                        key={step}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          app.status === step
                            ? "bg-indigo-600 text-white shadow-xs"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                        }`}
                      >
                        {step}
                      </span>
                    ))}
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
