"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/common/Navbar";
import { GlobalSearch } from "@/components/common/GlobalSearch";
import { AIChatbot } from "@/components/common/AIChatbot";
import { ServerTestDashboard } from "@/components/server/ServerTestDashboard";
import { GraduationCap } from "lucide-react";

export default function ServerTestPage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      <Navbar onOpenSearch={() => setSearchOpen(true)} onOpenAIChat={() => setAiChatOpen(true)} />
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <AIChatbot isOpen={aiChatOpen} onClose={() => setAiChatOpen(false)} />

      <main className="flex-1">
        <ServerTestDashboard />
      </main>

      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-6 bg-slate-900 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-white">CampusPulse AI</span>
            <span>• Backend & Frontend Connection Test Suite</span>
          </div>
          <div className="text-[11px] font-medium">
            Node.js Express & Next.js Backend Verification • React 18 UI
          </div>
        </div>
      </footer>
    </div>
  );
}
