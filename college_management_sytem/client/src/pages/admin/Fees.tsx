import React, { useEffect, useState } from "react";
import { Fee } from "../../types";
import { getAdminFees, createAdminFee, deleteAdminFee } from "../../services/adminService";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import SearchBar from "../../components/ui/SearchBar";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { CreditCard, Plus, Trash2 } from "lucide-react";

export const FeesPage: React.FC = () => {
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [scholarNumber, setScholarNumber] = useState("");
  const [title, setTitle] = useState("Semester Tuition Fee");
  const [totalAmount, setTotalAmount] = useState(45000);
  const [dueDate, setDueDate] = useState("2026-08-30");
  const [status, setStatus] = useState<"Paid" | "Pending" | "Partial" | "Overdue">("Pending");
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Fee | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchFees = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminFees();
      if (res.data) setFees(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch fee records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !title) return;
    try {
      setIsSaving(true);
      const paid = status === "Paid" ? Number(totalAmount) : 0;
      const due = Number(totalAmount) - paid;
      const res = await createAdminFee({
        studentName,
        scholarNumber,
        title,
        academicYear: "2025-2026",
        semester: 4,
        totalAmount: Number(totalAmount),
        paidAmount: paid,
        dueAmount: due,
        dueDate,
        status,
      });

      const newFee = res.data || ({
        id: `f_${Date.now()}`,
        studentName,
        scholarNumber,
        title,
        academicYear: "2025-2026",
        semester: 4,
        totalAmount: Number(totalAmount),
        paidAmount: paid,
        dueAmount: due,
        dueDate,
        status,
      } as Fee);

      setFees((prev) => [newFee, ...prev]);
      setIsModalOpen(false);
      setStudentName("");
      setScholarNumber("");
    } catch (err: any) {
      alert(err.message || "Failed to create fee record.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await deleteAdminFee(deleteTarget.id || (deleteTarget as any)._id);
      setFees((prev) => prev.filter((f) => (f.id || (f as any)._id) !== (deleteTarget.id || (deleteTarget as any)._id)));
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete fee record.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredFees = fees.filter(
    (f) =>
      f.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      f.scholarNumber?.toLowerCase().includes(search.toLowerCase()) ||
      f.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader message="Loading financial fee ledgers..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchFees} />;

  const columns = [
    {
      header: "Student",
      accessor: (f: Fee) => (
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{f.studentName}</div>
          <div className="text-xs text-gray-500 dark:text-slate-400">Scholar #: {f.scholarNumber}</div>
        </div>
      ),
    },
    {
      header: "Fee Description",
      accessor: (f: Fee) => f.title,
    },
    {
      header: "Total / Due",
      accessor: (f: Fee) => (
        <div>
          <div className="font-bold text-gray-900 dark:text-white">${f.totalAmount}</div>
          <div className="text-xs text-rose-500 font-medium">Due: ${f.dueAmount}</div>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (f: Fee) => {
        let variant: "emerald" | "amber" | "rose" | "indigo" = "emerald";
        if (f.status === "Pending") variant = "amber";
        if (f.status === "Overdue") variant = "rose";
        return <Badge variant={variant}>{f.status}</Badge>;
      },
    },
    {
      header: "Actions",
      accessor: (f: Fee) => (
        <Button variant="danger" size="sm" onClick={() => setDeleteTarget(f)} icon={Trash2}>
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
            <CreditCard className="w-6 h-6 text-indigo-500" />
            <span>Student Fee Collections</span>
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Manage tuition fees, dues, and payment statuses.
          </p>
        </div>

        <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
          Create Fee Record
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Search fee records..." className="w-full sm:w-72" />
      </div>

      {filteredFees.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No Fee Records Found"
          description="Create a fee entry using the button above."
        />
      ) : (
        <Table columns={columns} data={filteredFees} />
      )}

      {/* Add Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Student Fee Entry">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Student Name" value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Alex Johnson" required />
          <Input label="Scholar Number" value={scholarNumber} onChange={(e) => setScholarNumber(e.target.value)} placeholder="SCH2024-0089" required />
          <Input label="Fee Description" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Semester 4 Tuition Fee" required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Total Amount ($)" type="number" value={totalAmount} onChange={(e) => setTotalAmount(Number(e.target.value))} required />
            <Input label="Due Date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full px-3.5 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white text-sm">
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} type="button">
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              Save Fee Record
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          title="Delete Fee Record"
          message={`Are you sure you want to delete fee record for ${deleteTarget.studentName}?`}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default FeesPage;
