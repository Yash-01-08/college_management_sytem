import React, { useEffect, useState } from "react";
import {
  getCoordinatorDepartments,
  createCoordinatorDepartment,
  updateCoordinatorDepartment,
  deleteCoordinatorDepartment,
} from "../../services/coordinatorService";
import { Department } from "../../types";
import { Table, Column } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { Loader } from "../../components/ui/Loader";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { Building2, Plus, Edit2, Trash2 } from "lucide-react";

export const CoordinatorDepartments: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [formData, setFormData] = useState({ name: "", code: "", description: "", hod: "", status: "Active" as "Active" | "Inactive" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirm State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCoordinatorDepartments();
      setDepartments(res.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load departments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleOpenCreate = () => {
    setEditingDept(null);
    setFormData({ name: "", code: "", description: "", hod: "", status: "Active" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dept: Department) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      code: dept.code,
      description: dept.description || "",
      hod: dept.hod || "",
      status: dept.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) return;

    try {
      setIsSubmitting(true);
      if (editingDept) {
        const id = editingDept.id || editingDept._id || "";
        await updateCoordinatorDepartment(id, formData);
      } else {
        await createCoordinatorDepartment(formData);
      }
      setIsModalOpen(false);
      await fetchDepartments();
    } catch (err: any) {
      setError(err.message || "Failed to save department.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteCoordinatorDepartment(deletingId);
      setDeletingId(null);
      await fetchDepartments();
    } catch (err: any) {
      setError(err.message || "Failed to delete department.");
    }
  };

  if (loading) return <Loader label="Loading departments..." />;

  const columns: Column<Department>[] = [
    { header: "Code", accessor: (row) => <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{row.code}</span> },
    { header: "Department Name", accessor: (row) => row.name },
    { header: "Head of Department (HOD)", accessor: (row) => row.hod || "Unassigned" },
    { header: "Status", accessor: (row) => <Badge variant={row.status === "Active" ? "success" : "neutral"}>{row.status}</Badge> },
    {
      header: "Actions",
      accessor: (row) => {
        const id = row.id || row._id || "";
        return (
          <div className="flex items-center gap-2">
            <button onClick={() => handleOpenEdit(row)} className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60" title="Edit">
              <Edit2 className="w-4 h-4" />
            </button>
            <button onClick={() => setDeletingId(id)} className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60" title="Delete">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Department Management</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">Configure college departments, codes, and HOD assignments</p>
        </div>
        <Button icon={Plus} onClick={handleOpenCreate}>Create Department</Button>
      </div>

      {error && <ErrorMessage message={error} />}

      <Table columns={columns} data={departments} emptyMessage="No departments found." />

      {/* Create/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingDept ? "Edit Department" : "Create New Department"}>
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Department Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Computer Science & Engineering" required />
          <Input label="Department Code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="e.g. CSE" required />
          <Input label="Head of Department (HOD)" value={formData.hod} onChange={(e) => setFormData({ ...formData, hod: e.target.value })} placeholder="Dr. Robert Smith" />
          <Textarea label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Brief description of department scope" />
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 mb-1">Status</label>
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as "Active" | "Inactive" })} className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-xs text-gray-900 dark:text-white">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={isSubmitting}>{editingDept ? "Update Department" : "Create Department"}</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal isOpen={Boolean(deletingId)} onClose={() => setDeletingId(null)} onConfirm={handleDelete} title="Delete Department" message="Are you sure you want to delete this department? This action cannot be undone." />
    </div>
  );
};

export default CoordinatorDepartments;
