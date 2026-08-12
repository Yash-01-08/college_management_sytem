import React, { useEffect, useState } from "react";
import { TimetableSlot } from "../../types";
import { getAdminTimetable, createAdminTimetable, deleteAdminTimetable } from "../../services/adminService";
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
import { Calendar, Plus, Trash2 } from "lucide-react";

export const TimetablePage: React.FC = () => {
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseName, setCourseName] = useState("B.Tech CSE");
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [facultyName, setFacultyName] = useState("");
  const [day, setDay] = useState<"Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday">("Monday");
  const [startTime, setStartTime] = useState("09:00 AM");
  const [endTime, setEndTime] = useState("10:00 AM");
  const [room, setRoom] = useState("LH-101");
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<TimetableSlot | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminTimetable();
      if (res.data) setSlots(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch timetable slots.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName || !facultyName) return;
    try {
      setIsSaving(true);
      const res = await createAdminTimetable({
        courseName,
        subjectName,
        subjectCode,
        facultyName,
        day,
        startTime,
        endTime,
        room,
        semester: 4,
        type: "Theory",
      });
      const newSlot = res.data || ({
        id: `t_${Date.now()}`,
        courseName,
        subjectName,
        subjectCode,
        facultyName,
        day,
        startTime,
        endTime,
        room,
        semester: 4,
        type: "Theory",
      } as TimetableSlot);

      setSlots((prev) => [newSlot, ...prev]);
      setIsModalOpen(false);
      setSubjectName("");
      setFacultyName("");
    } catch (err: any) {
      alert(err.message || "Failed to schedule timetable slot.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await deleteAdminTimetable(deleteTarget.id || (deleteTarget as any)._id);
      setSlots((prev) => prev.filter((s) => (s.id || (s as any)._id) !== (deleteTarget.id || (deleteTarget as any)._id)));
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete slot.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredSlots = slots.filter(
    (s) =>
      s.subjectName?.toLowerCase().includes(search.toLowerCase()) ||
      s.facultyName?.toLowerCase().includes(search.toLowerCase()) ||
      s.day?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader message="Loading class timetables..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchTimetable} />;

  const columns = [
    {
      header: "Day & Time",
      accessor: (s: TimetableSlot) => (
        <div>
          <div className="font-semibold text-indigo-600 dark:text-indigo-400">{s.day}</div>
          <div className="text-xs text-gray-500 dark:text-slate-400">{s.startTime} - {s.endTime}</div>
        </div>
      ),
    },
    {
      header: "Subject & Room",
      accessor: (s: TimetableSlot) => (
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{s.subjectName}</div>
          <div className="text-xs text-gray-500 dark:text-slate-400">Room: {s.room}</div>
        </div>
      ),
    },
    {
      header: "Faculty Instructor",
      accessor: (s: TimetableSlot) => s.facultyName,
    },
    {
      header: "Course",
      accessor: (s: TimetableSlot) => <Badge variant="cyan">{s.courseName}</Badge>,
    },
    {
      header: "Actions",
      accessor: (s: TimetableSlot) => (
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
            <Calendar className="w-6 h-6 text-indigo-500" />
            <span>Class Timetable & Schedules</span>
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Master scheduling for lectures, labs, and classroom allocations.
          </p>
        </div>

        <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
          Add Class Slot
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Search schedule..." className="w-full sm:w-72" />
      </div>

      {filteredSlots.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No Class Slots Scheduled"
          description="Create your first class schedule using the button above."
        />
      ) : (
        <Table columns={columns} data={filteredSlots} />
      )}

      {/* Add Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Timetable Slot">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Subject Name" value={subjectName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubjectName(e.target.value)} placeholder="Data Structures" required />
          <Input label="Subject Code" value={subjectCode} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubjectCode(e.target.value)} placeholder="CS401" required />
          <Input label="Faculty Instructor" value={facultyName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFacultyName(e.target.value)} placeholder="Dr. Robert Smith" required />
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 mb-1">Day</label>
              <select value={day} onChange={(e) => setDay(e.target.value as any)} className="w-full px-3.5 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white text-sm">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <Input label="Start Time" value={startTime} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartTime(e.target.value)} placeholder="09:00 AM" required />
            <Input label="End Time" value={endTime} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndTime(e.target.value)} placeholder="10:00 AM" required />
          </div>
          <Input label="Classroom / Hall" value={room} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRoom(e.target.value)} placeholder="LH-101" required />

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} type="button">
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              Schedule Slot
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
          title="Delete Schedule Slot"
          message={`Are you sure you want to delete ${deleteTarget.subjectName} on ${deleteTarget.day}?`}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default TimetablePage;
