import React, { useEffect, useState } from "react";
import {
  getCoordinatorTimetable,
  createCoordinatorTimetable,
  updateCoordinatorTimetable,
  deleteCoordinatorTimetable,
  getCoordinatorCourses,
  getCoordinatorSubjects,
  getCoordinatorFaculty,
} from "../../services/coordinatorService";
import { TimetableSlot, Course, Subject, User } from "../../types";
import { Table, Column } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { Input } from "../../components/ui/Input";
import { Loader } from "../../components/ui/Loader";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { Plus, Edit2, Trash2, Calendar } from "lucide-react";

export const CoordinatorTimetable: React.FC = () => {
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [facultyList, setFacultyList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimetableSlot | null>(null);
  const [formData, setFormData] = useState({
    course: "",
    subject: "",
    faculty: "",
    semester: 4,
    day: "Monday" as const,
    startTime: "09:00 AM",
    endTime: "10:00 AM",
    room: "LH-101",
    type: "Theory" as const,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [ttRes, crsRes, subRes, facRes] = await Promise.all([
        getCoordinatorTimetable(),
        getCoordinatorCourses(),
        getCoordinatorSubjects(),
        getCoordinatorFaculty(),
      ]);
      setTimetable(ttRes.data || []);
      setCourses(crsRes.data || []);
      setSubjects(subRes.data || []);
      setFacultyList(facRes.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load timetable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditingSlot(null);
    setFormData({
      course: courses[0]?.id || courses[0]?._id || "",
      subject: subjects[0]?.id || subjects[0]?._id || "",
      faculty: facultyList[0]?.id || facultyList[0]?._id || "",
      semester: 4,
      day: "Monday",
      startTime: "09:00 AM",
      endTime: "10:00 AM",
      room: "LH-101",
      type: "Theory",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (slot: TimetableSlot) => {
    setEditingSlot(slot);
    setFormData({
      course: (typeof slot.course === "object" ? (slot.course?.id || slot.course?._id || "") : slot.course) || "",
      subject: (typeof slot.subject === "object" ? (slot.subject?.id || slot.subject?._id || "") : slot.subject) || "",
      faculty: (typeof slot.faculty === "object" ? (slot.faculty?.id || slot.faculty?._id || "") : slot.faculty) || "",
      semester: slot.semester || 1,
      day: slot.day || "Monday",
      startTime: slot.startTime || "09:00 AM",
      endTime: slot.endTime || "10:00 AM",
      room: slot.room || "LH-101",
      type: slot.type || "Theory",
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (editingSlot) {
        const id = editingSlot.id || editingSlot._id || "";
        await updateCoordinatorTimetable(id, formData);
      } else {
        await createCoordinatorTimetable(formData);
      }
      setIsModalOpen(false);
      await fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to save timetable slot.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteCoordinatorTimetable(deletingId);
      setDeletingId(null);
      await fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to delete timetable slot.");
    }
  };

  if (loading) return <Loader label="Loading timetable..." />;

  const columns: Column<TimetableSlot>[] = [
    { header: "Day", accessor: (row) => <span className="font-bold text-gray-900 dark:text-white">{row.day}</span> },
    { header: "Time Slot", accessor: (row) => `${row.startTime} – ${row.endTime}` },
    { header: "Subject", accessor: (row) => row.subjectName || row.subjectCode },
    { header: "Faculty", accessor: (row) => row.facultyName || (typeof row.faculty === "object" ? row.faculty.name : row.faculty) },
    { header: "Room", accessor: (row) => <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{row.room}</span> },
    { header: "Type", accessor: (row) => <Badge variant={row.type === "Theory" ? "primary" : "warning"}>{row.type}</Badge> },
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
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Timetable Schedule Management</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">Schedule weekly lecture classes, lab slots, and room locations</p>
        </div>
        <Button icon={Plus} onClick={handleOpenCreate}>Add Timetable Slot</Button>
      </div>

      {error && <ErrorMessage message={error} />}

      <Table columns={columns} data={timetable} emptyMessage="No timetable slots configured." />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSlot ? "Edit Timetable Slot" : "Add Timetable Slot"}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 mb-1">Course</label>
              <select value={formData.course} onChange={(e) => setFormData({ ...formData, course: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-xs text-gray-900 dark:text-white" required>
                {courses.map((c) => (
                  <option key={c.id || c._id} value={c.id || c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 mb-1">Subject</label>
              <select value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-xs text-gray-900 dark:text-white" required>
                {subjects.map((sub) => (
                  <option key={sub.id || sub._id} value={sub.id || sub._id}>{sub.code} - {sub.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 mb-1">Faculty</label>
            <select value={formData.faculty} onChange={(e) => setFormData({ ...formData, faculty: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-xs text-gray-900 dark:text-white" required>
              {facultyList.map((f) => (
                <option key={f.id || f._id} value={f.id || f._id}>{f.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 mb-1">Day</label>
              <select value={formData.day} onChange={(e) => setFormData({ ...formData, day: e.target.value as any })} className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-xs text-gray-900 dark:text-white">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <Input label="Room Number" value={formData.room} onChange={(e) => setFormData({ ...formData, room: e.target.value })} placeholder="LH-101 / Lab-3" required />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input label="Start Time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} placeholder="09:00 AM" required />
            <Input label="End Time" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} placeholder="10:00 AM" required />
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 mb-1">Session Type</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as any })} className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-xs text-gray-900 dark:text-white">
                <option value="Theory">Theory</option>
                <option value="Lab">Lab</option>
                <option value="Tutorial">Tutorial</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={isSubmitting}>{editingSlot ? "Update Slot" : "Add Slot"}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal isOpen={Boolean(deletingId)} onClose={() => setDeletingId(null)} onConfirm={handleDelete} title="Delete Slot" message="Are you sure you want to delete this timetable slot?" />
    </div>
  );
};

export default CoordinatorTimetable;
