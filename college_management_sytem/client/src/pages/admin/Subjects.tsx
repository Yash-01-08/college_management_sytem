import React, { useEffect, useState } from "react";
import { Subject } from "../../types";
import { getAdminSubjects, createAdminSubject, deleteAdminSubject } from "../../services/adminService";
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
import { BookOpen, Plus, Trash2 } from "lucide-react";

export const SubjectsPage: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [semester, setSemester] = useState(1);
  const [credits, setCredits] = useState(4);
  const [type, setType] = useState<"Theory" | "Practical" | "Hybrid">("Theory");
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Subject | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminSubjects();
      if (res.data) setSubjects(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch subjects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;
    try {
      setIsSaving(true);
      const res = await createAdminSubject({ name, code, department, semester: Number(semester), credits: Number(credits), type, status: "Active" });
      const newSubject = res.data || ({ id: `sub_${Date.now()}`, name, code, department, semester: Number(semester), credits: Number(credits), type, status: "Active" } as Subject);
      setSubjects((prev) => [newSubject, ...prev]);
      setIsModalOpen(false);
      setName("");
      setCode("");
    } catch (err: any) {
      alert(err.message || "Failed to create subject.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await deleteAdminSubject(deleteTarget.id || (deleteTarget as any)._id);
      setSubjects((prev) => prev.filter((s) => (s.id || (s as any)._id) !== (deleteTarget.id || (deleteTarget as any)._id)));
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete subject.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredSubjects = subjects.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.code?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader message="Loading subject catalog..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchSubjects} />;

  const columns = [
    {
      header: "Subject Name",
      accessor: (s: Subject) => {
        const deptStr = typeof s.department === "object" ? s.department?.name : s.department;
        return (
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">{s.name}</div>
            <div className="text-xs text-gray-500 dark:text-slate-400">{deptStr || "General"} • Semester {s.semester}</div>
          </div>
        );
      },
    },
    {
      header: "Subject Code",
      accessor: (s: Subject) => <Badge variant="indigo">{s.code}</Badge>,
    },
    {
      header: "Credits & Type",
      accessor: (s: Subject) => (
        <div className="text-xs font-medium text-gray-700 dark:text-slate-300">
          {s.credits} Credits ({s.type})
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (s: Subject) => <Badge variant="emerald">{s.status || "Active"}</Badge>,
    },
    {
      header: "Actions",
      accessor: (s: Subject) => (
        <Button variant="danger" size="sm" onClick={() => setDeleteTarget(s)} icon={Trash2}>
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
            <BookOpen className="w-6 h-6 text-indigo-500" />
            <span>Curriculum Subjects</span>
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Manage subject credits, semesters, and teaching methods.
          </p>
        </div>

        <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
          Add Subject
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Search subjects..." className="w-full sm:w-72" />
      </div>

      {filteredSubjects.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No Subjects Found"
          description="Create your first subject using the button above."
        />
      ) : (
        <Table columns={columns} data={filteredSubjects} />
      )}

      {/* Add Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Subject">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Subject Name" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} placeholder="e.g. Data Structures" required />
          <Input label="Subject Code" value={code} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value)} placeholder="e.g. CS401" required />
          <div className="grid grid-cols-3 gap-3">
            <Input label="Semester" type="number" value={semester} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSemester(Number(e.target.value))} required />
            <Input label="Credits" type="number" value={credits} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCredits(Number(e.target.value))} required />
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3.5 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white text-sm"
              >
                <option value="Theory">Theory</option>
                <option value="Practical">Practical</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} type="button">
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              Create Subject
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
          title="Delete Subject"
          message={`Are you sure you want to delete ${deleteTarget.name}?`}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default SubjectsPage;
