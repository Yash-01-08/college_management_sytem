import React, { useEffect, useState } from "react";
import { getStudentAttendance } from "../../services/studentService";
import { Attendance } from "../../types";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Loader } from "../../components/ui/Loader";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { EmptyState } from "../../components/ui/EmptyState";
import { Table, Column } from "../../components/ui/Table";
import { ClipboardList, Filter } from "lucide-react";

export const StudentAttendance: React.FC = () => {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>("ALL");

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getStudentAttendance();
      setAttendance(res.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load attendance records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  if (loading) return <Loader label="Loading attendance report..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchAttendance} />;

  const filteredAttendance = attendance.filter((item) => {
    if (selectedSubject === "ALL") return true;
    return (
      item.subjectCode === selectedSubject ||
      (typeof item.subject === "object" && item.subject.code === selectedSubject)
    );
  });

  const overallTotal = attendance.reduce((acc, curr) => acc + (curr.totalClasses || 0), 0);
  const overallPresent = attendance.reduce((acc, curr) => acc + (curr.present || 0), 0);
  const overallPercentage = overallTotal > 0 ? ((overallPresent / overallTotal) * 100).toFixed(1) : "0.0";

  const columns: Column<Attendance>[] = [
    {
      header: "Subject Code",
      accessor: (row) => row.subjectCode || (typeof row.subject === "object" ? row.subject.code : "N/A"),
    },
    {
      header: "Subject Name",
      accessor: (row) => row.subjectName || (typeof row.subject === "object" ? row.subject.name : "N/A"),
    },
    {
      header: "Total Classes",
      accessor: (row) => row.totalClasses || 0,
    },
    {
      header: "Present",
      accessor: (row) => <span className="text-emerald-600 dark:text-emerald-400 font-bold">{row.present || 0}</span>,
    },
    {
      header: "Absent",
      accessor: (row) => <span className="text-rose-600 dark:text-rose-400 font-bold">{row.absent || 0}</span>,
    },
    {
      header: "Late",
      accessor: (row) => <span className="text-amber-600 dark:text-amber-400 font-bold">{row.late || 0}</span>,
    },
    {
      header: "Attendance %",
      accessor: (row) => {
        const pct = row.percentage ?? (row.totalClasses ? ((row.present || 0) / row.totalClasses) * 100 : 0);
        const formatted = Number(pct).toFixed(1);
        const isGood = Number(pct) >= 75;
        return (
          <Badge variant={isGood ? "success" : "danger"}>
            {formatted}%
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Attendance Overview
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
            Track your class participation and attendance percentages across subjects
          </p>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Subjects</option>
            {attendance.map((att) => {
              const code = att.subjectCode || (typeof att.subject === "object" ? att.subject.code : att.id);
              const name = att.subjectName || (typeof att.subject === "object" ? att.subject.name : code);
              return (
                <option key={att.id || att._id} value={code}>
                  {code} - {name}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Aggregate Card */}
      <Card className="bg-gradient-to-r from-indigo-500/10 via-cyan-500/10 to-transparent">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-600 text-white">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                Overall Attendance Average
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                {overallPercentage}%
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800">
              <span className="text-gray-400 mr-1">Classes:</span>
              <span className="text-gray-900 dark:text-white font-bold">{overallTotal}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400">
              <span className="mr-1">Attended:</span>
              <span className="font-bold">{overallPresent}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Detail Table */}
      {filteredAttendance.length === 0 ? (
        <EmptyState title="No Attendance Records" description="No attendance details found for the selected filter." />
      ) : (
        <Table columns={columns} data={filteredAttendance} />
      )}
    </div>
  );
};

export default StudentAttendance;
