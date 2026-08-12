import React, { useEffect, useState } from "react";
import { getFacultyStudents, getFacultySubjects } from "../../services/facultyService";
import { User, Subject } from "../../types";
import { Table, Column } from "../../components/ui/Table";
import { Loader } from "../../components/ui/Loader";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { EmptyState } from "../../components/ui/EmptyState";
import { Users, Filter } from "lucide-react";

export const FacultyStudents: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInitial = async () => {
    try {
      setLoading(true);
      setError(null);
      const subRes = await getFacultySubjects();
      setSubjects(subRes.data || []);
      const defaultSubId = subRes.data?.[0]?.id || subRes.data?.[0]?._id || "";
      setSelectedSubjectId(defaultSubId);

      const stuRes = await getFacultyStudents(defaultSubId);
      setStudents(stuRes.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load student roster.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitial();
  }, []);

  const handleSubjectChange = async (subjectId: string) => {
    try {
      setSelectedSubjectId(subjectId);
      setLoading(true);
      const res = await getFacultyStudents(subjectId);
      setStudents(res.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to filter students for selected subject.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && subjects.length === 0) return <Loader label="Loading student roster..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchInitial} />;

  const columns: Column<User>[] = [
    {
      header: "Scholar Number",
      accessor: (row) => <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{row.scholarNumber || "N/A"}</span>,
    },
    {
      header: "Student Name",
      accessor: (row) => row.name,
    },
    {
      header: "Email Address",
      accessor: (row) => row.email,
    },
    {
      header: "Department",
      accessor: (row) => row.department || "Computer Science",
    },
    {
      header: "Semester",
      accessor: (row) => `Sem ${row.semester || 4}`,
    },
    {
      header: "Batch",
      accessor: (row) => row.batch || "2024-2028",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Enrolled Students Roster
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
            Students currently enrolled in your assigned subjects
          </p>
        </div>

        {/* Subject Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={selectedSubjectId}
            onChange={(e) => handleSubjectChange(e.target.value)}
            className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {subjects.map((s) => (
              <option key={s.id || s._id} value={s.id || s._id}>
                {s.code} - {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {students.length === 0 ? (
        <EmptyState title="No Students Found" description="No students are enrolled in the selected subject." icon={Users} />
      ) : (
        <Table columns={columns} data={students} />
      )}
    </div>
  );
};

export default FacultyStudents;
