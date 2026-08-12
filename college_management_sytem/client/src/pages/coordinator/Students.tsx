import React, { useEffect, useState } from "react";
import { getCoordinatorStudents } from "../../services/coordinatorService";
import { User } from "../../types";
import { Table, Column } from "../../components/ui/Table";
import { Loader } from "../../components/ui/Loader";
import { ErrorMessage } from "../../components/ui/ErrorMessage";

export const CoordinatorStudents: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCoordinatorStudents()
      .then((res) => setStudents(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading student directory..." />;
  if (error) return <ErrorMessage message={error} />;

  const columns: Column<User>[] = [
    { header: "Scholar Number", accessor: (row) => <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{row.scholarNumber || "N/A"}</span> },
    { header: "Student Name", accessor: (row) => row.name },
    { header: "Email", accessor: (row) => row.email },
    { header: "Department", accessor: (row) => row.department || "Computer Science" },
    { header: "Semester", accessor: (row) => `Sem ${row.semester || 4}` },
    { header: "Batch", accessor: (row) => row.batch || "2024-2028" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Department Student Directory</h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">Overview of registered students under your coordination</p>
      </div>

      <Table columns={columns} data={students} emptyMessage="No students found." />
    </div>
  );
};

export default CoordinatorStudents;
