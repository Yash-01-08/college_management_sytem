import React, { useEffect, useState } from "react";
import { getStudentFees } from "../../services/studentService";
import { Fee } from "../../types";
import { Table, Column } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import { Loader } from "../../components/ui/Loader";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { EmptyState } from "../../components/ui/EmptyState";
import { CreditCard, DollarSign } from "lucide-react";

export const StudentFees: React.FC = () => {
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFees = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getStudentFees();
      setFees(res.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load fee statements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  if (loading) return <Loader message="Loading fee details..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchFees} />;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return <Badge variant="success">Paid</Badge>;
      case "Partial":
        return <Badge variant="warning">Partial</Badge>;
      case "Pending":
        return <Badge variant="neutral">Pending</Badge>;
      case "Overdue":
        return <Badge variant="danger">Overdue</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const columns: Column<Fee>[] = [
    {
      header: "Statement Title",
      accessor: (row) => row.title || `Semester ${row.semester || 1} Tuition Fee`,
    },
    {
      header: "Academic Year",
      accessor: (row) => row.academicYear || "N/A",
    },
    {
      header: "Semester",
      accessor: (row) => `Sem ${row.semester || 1}`,
    },
    {
      header: "Total Amount",
      accessor: (row) => <span className="font-mono font-bold text-gray-900 dark:text-white">₹{(row.totalAmount || 0).toLocaleString()}</span>,
    },
    {
      header: "Paid",
      accessor: (row) => <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">₹{(row.paidAmount || 0).toLocaleString()}</span>,
    },
    {
      header: "Due",
      accessor: (row) => {
        const due = row.dueAmount || 0;
        return (
          <span className={`font-mono font-bold ${due > 0 ? "text-rose-600 dark:text-rose-400" : "text-gray-400"}`}>
            ₹{due.toLocaleString()}
          </span>
        );
      },
    },
    {
      header: "Due Date",
      accessor: (row) => (row.dueDate ? new Date(row.dueDate).toLocaleDateString() : "N/A"),
    },
    {
      header: "Status",
      accessor: (row) => getStatusBadge(row.status || "Pending"),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Tuition & Fee Statements
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
          Review academic fee dues, payment history, and pending balances
        </p>
      </div>

      {fees.length === 0 ? (
        <EmptyState title="No Fee Statements" description="There are no active fee statements associated with your account." icon={CreditCard} />
      ) : (
        <Table columns={columns} data={fees} />
      )}
    </div>
  );
};

export default StudentFees;
