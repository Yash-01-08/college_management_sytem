import React, { useEffect, useState } from "react";
import { getCoordinatorEnrollments, createCoordinatorEnrollment, updateCoordinatorEnrollment, getCoordinatorStudents, getCoordinatorSubjects } from "../../services/coordinatorService";
import { Enrollment, User, Subject } from "../../types";
import { Table, Column } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Loader } from "../../components/ui/Loader";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { Plus, Edit2 } from "lucide-react";

export const CoordinatorEnrollments: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState<Enrollment | null>(null);
  const [formData, setFormData] = useState({ studentId: "", subjectId: "", semester: 4, status: "Active" as "Active" | "Completed" | "Dropped" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [enRes, stuRes, subRes] = await Promise.all([
        getCoordinatorEnrollments(),
        getCoordinatorStudents(),
        getCoordinatorSubjects(),
      ]);
      setEnrollments(enRes.data || []);
      setStudents(stuRes.data || []);
      setSubjects(subRes.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load enrollments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditingEnrollment(null);
    setFormData({
      studentId: students[0]?.id || students[0]?._id || "",
      subjectId: subjects[0]?.id || subjects[0]?._id || "",
      semester: 4,
      status: "Active",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (en: Enrollment) => {
    setEditingEnrollment(en);
    setFormData({
      studentId: typeof en.student === "object" ? (en.student.id || en.student._id || "") : en.student,
      subjectId: typeof en.subject === "object" ? (en.subject.id || en.subject._id || "") : en.subject,
      semester: en.semester || 4,
      status: en.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (editingEnrollment) {
        const id = editingEnrollment.id || editingEnrollment._id || "";
        await updateCoordinatorEnrollment(id, formData);
      } else {
        await createCoordinatorEnrollment(formData);
      }
      setIsModalOpen(false);
      await fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to save enrollment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loader label="Loading enrollments..." />;

  const columns: Column<Enrollment>[] = [
    { header: "Student Name", accessor: (row) => row.studentName || (typeof row.student === "object" ? row.student.name : row.student) },
    { header: "Scholar Number", accessor: (row) => <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{row.scholarNumber || "N/A"}</span> },
    { header: "Subject", accessor: (row) => `${row.subjectCode || ""} - ${row.subjectName || ""}` },
    { header: "Semester", accessor: (row) => `Sem ${row.semester || 4}` },
    {
      header: "Status",
      accessor: (row) => (
        <Badge variant={row.status === "Active" ? "success" : row.status === "Completed" ? "primary" : "danger"}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: "Actions",
      accessor: (row) => (
        <button onClick={() => handleOpenEdit(row)} className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60" title="Change Status">
          <Edit2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Student Enrollments</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">Manage student subject enrollments and status lifecycle</p>
        </div>
        <Button icon={Plus} onClick={handleOpenCreate}>New Enrollment</Button>
      </div>

      {error && <ErrorMessage message={error} />}

      <Table columns={columns} data={enrollments} emptyMessage="No enrollments found." />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingEnrollment ? "Update Enrollment Status" : "Create New Student Enrollment"}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 mb-1">Select Student</label>
            <select value={formData.studentId} onChange={(e) => setFormData({ ...formData, studentId: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-xs text-gray-900 dark:text-white" required disabled={Boolean(editingEnrollment)}>
              {students.map((s) => (
                <option key={s.id || s._id} value={s.id || s._id}>
                  {s.name} ({s.scholarNumber || s.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 mb-1">Select Subject</label>
            <select value={formData.subjectId} onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-xs text-gray-900 dark:text-white" required disabled={Boolean(editingEnrollment)}>
              {subjects.map((sub) => (
                <option key={sub.id || sub._id} value={sub.id || sub._id}>
                  {sub.code} - {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 mb-1">Enrollment Status</label>
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-xs text-gray-900 dark:text-white">
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Dropped">Dropped</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={isSubmitting}>{editingEnrollment ? "Update Status" : "Create Enrollment"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CoordinatorEnrollments;
