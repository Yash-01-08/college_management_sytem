"use client";

import React, { useState, useEffect } from "react";
import { User as UserIcon, Mail, Phone, BookOpen, FileText, Globe, Github, Linkedin, Award, CheckCircle2, Edit3 } from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { Sidebar } from "@/components/common/Sidebar";
import { GlobalSearch } from "@/components/common/GlobalSearch";
import { AIChatbot } from "@/components/common/AIChatbot";
import { getStoredUser, setStoredUser } from "@/lib/auth";
import { User } from "@/lib/types";

export default function ProfilePage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const u = getStoredUser();
    setUser(u);
    if (u) {
      setBio(u.bio || "");
      setSkills(u.skills?.join(", ") || "");
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const updated = {
      ...user,
      bio,
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
    };
    setStoredUser(updated);
    setUser(updated);
    setIsEditing(false);
    setSuccessMsg("Profile details updated successfully!");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar onOpenSearch={() => setSearchOpen(true)} onOpenAIChat={() => setAiChatOpen(true)} />
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <AIChatbot isOpen={aiChatOpen} onClose={() => setAiChatOpen(false)} />

      <div className="max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 flex gap-8">
        <Sidebar />

        <main className="flex-1 space-y-8">
          {/* Profile Banner */}
          <div className="glass-card p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 text-white font-extrabold text-2xl flex items-center justify-center border border-white/40 shadow-inner">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold">{user.name}</h1>
                  <p className="text-xs text-indigo-100 font-semibold">{user.department} • {user.role}</p>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-2 border border-white/30"
              >
                <Edit3 className="w-4 h-4" /> {isEditing ? "Cancel Edit" : "Edit Profile"}
              </button>
            </div>
          </div>

          {successMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="glass-card p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Skills (comma separated)</label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <button type="submit" className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold">
                Save Profile Changes
              </button>
            </form>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="glass-card p-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Academic Details</h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-slate-500">Email:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{user.email}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-slate-500">Roll Number:</span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-white">{user.rollNumber || "CS2024-042"}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-slate-500">Semester:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{user.semester || 6}</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-slate-500">Status:</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      Verified Email Student
                    </span>
                  </div>
                </div>
              </div>

              {/* Skills & Links */}
              <div className="glass-card p-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Technical Skills & Portfolio</h3>
                <div className="flex flex-wrap gap-2">
                  {user.skills?.map((sk, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800">
                      {sk}
                    </span>
                  ))}
                </div>

                <div className="pt-4 space-y-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2 text-indigo-600 font-semibold">
                    <Github className="w-4 h-4" /> <span>{user.gitHub || "https://github.com/aaravsharma"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600 font-semibold">
                    <Linkedin className="w-4 h-4" /> <span>{user.linkedIn || "https://linkedin.com/in/aarav-sharma"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
