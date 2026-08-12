import React, { useEffect, useState } from "react";
import { Attendance } from "../../types";
import { getAdminAttendance, deleteAdminAttendance } from "../../services/adminService";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import SearchBar from "../../components/ui/SearchBar";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import ErrorMessage from "../../components/ui/ErrorMessage";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { ClipboardList, Trash2 } from "lucide-react";

export const AttendancePage: React.FC = () => {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<Attendance | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminAttendance();
      if (res.data) setRecords(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch attendance records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await deleteAdminAttendance(deleteTarget.id || (deleteTarget as any)._id);
      setRecords((prev) => prev.filter((r) => (r.id || (r as any)._id) !== (deleteTarget.id || (deleteTarget as any)._id)));
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete record.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredRecords = records.filter(
    (r) =>
      r.subjectName?.toLowerCase().includes(search.toLowerCase()) ||
      r.subjectCode?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader message="Loading attendance logs..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchAttendance} />;

  const columns = [
    {
      header: "Subject Session",
      accessor: (r: Attendance) => (
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{r.subjectName}</div>
          <Badge variant="indigo">{r.subjectCode}</Badge>
        </div>
      ),
    },
    {
      header: "Date",
      accessor: (r: Attendance) => r.date || "Today",
    },
    {
      header: "Present / Total",
      accessor: (r: Attendance) => (
        <span className="font-medium text-emerald-600 dark:text-emerald-400">
          {r.presentCount} / {r.totalStudents} ({Math.round(((r.presentCount || 0) / (r.totalStudents || 1)) * 100)}%)
        </span>
      ),
    },
    {
      header: "Absent",
      accessor: (r: Attendance) => <span className="text-rose-500 font-medium">{r.absentCount || 0}</span>,
    },
    {
      header: "Actions",
      accessor: (r: Attendance) => (
        <Button variant="danger" size="sm" onClick={() => setDeleteTarget(r)} icon={Trash2}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-indigo-500" />
            <span>Institutional Attendance Logs</span>
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Global view of subject attendance sessions and student logs.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Search attendance sessions..." className="w-full sm:w-72" />
      </div>

      {filteredRecords.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No Attendance Records"
          description="No subject attendance records found."
        />
      ) : (
        <Table columns={columns} data={filteredRecords} />
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          title="Delete Attendance Record"
          message={`Are you sure you want to delete attendance record for ${deleteTarget.subjectName}?`}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default AttendancePage;
