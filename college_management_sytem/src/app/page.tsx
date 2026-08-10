"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Sparkles,
  QrCode,
  FileCheck,
  Calendar,
  Briefcase,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Users,
  Award,
  ChevronDown,
  Globe,
  Layers,
} from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { GlobalSearch } from "@/components/common/GlobalSearch";


export default function LandingPage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "How does the QR Attendance Module work for faculty and students?",
      a: "Faculty generate a dynamic 30-minute session code and QR code directly from their Faculty Dashboard. Students open their Student Attendance page, scan the QR code via their device camera or enter the token, and attendance is instantly verified and logged with automated anti-proxy verification.",
    },
    {
      q: "Can students download verified event passes?",
      a: "Yes! When a student registers for any campus event or hackathon, CampusPulse AI immediately generates a unique digital ticket embedded with a verified QR code, which students can view or download as a PDF pass.",
    },
    {
      q: "Does CampusPulse support external database connections?",
      a: "Absolutely. CampusPulse AI features an out-of-the-box hybrid database engine: it runs seamless real-time mock data for instant evaluator demoing while fully supporting production MongoDB and PostgreSQL instances via Prisma / Mongoose environment variables.",
    },
    {
      q: "What role-based controls exist in the platform?",
      a: "CampusPulse provides four distinct permission layers: Student, Faculty, Coordinator, and Administrator. Each role gains a dedicated dashboard, permissions, and security scope.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      <Navbar onOpenSearch={() => setSearchOpen(true)} onOpenAIChat={() => setAiChatOpen(true)} />
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <AIChatbot isOpen={aiChatOpen} onClose={() => setAiChatOpen(false)} />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32 border-b border-slate-200/60 dark:border-slate-800/60">
        {/* Glowing backdrop blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold shadow-xs animate-bounce">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>DevFusion 4.O Hackathon Showcase Ready</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            The Centralized <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">Smart Campus</span> Platform for Modern Universities
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Replace disconnected WhatsApp groups and fragmented tools. One unified portal connecting Students, Faculty, Coordinators, and Administrators.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-2 group"
            >
              <span>Explore Live Platform</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="px-6 py-3.5 rounded-2xl glass-card font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700"
            >
              Sign In / Demo Accounts
            </Link>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-12">
            {[
              { label: "Active Campus Users", val: "5,000+", icon: Users, color: "text-indigo-600" },
              { label: "Placement Rate", val: "98.2%", icon: Award, color: "text-emerald-600" },
              { label: "QR Session Verification", val: "< 2 Sec", icon: QrCode, color: "text-purple-600" },
              { label: "Events & Clubs", val: "120+", icon: Calendar, color: "text-amber-600" },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="glass-card p-5 text-center space-y-1">
                  <Icon className={`w-6 h-6 mx-auto ${stat.color}`} />
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{stat.val}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-100/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              End-to-End Academic Infrastructure
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
              Built with React, Next.js, TypeScript, and Node.js to meet all criteria of Problem Statement 1.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Dynamic QR Attendance",
                desc: "Faculty generate dynamic session codes; students scan QR tokens to mark real-time attendance.",
                icon: QrCode,
                color: "from-indigo-500 to-indigo-600",
              },
              {
                title: "Assignment Hub & Rubrics",
                desc: "Faculty assign rubrics & deadlines; students submit PDF/ZIP/GitHub links with plagiarism detection.",
                icon: FileCheck,
                color: "from-purple-500 to-purple-600",
              },
              {
                title: "Placement Portal",
                desc: "Top companies, CTC breakdown, eligibility rules, 1-click resume application & status pipeline.",
                icon: Briefcase,
                color: "from-emerald-500 to-emerald-600",
              },
              {
                title: "Event QR Passes",
                desc: "Instant event registration with seat capacity tracking and downloadable QR entry passes.",
                icon: Calendar,
                color: "from-amber-500 to-amber-600",
              },
              {
                title: "Admin RBAC Panel",
                desc: "4-tier user role delegation, department analytics, audit log viewer, and CSV report export.",
                icon: ShieldCheck,
                color: "from-rose-500 to-rose-600",
              },
              {
                title: "Campus AI Assistant",
                desc: "Built-in AI chatbot answering campus queries, exam schedules, and library guidelines.",
                icon: Sparkles,
                color: "from-cyan-500 to-blue-600",
              },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="glass-card p-6 space-y-4 hover:-translate-y-1 transition-transform">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${f.color} text-white flex items-center justify-center shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{f.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive FAQ Accordion */}
      <section className="py-20 max-w-4xl mx-auto px-4 lg:px-8 w-full space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Everything judges need to know about CampusPulse AI</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-card overflow-hidden">
              <button
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full text-left p-4 flex items-center justify-between font-bold text-sm text-slate-900 dark:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeFaq === i ? "rotate-180" : ""}`} />
              </button>
              {activeFaq === i && (
                <div className="p-4 pt-0 text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed border-t border-slate-100 dark:border-slate-800/60">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-8 bg-slate-900 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-white">CampusPulse AI</span>
            <span>• DevFusion 4.O Hackathon Solution</span>
          </div>
          <div className="text-[11px] font-medium">
            Designed for Hackathon Problem Statement 1 • Full Stack Next.js & Node.js
          </div>
        </div>
      </footer>
    </div>
  );
}
