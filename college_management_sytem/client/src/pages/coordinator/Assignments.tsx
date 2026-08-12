import React, { useEffect, useState } from "react";
import {
  getCoordinatorAssignments,
  createCoordinatorAssignment,
  updateCoordinatorAssignment,
  deleteCoordinatorAssignment,
  getCoordinatorFaculty,
  getCoordinatorSubjects,
  getCoordinatorCourses,
} from "../../services/coordinatorService";
import { FacultyAssignment, User, Subject, Course } from "../../types";
import { Table, Column } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { Input } from "../../components/ui/Input";
import { Loader } from "../../components/ui/Loader";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { Plus, Edit2, Trash2, UserPlus } from "lucide-react";

export const CoordinatorAssignments: React.FC = () => {
  const [assignments, setAssignments] = useState<FacultyAssignment[]>([]);
  const [facultyList, setFacultyList] = useState<User[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<FacultyAssignment | null>(null);
  const [formData, setFormData] = useState({
    faculty: "",
    subject: "",
    course: "",
    semester: 4,
    academicYear: "2025-2026",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [asRes, facRes, subRes, crsRes] = await Promise.all([
        getCoordinatorAssignments(),
        getCoordinatorFaculty(),
        getCoordinatorSubjects(),
        getCoordinatorCourses(),
      ]);
      setAssignments(asRes.data || []);
      setFacultyList(facRes.data || []);
      setSubjects(subRes.data || []);
      setCourses(crsRes.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load faculty assignments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditingAssignment(null);
    setFormData({
      faculty: facultyList[0]?.id || facultyList[0]?._id || "",
      subject: subjects[0]?.id || subjects[0]?._id || "",
      course: courses[0]?.name || "B.Tech CSE",
      semester: 4,
      academicYear: "2025-2026",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (as: FacultyAssignment) => {
    setEditingAssignment(as);
    setFormData({
      faculty: typeof as.faculty === "object" ? (as.faculty.id || as.faculty._id || "") : as.faculty,
      subject: typeof as.subject === "object" ? (as.subject.id || as.subject._id || "") : as.subject,
      course: typeof as.course === "object" ? as.course.name : (as.courseName || as.course),
      semester: as.semester,
      academicYear: as.academicYear,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (editingAssignment) {
        const id = editingAssignment.id || editingAssignment._id || "";
        await updateCoordinatorAssignment(id, formData);
      } else {
        await createCoordinatorAssignment(formData);
      }
      setIsModalOpen(false);
      await fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to save assignment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteCoordinatorAssignment(deletingId);
      setDeletingId(null);
      await fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to delete assignment.");
    }
  };

  if (loading) return <Loader label="Loading faculty assignments..." />;

  const columns: Column<FacultyAssignment>[] = [
    { header: "Faculty Member", accessor: (row) => row.facultyName || (typeof row.faculty === "object" ? row.faculty.name : row.faculty) },
    { header: "Assigned Subject", accessor: (row) => `${row.subjectCode || ""} - ${row.subjectName || ""}` },
    { header: "Course", accessor: (row) => row.courseName || (typeof row.course === "object" ? row.course.name : row.course) },
    { header: "Semester", accessor: (row) => `Sem ${row.semester}` },
    { header: "Academic Year", accessor: (row) => row.academicYear },
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
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Faculty Subject Assignments</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">Assign teaching staff to degree subjects for upcoming academic sessions</p>
        </div>
        <Button icon={UserPlus} onClick={handleOpenCreate}>Assign Faculty</Button>
      </div>

      {error && <ErrorMessage message={error} />}

      <Table columns={columns} data={assignments} emptyMessage="No faculty assignments found." />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingAssignment ? "Edit Faculty Assignment" : "Assign Faculty to Subject"}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 mb-1">Select Faculty</label>
            <select value={formData.faculty} onChange={(e) => setFormData({ ...formData, faculty: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-xs text-gray-900 dark:text-white" required>
              {facultyList.map((f) => (
                <option key={f.id || f._id} value={f.id || f._id}>{f.name} ({f.department || "Faculty"})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 mb-1">Select Subject</label>
            <select value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-xs text-gray-900 dark:text-white" required>
              {subjects.map((sub) => (
                <option key={sub.id || sub._id} value={sub.id || sub._id}>{sub.code} - {sub.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 mb-1">Course Program</label>
            <select value={formData.course} onChange={(e) => setFormData({ ...formData, course: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-xs text-gray-900 dark:text-white" required>
              {courses.map((c) => (
                <option key={c.id || c._id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Semester" type="number" value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })} required />
            <Input label="Academic Year" value={formData.academicYear} onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })} placeholder="2025-2026" required />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={isSubmitting}>{editingAssignment ? "Update Assignment" : "Assign Faculty"}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal isOpen={Boolean(deletingId)} onClose={() => setDeletingId(null)} onConfirm={handleDelete} title="Delete Assignment" message="Are you sure you want to remove this faculty teaching assignment?" />
    </div>
  );
};

export default CoordinatorAssignments;
