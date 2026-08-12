import React, { useEffect, useState } from "react";
import {
  getCoordinatorSubjects,
  createCoordinatorSubject,
  updateCoordinatorSubject,
  deleteCoordinatorSubject,
  getCoordinatorCourses,
  getCoordinatorDepartments,
} from "../../services/coordinatorService";
import { Subject, Course, Department } from "../../types";
import { Table, Column } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { Input } from "../../components/ui/Input";
import { Loader } from "../../components/ui/Loader";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { Plus, Edit2, Trash2 } from "lucide-react";

export const CoordinatorSubjects: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    course: "",
    department: "",
    semester: 4,
    credits: 4,
    type: "Theory" as "Theory" | "Lab" | "Elective",
    status: "Active" as "Active" | "Inactive",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [subRes, crsRes, depRes] = await Promise.all([
        getCoordinatorSubjects(),
        getCoordinatorCourses(),
        getCoordinatorDepartments(),
      ]);
      setSubjects(subRes.data || []);
      setCourses(crsRes.data || []);
      setDepartments(depRes.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load subjects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditingSubject(null);
    setFormData({
      name: "",
      code: "",
      course: courses[0]?.name || "B.Tech CSE",
      department: departments[0]?.name || "Computer Science & Engineering",
      semester: 4,
      credits: 4,
      type: "Theory",
      status: "Active",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      code: subject.code,
      course: typeof subject.course === "object" ? subject.course.name : subject.course,
      department: typeof subject.department === "object" ? subject.department.name : subject.department,
      semester: subject.semester,
      credits: subject.credits,
      type: subject.type,
      status: subject.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) return;

    try {
      setIsSubmitting(true);
      if (editingSubject) {
        const id = editingSubject.id || editingSubject._id || "";
        await updateCoordinatorSubject(id, formData);
      } else {
        await createCoordinatorSubject(formData);
      }
      setIsModalOpen(false);
      await fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to save subject.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteCoordinatorSubject(deletingId);
      setDeletingId(null);
      await fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to delete subject.");
    }
  };

  if (loading) return <Loader label="Loading subjects..." />;

  const columns: Column<Subject>[] = [
    { header: "Subject Code", accessor: (row) => <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{row.code}</span> },
    { header: "Subject Name", accessor: (row) => row.name },
    { header: "Course", accessor: (row) => typeof row.course === "object" ? row.course.name : row.course },
    { header: "Semester", accessor: (row) => `Sem ${row.semester}` },
    { header: "Credits", accessor: (row) => row.credits },
    { header: "Type", accessor: (row) => <Badge variant={row.type === "Theory" ? "primary" : row.type === "Lab" ? "warning" : "secondary"}>{row.type}</Badge> },
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
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Subject Curriculum</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">Configure syllabus subjects, credit points, and theory/lab types</p>
        </div>
        <Button icon={Plus} onClick={handleOpenCreate}>Create Subject</Button>
      </div>

      {error && <ErrorMessage message={error} />}

      <Table columns={columns} data={subjects} emptyMessage="No subjects found." />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSubject ? "Edit Subject" : "Create New Subject"}>
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Subject Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Data Structures & Algorithms" required />
          <Input label="Subject Code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="e.g. CS401" required />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 mb-1">Course</label>
              <select value={formData.course} onChange={(e) => setFormData({ ...formData, course: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-xs text-gray-900 dark:text-white">
                {courses.map((c) => (
                  <option key={c.id || c._id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 mb-1">Department</label>
              <select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-xs text-gray-900 dark:text-white">
                {departments.map((d) => (
                  <option key={d.id || d._id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input label="Semester" type="number" min={1} max={8} value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })} required />
            <Input label="Credits" type="number" min={1} max={10} value={formData.credits} onChange={(e) => setFormData({ ...formData, credits: Number(e.target.value) })} required />
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 mb-1">Type</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as any })} className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-xs text-gray-900 dark:text-white">
                <option value="Theory">Theory</option>
                <option value="Lab">Lab</option>
                <option value="Elective">Elective</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 mb-1">Status</label>
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-xs text-gray-900 dark:text-white">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={isSubmitting}>{editingSubject ? "Update Subject" : "Create Subject"}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal isOpen={Boolean(deletingId)} onClose={() => setDeletingId(null)} onConfirm={handleDelete} title="Delete Subject" message="Are you sure you want to delete this subject?" />
    </div>
  );
};

export default CoordinatorSubjects;
