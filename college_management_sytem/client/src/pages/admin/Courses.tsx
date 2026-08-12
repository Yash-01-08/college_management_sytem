import React, { useEffect, useState } from "react";
import { Course } from "../../types";
import { getAdminCourses, createAdminCourse, deleteAdminCourse } from "../../services/adminService";
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
import { GraduationCap, Plus, Trash2 } from "lucide-react";

export const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [duration, setDuration] = useState(4);
  const [totalSemesters, setTotalSemesters] = useState(8);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminCourses();
      if (res.data) setCourses(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;
    try {
      setIsSaving(true);
      const res = await createAdminCourse({ name, code, department, duration: Number(duration), totalSemesters: Number(totalSemesters), status: "Active" });
      const newCourse = res.data || ({ id: `c_${Date.now()}`, name, code, department, duration: Number(duration), totalSemesters: Number(totalSemesters), status: "Active" } as Course);
      setCourses((prev) => [newCourse, ...prev]);
      setIsModalOpen(false);
      setName("");
      setCode("");
    } catch (err: any) {
      alert(err.message || "Failed to create course.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await deleteAdminCourse(deleteTarget.id || (deleteTarget as any)._id);
      setCourses((prev) => prev.filter((c) => (c.id || (c as any)._id) !== (deleteTarget.id || (deleteTarget as any)._id)));
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete course.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredCourses = courses.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.code?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader message="Loading degree courses..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchCourses} />;

  const columns = [
    {
      header: "Course Title",
      accessor: (c: Course) => (
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{c.name}</div>
          <div className="text-xs text-gray-500 dark:text-slate-400">{typeof c.department === "object" ? c.department?.name : c.department}</div>
        </div>
      ),
    },
    {
      header: "Code",
      accessor: (c: Course) => <Badge variant="indigo">{c.code}</Badge>,
    },
    {
      header: "Duration / Semesters",
      accessor: (c: Course) => `${c.duration || 4} Years (${c.totalSemesters || 8} Sems)`,
    },
    {
      header: "Status",
      accessor: (c: Course) => <Badge variant="emerald">{c.status || "Active"}</Badge>,
    },
    {
      header: "Actions",
      accessor: (c: Course) => (
        <Button variant="danger" size="sm" onClick={() => setDeleteTarget(c)} icon={Trash2}>
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
            <GraduationCap className="w-6 h-6 text-indigo-500" />
            <span>Degree & Diploma Courses</span>
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Manage degree programs and curriculum durations.
          </p>
        </div>

        <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
          Add Course
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Search courses..." className="w-full sm:w-72" />
      </div>

      {filteredCourses.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No Courses Found"
          description="Create your first degree course using the button above."
        />
      ) : (
        <Table columns={columns} data={filteredCourses} />
      )}

      {/* Add Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Degree Course">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Course Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Bachelor of Technology in CS" required />
          <Input label="Course Code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. BTECH-CS" required />
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1">
              Department
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3.5 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Duration (Years)" type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} required />
            <Input label="Total Semesters" type="number" value={totalSemesters} onChange={(e) => setTotalSemesters(Number(e.target.value))} required />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} type="button">
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              Create Course
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
          title="Delete Course"
          message={`Are you sure you want to delete ${deleteTarget.name}?`}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default CoursesPage;
