"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Calendar, FileText, Briefcase, User as UserIcon } from "lucide-react";
import { db } from "@/lib/db";
import Link from "next/link";

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open via parent state
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const users = db.getUsers().filter((u) => u.name.toLowerCase().includes(query.toLowerCase()));
  const events = db.getEvents().filter((e) => e.title.toLowerCase().includes(query.toLowerCase()));
  const assignments = db.getAssignments().filter((a) => a.title.toLowerCase().includes(query.toLowerCase()));
  const placements = db.getPlacements().filter((p) => p.companyName.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-start justify-center pt-20 p-4 animate-in fade-in">
      <div className="w-full max-w-2xl glass-card p-4 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800">
        {/* Input Bar */}
        <div className="flex items-center gap-3 px-3 py-2 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
          <Search className="w-5 h-5 text-indigo-500 shrink-0" />
          <input
            type="text"
            placeholder="Search students, faculty, assignments, events, placements..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none font-medium"
            autoFocus
          />
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto space-y-4 pr-1">
          {query.trim() === "" ? (
            <div className="text-center py-8 text-slate-400 text-xs font-medium">
              Type anything to perform a global search across CampusPulse...
            </div>
          ) : (
            <>
              {/* Users */}
              {users.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5 text-indigo-500" /> Users ({users.length})
                  </div>
                  <div className="space-y-1">
                    {users.map((u) => (
                      <Link
                        key={u.id}
                        href="/profile"
                        onClick={onClose}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-xs"
                      >
                        <span className="font-semibold text-slate-900 dark:text-white">{u.name} ({u.role})</span>
                        <span className="text-slate-400 text-[11px]">{u.department}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Events */}
              {events.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-purple-500" /> Events ({events.length})
                  </div>
                  <div className="space-y-1">
                    {events.map((e) => (
                      <Link
                        key={e.id}
                        href="/events"
                        onClick={onClose}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-xs"
                      >
                        <span className="font-semibold text-slate-900 dark:text-white">{e.title}</span>
                        <span className="text-slate-400 text-[11px]">{e.date}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Assignments */}
              {assignments.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-500" /> Assignments ({assignments.length})
                  </div>
                  <div className="space-y-1">
                    {assignments.map((a) => (
                      <Link
                        key={a.id}
                        href="/assignments"
                        onClick={onClose}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-xs"
                      >
                        <span className="font-semibold text-slate-900 dark:text-white">{a.title}</span>
                        <span className="text-slate-400 text-[11px]">{a.subjectCode}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Placements */}
              {placements.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-amber-500" /> Placements ({placements.length})
                  </div>
                  <div className="space-y-1">
                    {placements.map((p) => (
                      <Link
                        key={p.id}
                        href="/placements"
                        onClick={onClose}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-xs"
                      >
                        <span className="font-semibold text-slate-900 dark:text-white">{p.companyName} - {p.jobRole}</span>
                        <span className="text-emerald-600 font-bold text-[11px]">{p.ctc}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
