import React, { useEffect, useState } from "react";
import { Department } from "../../types";
import { getAdminDepartments, createAdminDepartment, deleteAdminDepartment } from "../../services/adminService";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import SearchBar from "../../components/ui/SearchBar";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { Building2, Plus, Trash2 } from "lucide-react";

export const DepartmentsPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [hod, setHod] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Department | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminDepartments();
      if (res.data) setDepartments(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch departments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;
    try {
      setIsSaving(true);
      const res = await createAdminDepartment({ name, code, description, hod, status: "Active" });
      const newDept = res.data || ({ id: `d_${Date.now()}`, name, code, description, hod, status: "Active" } as Department);
      setDepartments((prev) => [newDept, ...prev]);
      setIsModalOpen(false);
      setName("");
      setCode("");
      setDescription("");
      setHod("");
    } catch (err: any) {
      alert(err.message || "Failed to create department.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await deleteAdminDepartment(deleteTarget.id || (deleteTarget as any)._id);
      setDepartments((prev) => prev.filter((d) => (d.id || (d as any)._id) !== (deleteTarget.id || (deleteTarget as any)._id)));
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete department.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredDepts = departments.filter(
    (d) =>
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.code?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader message="Loading academic departments..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchDepartments} />;

  const columns = [
    {
      header: "Department Name",
      accessor: (d: Department) => (
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{d.name}</div>
          <div className="text-xs text-gray-500 dark:text-slate-400">{d.description || "No description provided"}</div>
        </div>
      ),
    },
    {
      header: "Code",
      accessor: (d: Department) => <Badge variant="indigo">{d.code}</Badge>,
    },
    {
      header: "Head of Department (HOD)",
      accessor: (d: Department) => d.hod || "Unassigned",
    },
    {
      header: "Status",
      accessor: (d: Department) => <Badge variant="emerald">{d.status || "Active"}</Badge>,
    },
    {
      header: "Actions",
      accessor: (d: Department) => (
        <Button variant="danger" size="sm" onClick={() => setDeleteTarget(d)} icon={Trash2}>
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
            <Building2 className="w-6 h-6 text-indigo-500" />
            <span>Academic Departments</span>
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Create, view, and organize institutional departments.
          </p>
        </div>

        <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
          Add Department
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Search departments..." className="w-full sm:w-72" />
      </div>

      {filteredDepts.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No Departments Found"
          description="Create your first academic department using the button above."
        />
      ) : (
        <Table columns={columns} data={filteredDepts} />
      )}

      {/* Add Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Department">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Department Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Computer Science" required />
          <Input label="Department Code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. CSE" required />
          <Input label="Head of Department (HOD)" value={hod} onChange={(e) => setHod(e.target.value)} placeholder="Dr. John Smith" />
          <Textarea label="Description" value={description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)} placeholder="Brief summary of department..." />

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} type="button">
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              Create Department
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
          title="Delete Department"
          message={`Are you sure you want to delete ${deleteTarget.name}?`}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default DepartmentsPage;
