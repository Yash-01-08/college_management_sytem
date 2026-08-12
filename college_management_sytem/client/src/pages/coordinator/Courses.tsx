import React, { useEffect, useState } from "react";
import { getCoordinatorCourses, createCoordinatorCourse, updateCoordinatorCourse, deleteCoordinatorCourse, getCoordinatorDepartments } from "../../services/coordinatorService";
import { Course, Department } from "../../types";
import { Table, Column } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { Input } from "../../components/ui/Input";
import { Loader } from "../../components/ui/Loader";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { Plus, Edit2, Trash2 } from "lucide-react";

export const CoordinatorCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({ name: "", code: "", department: "", duration: 4, totalSemesters: 8, status: "Active" as "Active" | "Inactive" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [crsRes, depRes] = await Promise.all([getCoordinatorCourses(), getCoordinatorDepartments()]);
      setCourses(crsRes.data || []);
      const deps = depRes.data || [];
      setDepartments(deps);
      if (deps.length > 0 && !formData.department) {
        setFormData((prev) => ({ ...prev, department: deps[0].name }));
      }
    } catch (err: any) {
      setError(err.message || "Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditingCourse(null);
    setFormData({ name: "", code: "", department: departments[0]?.name || "Computer Science & Engineering", duration: 4, totalSemesters: 8, status: "Active" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      code: course.code,
      department: typeof course.department === "object" ? course.department.name : course.department,
      duration: course.duration,
      totalSemesters: course.totalSemesters,
      status: course.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) return;

    try {
      setIsSubmitting(true);
      if (editingCourse) {
        const id = editingCourse.id || editingCourse._id || "";
        await updateCoordinatorCourse(id, formData);
      } else {
        await createCoordinatorCourse(formData);
      }
      setIsModalOpen(false);
      await fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to save course.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteCoordinatorCourse(deletingId);
      setDeletingId(null);
      await fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to delete course.");
    }
  };

  if (loading) return <Loader label="Loading courses..." />;

  const columns: Column<Course>[] = [
    { header: "Course Code", accessor: (row) => <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{row.code}</span> },
    { header: "Course Name", accessor: (row) => row.name },
    { header: "Department", accessor: (row) => typeof row.department === "object" ? row.department.name : row.department },
    { header: "Duration", accessor: (row) => `${row.duration} Yrs (${row.totalSemesters} Semesters)` },
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
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Academic Courses</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">Manage degree programs and semester configurations</p>
        </div>
        <Button icon={Plus} onClick={handleOpenCreate}>Create Course</Button>
      </div>

      {error && <ErrorMessage message={error} />}

      <Table columns={columns} data={courses} emptyMessage="No courses found." />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCourse ? "Edit Course" : "Create New Course"}>
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Course Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Bachelor of Technology in CS" required />
          <Input label="Course Code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="e.g. BTECH-CS" required />
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 mb-1">Select Department</label>
            <select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-xs text-gray-900 dark:text-white" required>
              {departments.map((d) => (
                <option key={d.id || d._id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Duration (Years)" type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })} required />
            <Input label="Total Semesters" type="number" value={formData.totalSemesters} onChange={(e) => setFormData({ ...formData, totalSemesters: Number(e.target.value) })} required />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 mb-1">Status</label>
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as "Active" | "Inactive" })} className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-xs text-gray-900 dark:text-white">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={isSubmitting}>{editingCourse ? "Update Course" : "Create Course"}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal isOpen={Boolean(deletingId)} onClose={() => setDeletingId(null)} onConfirm={handleDelete} title="Delete Course" message="Are you sure you want to delete this course?" />
    </div>
  );
};

export default CoordinatorCourses;
