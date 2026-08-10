"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  Building,
  QrCode,
  FileCheck,
  Briefcase,
  Activity,
  UserPlus,
  Trash2,
  Edit,
  Download,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Navbar } from "@/components/common/Navbar";
import { Sidebar } from "@/components/common/Sidebar";
import { GlobalSearch } from "@/components/common/GlobalSearch";
import { AIChatbot } from "@/components/common/AIChatbot";
import { db } from "@/lib/db";
import { getStoredUser } from "@/lib/auth";
import { exportToCSV } from "@/lib/utils";
import { User, UserRole } from "@/lib/types";

export default function AdminDashboard() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const user = getStoredUser();

  useEffect(() => {
    setUsers(db.getUsers());
  }, []);

  const auditLogs = db.getAuditLogs();

  const chartData = [
    { month: "Jan", attendance: 92, placement: 75, assignments: 88 },
    { month: "Feb", attendance: 94, placement: 82, assignments: 90 },
    { month: "Mar", attendance: 91, placement: 88, assignments: 85 },
    { month: "Apr", attendance: 96, placement: 92, assignments: 94 },
    { month: "May", attendance: 95, placement: 98, assignments: 96 },
  ];

  const pieData = [
    { name: "Students", value: 450, color: "#6366f1" },
    { name: "Faculty", value: 35, color: "#a855f7" },
    { name: "Coordinators", value: 12, color: "#f59e0b" },
    { name: "Admins", value: 5, color: "#f43f5e" },
  ];

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    db.updateUser(userId, { role: newRole });
    setUsers([...db.getUsers()]);
  };

  const handleExportUsers = () => {
    exportToCSV("campus_users_export", users);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar onOpenSearch={() => setSearchOpen(true)} onOpenAIChat={() => setAiChatOpen(true)} />
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <AIChatbot isOpen={aiChatOpen} onClose={() => setAiChatOpen(false)} />

      <div className="max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 flex gap-8">
        <Sidebar />

        <main className="flex-1 space-y-8">
          {/* Welcome Banner */}
          <div className="glass-card p-6 bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10 space-y-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-[11px] font-semibold uppercase tracking-wider">
                Full Access Admin Control • Dean of Academics
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold">System Administration Panel ⚙️</h1>
              <p className="text-xs text-rose-100 font-medium max-w-xl">
                Manage user permissions, department analytics, active session security, and system audit logs.
              </p>
            </div>
          </div>

          {/* Key Admin KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                <span>Total Users</span>
                <Users className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{users.length}</div>
              <div className="text-[10px] text-indigo-600 font-semibold">Registered Accounts</div>
            </div>

            <div className="glass-card p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                <span>Departments</span>
                <Building className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">6</div>
              <div className="text-[10px] text-purple-600 font-semibold">CSE, IT, ECE, ME, EEE, MBA</div>
            </div>

            <div className="glass-card p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                <span>Avg Attendance</span>
                <QrCode className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">94.2%</div>
              <div className="text-[10px] text-emerald-600 font-semibold">Session Audit Verified</div>
            </div>

            <div className="glass-card p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                <span>Placement Success</span>
                <Briefcase className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">92.8%</div>
              <div className="text-[10px] text-amber-600 font-semibold">Avg Package ₹28.5 LPA</div>
            </div>
          </div>

          {/* Visual Analytics Graphs (Recharts) */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-card p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Campus Monthly Performance (%)</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="attendance" fill="#6366f1" radius={[4, 4, 0, 0]} name="Attendance %" />
                    <Bar dataKey="placement" fill="#10b981" radius={[4, 4, 0, 0]} name="Placement %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">User Role Breakdown</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* User Role Management & RBAC Table */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">User Management & Permissions</h3>
                <p className="text-xs text-slate-500">Assign roles, inspect profiles, and export CSV audit logs.</p>
              </div>
              <button
                onClick={handleExportUsers}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Export Users CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold">
                    <th className="pb-3">User</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Department</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 font-semibold text-slate-900 dark:text-white">{u.name}</td>
                      <td className="py-3 text-slate-500">{u.email}</td>
                      <td className="py-3 text-slate-500">{u.department}</td>
                      <td className="py-3">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                          className="px-2 py-1 text-[11px] font-bold rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                        >
                          <option value="STUDENT">STUDENT</option>
                          <option value="FACULTY">FACULTY</option>
                          <option value="COORDINATOR">COORDINATOR</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                      <td className="py-3 text-right space-x-2">
                        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Log Table */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-500" /> Security Audit Log
            </h3>
            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{log.actorName}: </span>
                    <span className="text-slate-600 dark:text-slate-300">{log.details}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
