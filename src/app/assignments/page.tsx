"use client";

import React, { useState, useEffect } from "react";
import { FileCheck, Plus, Upload, CheckCircle2, Award, ExternalLink, Shield } from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { Sidebar } from "@/components/common/Sidebar";
import { GlobalSearch } from "@/components/common/GlobalSearch";
import { AIChatbot } from "@/components/common/AIChatbot";
import { db } from "@/lib/db";
import { getStoredUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { Assignment, AssignmentSubmission, User } from "@/lib/types";

export default function AssignmentsPage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);

  // Submission Modal state
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [gitHubUrl, setGitHubUrl] = useState("");
  const [solutionText, setSolutionText] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Grade Modal state
  const [selectedSub, setSelectedSub] = useState<AssignmentSubmission | null>(null);
  const [gradeMarks, setGradeMarks] = useState(90);
  const [gradeFeedback, setGradeFeedback] = useState("Great solution!");

  useEffect(() => {
    setUser(getStoredUser());
    setAssignments(db.getAssignments());
    setSubmissions(db.getSubmissions());
  }, []);

  const isFaculty = user?.role === "FACULTY" || user?.role === "ADMIN";

  const handlePublishAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "CREATE_ASSIGNMENT",
        title: "Distributed Consensus Algorithm",
        description: "Implement Paxos/Raft consensus in Node.js",
        subject: "Advanced Database Management",
        subjectCode: "CS601",
        facultyId: user?.id || "faculty-1",
        facultyName: user?.name || "Dr. Kulkarni",
        deadline: "2026-08-30T23:59:00Z",
        totalMarks: 100,
      }),
    });
    const data = await res.json();
    if (data.assignment) {
      setAssignments([data.assignment, ...assignments]);
      setSuccessMsg("New Assignment published successfully!");
    }
  };

  const handleSubmitSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    const res = await fetch("/api/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "SUBMIT_SOLUTION",
        assignmentId: selectedAssignment.id,
        assignmentTitle: selectedAssignment.title,
        studentId: user?.id || "user-student-1",
        studentName: user?.name || "Aarav Sharma",
        rollNumber: user?.rollNumber || "CS2024-042",
        solutionText,
        gitHubUrl,
      }),
    });
    const data = await res.json();
    if (data.submission) {
      setSubmissions([data.submission, ...submissions]);
      setSelectedAssignment(null);
      setSuccessMsg("Assignment solution submitted!");
    }
  };

  const handleGradeSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;
    const res = await fetch("/api/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "GRADE_SUBMISSION",
        submissionId: selectedSub.id,
        marks: gradeMarks,
        feedback: gradeFeedback,
      }),
    });
    const data = await res.json();
    if (data.submission) {
      setSubmissions(db.getSubmissions());
      setSelectedSub(null);
      setSuccessMsg("Submission graded successfully!");
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
                <FileCheck className="w-7 h-7 text-purple-600" /> Assignment Hub & Rubrics
              </h1>
              <p className="text-xs text-slate-500 font-medium">Assignment uploads, solution submissions, and faculty review</p>
            </div>

            {isFaculty && (
              <button
                onClick={handlePublishAssignment}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-md"
              >
                <Plus className="w-4 h-4" /> Publish New Assignment
              </button>
            )}
          </div>

          {successMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Assignments Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {assignments.map((a) => (
              <div key={a.id} className="glass-card p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-bold">
                      {a.subjectCode} • Total {a.totalMarks} Marks
                    </span>
                    <span className="text-xs font-semibold text-rose-500">Deadline: {formatDate(a.deadline)}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{a.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{a.description}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Evaluation Rubrics:</div>
                  <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 list-disc list-inside">
                    {a.rubrics.map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setSelectedAssignment(a)}
                    className="w-full mt-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" /> Submit Solution Code / PDF
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Submission Modal */}
          {selectedAssignment && (
            <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-md glass-card p-6 space-y-4 shadow-2xl">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Submit: {selectedAssignment.title}</h3>
                <form onSubmit={handleSubmitSolution} className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">GitHub Repository Link</label>
                    <input
                      type="url"
                      value={gitHubUrl}
                      onChange={(e) => setGitHubUrl(e.target.value)}
                      placeholder="https://github.com/username/repo"
                      className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Solution Description / Text</label>
                    <textarea
                      rows={3}
                      value={solutionText}
                      onChange={(e) => setSolutionText(e.target.value)}
                      placeholder="Explain your approach..."
                      className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-bold"
                    >
                      Confirm Submission
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedAssignment(null)}
                      className="px-4 py-2.5 rounded-xl glass-card font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Submissions Review Table */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Submission History & Faculty Feedback</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold">
                    <th className="pb-3">Assignment</th>
                    <th className="pb-3">Student</th>
                    <th className="pb-3">Submitted At</th>
                    <th className="pb-3">Plagiarism Score</th>
                    <th className="pb-3">Status / Marks</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {submissions.map((sub) => (
                    <tr key={sub.id}>
                      <td className="py-3 font-semibold text-slate-900 dark:text-white">{sub.assignmentTitle}</td>
                      <td className="py-3 text-slate-600 dark:text-slate-300">{sub.studentName} ({sub.rollNumber})</td>
                      <td className="py-3 text-slate-500">{formatDate(sub.submissionDate)}</td>
                      <td className="py-3 font-bold text-purple-600">{sub.plagiarismScore}%</td>
                      <td className="py-3">
                        {sub.status === "GRADED" ? (
                          <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 font-bold">
                            Graded: {sub.marksObtained}/100
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded bg-amber-100 text-amber-700 font-bold">Pending Review</span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        {isFaculty && (
                          <button
                            onClick={() => setSelectedSub(sub)}
                            className="px-3 py-1 bg-indigo-600 text-white font-bold rounded-lg"
                          >
                            Grade
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
