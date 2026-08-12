import React, { useEffect, useState } from "react";
import { FacultyAssignment } from "../../types";
import { getAdminAssignments, createAdminAssignment, deleteAdminAssignment } from "../../services/adminService";
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
import { UserPlus, Plus, Trash2 } from "lucide-react";

export const FacultyAssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<FacultyAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [facultyName, setFacultyName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [courseName, setCourseName] = useState("B.Tech CSE");
  const [semester, setSemester] = useState(1);
  const [academicYear, setAcademicYear] = useState("2025-2026");
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<FacultyAssignment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminAssignments();
      if (res.data) setAssignments(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch faculty assignments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyName || !subjectName) return;
    try {
      setIsSaving(true);
      const res = await createAdminAssignment({ facultyName, subjectName, subjectCode, courseName, semester: Number(semester), academicYear });
      const newAsgn = res.data || ({ id: `as_${Date.now()}`, facultyName, subjectName, subjectCode, courseName, semester: Number(semester), academicYear } as FacultyAssignment);
      setAssignments((prev) => [newAsgn, ...prev]);
      setIsModalOpen(false);
      setFacultyName("");
      setSubjectName("");
      setSubjectCode("");
    } catch (err: any) {
      alert(err.message || "Failed to assign faculty.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await deleteAdminAssignment(deleteTarget.id || (deleteTarget as any)._id);
      setAssignments((prev) => prev.filter((a) => (a.id || (a as any)._id) !== (deleteTarget.id || (deleteTarget as any)._id)));
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err.message || "Failed to remove faculty assignment.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredAssignments = assignments.filter(
    (a) =>
      a.facultyName?.toLowerCase().includes(search.toLowerCase()) ||
      a.subjectName?.toLowerCase().includes(search.toLowerCase()) ||
      a.courseName?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader message="Loading faculty teaching assignments..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchAssignments} />;

  const columns = [
    {
      header: "Faculty Member",
      accessor: (a: FacultyAssignment) => (
        <div className="font-semibold text-gray-900 dark:text-white">{a.facultyName}</div>
      ),
    },
    {
      header: "Assigned Subject",
      accessor: (a: FacultyAssignment) => (
        <div>
          <div className="font-medium text-gray-800 dark:text-slate-200">{a.subjectName}</div>
          <Badge variant="indigo">{a.subjectCode}</Badge>
        </div>
      ),
    },
    {
      header: "Course & Semester",
      accessor: (a: FacultyAssignment) => `${a.courseName} • Sem ${a.semester}`,
    },
    {
      header: "Academic Year",
      accessor: (a: FacultyAssignment) => <Badge variant="cyan">{a.academicYear}</Badge>,
    },
    {
      header: "Actions",
      accessor: (a: FacultyAssignment) => (
        <Button variant="danger" size="sm" onClick={() => setDeleteTarget(a)} icon={Trash2}>
          Remove
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-indigo-500" />
            <span>Faculty Subject Assignments</span>
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Assign faculty instructors to courses and subject sections.
          </p>
        </div>

        <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
          Assign Faculty
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Search assignments..." className="w-full sm:w-72" />
      </div>

      {filteredAssignments.length === 0 ? (
        <EmptyState
          icon={UserPlus}
          title="No Assignments Found"
          description="Assign faculty members to subjects using the button above."
        />
      ) : (
        <Table columns={columns} data={filteredAssignments} />
      )}

      {/* Add Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Assign Faculty to Subject">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Faculty Name" value={facultyName} onChange={(e) => setFacultyName(e.target.value)} placeholder="e.g. Dr. Robert Smith" required />
          <Input label="Subject Name" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} placeholder="e.g. Data Structures" required />
          <Input label="Subject Code" value={subjectCode} onChange={(e) => setSubjectCode(e.target.value)} placeholder="e.g. CS401" required />
          <Input label="Course Name" value={courseName} onChange={(e) => setCourseName(e.target.value)} placeholder="e.g. B.Tech CSE" required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Semester" type="number" value={semester} onChange={(e) => setSemester(Number(e.target.value))} required />
            <Input label="Academic Year" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} placeholder="2025-2026" required />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} type="button">
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              Confirm Assignment
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
          title="Remove Assignment"
          message={`Are you sure you want to unassign ${deleteTarget.facultyName} from ${deleteTarget.subjectName}?`}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default FacultyAssignmentsPage;
