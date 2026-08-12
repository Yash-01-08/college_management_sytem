import React, { useEffect, useState } from "react";
import { getCoordinatorFaculty } from "../../services/coordinatorService";
import { User } from "../../types";
import { Table, Column } from "../../components/ui/Table";
import { Loader } from "../../components/ui/Loader";
import { ErrorMessage } from "../../components/ui/ErrorMessage";

export const CoordinatorFaculty: React.FC = () => {
  const [faculty, setFaculty] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCoordinatorFaculty()
      .then((res) => setFaculty(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading faculty directory..." />;
  if (error) return <ErrorMessage message={error} />;

  const columns: Column<User>[] = [
    { header: "Employee ID", accessor: (row) => <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{row.employeeId || "N/A"}</span> },
    { header: "Faculty Name", accessor: (row) => row.name },
    { header: "Email", accessor: (row) => row.email },
    { header: "Department", accessor: (row) => row.department || "Computer Science" },
    { header: "Designation", accessor: (row) => row.designation || "Assistant Professor" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Teaching Staff Directory</h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">Overview of department teaching faculty and designations</p>
      </div>

      <Table columns={columns} data={faculty} emptyMessage="No faculty members found." />
    </div>
  );
};

export default CoordinatorFaculty;
