import React, { useEffect, useState } from "react";
import { getStudentResults } from "../../services/studentService";
import { Result } from "../../types";
import { Table, Column } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import { Loader } from "../../components/ui/Loader";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { EmptyState } from "../../components/ui/EmptyState";
import { Award, Filter } from "lucide-react";

export const StudentResults: React.FC = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | "ALL">("ALL");

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getStudentResults();
      setResults(res.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load examination results.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  if (loading) return <Loader message="Loading grade report..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchResults} />;

  const filteredResults = results.filter((res) => {
    if (selectedSemester === "ALL") return true;
    return res.semester === selectedSemester;
  });

  const semesters = Array.from(
    new Set(results.map((r) => r.semester).filter((s): s is number => typeof s === "number"))
  ).sort((a, b) => a - b);

  const columns: Column<Result>[] = [
    {
      header: "Subject Code",
      accessor: (row) => row.subjectCode || (typeof row.subject === "object" ? row.subject.code : "N/A"),
    },
    {
      header: "Subject Name",
      accessor: (row) => row.subjectName || (typeof row.subject === "object" ? row.subject.name : "N/A"),
    },
    {
      header: "Semester",
      accessor: (row) => `Sem ${row.semester}`,
    },
    {
      header: "Internal Marks",
      accessor: (row) => `${row.internalMarks} / ${row.maxInternalMarks || 30}`,
    },
    {
      header: "External Marks",
      accessor: (row) => `${row.externalMarks} / ${row.maxExternalMarks || 70}`,
    },
    {
      header: "Total",
      accessor: (row) => (
        <span className="font-extrabold text-gray-900 dark:text-white">
          {row.totalMarks} / {row.maxTotalMarks || 100}
        </span>
      ),
    },
    {
      header: "Grade",
      accessor: (row) => (
        <span className="font-bold text-indigo-600 dark:text-indigo-400">
          {row.grade} ({row.gradePoint} pts)
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (row) => (
        <Badge variant={row.status === "Pass" ? "success" : "danger"}>
          {row.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Academic Performance & Results
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
            Grade cards, internal assessment evaluations, and end-semester scores
          </p>
        </div>

        {/* Semester Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={selectedSemester}
            onChange={(e) =>
              setSelectedSemester(e.target.value === "ALL" ? "ALL" : Number(e.target.value))
            }
            className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Semesters</option>
            {semesters.map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredResults.length === 0 ? (
        <EmptyState title="No Results Published" description="No grade records found for the selected semester." icon={Award} />
      ) : (
        <Table columns={columns} data={filteredResults} />
      )}
    </div>
  );
};

export default StudentResults;
