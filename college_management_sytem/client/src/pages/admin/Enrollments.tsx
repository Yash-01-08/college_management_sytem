import React, { useEffect, useState } from "react";
import { Enrollment } from "../../types";
import { getAdminEnrollments, createAdminEnrollment, deleteAdminEnrollment } from "../../services/adminService";
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
import { UserCheck, Plus, Trash2 } from "lucide-react";

export const EnrollmentsPage: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [scholarNumber, setScholarNumber] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [semester, setSemester] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Enrollment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminEnrollments();
      if (res.data) setEnrollments(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch enrollments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !subjectName) return;
    try {
      setIsSaving(true);
      const res = await createAdminEnrollment({ studentName, scholarNumber, subjectName, subjectCode, semester: Number(semester), status: "Active" });
      const newEnr = res.data || ({ id: `e_${Date.now()}`, studentName, scholarNumber, subjectName, subjectCode, semester: Number(semester), status: "Active" } as Enrollment);
      setEnrollments((prev) => [newEnr, ...prev]);
      setIsModalOpen(false);
      setStudentName("");
      setScholarNumber("");
      setSubjectName("");
      setSubjectCode("");
    } catch (err: any) {
      alert(err.message || "Failed to create enrollment.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await deleteAdminEnrollment(deleteTarget.id || (deleteTarget as any)._id);
      setEnrollments((prev) => prev.filter((e) => (e.id || (e as any)._id) !== (deleteTarget.id || (deleteTarget as any)._id)));
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete enrollment.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredEnrollments = enrollments.filter(
    (e) =>
      e.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      e.subjectName?.toLowerCase().includes(search.toLowerCase()) ||
      e.scholarNumber?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader message="Loading student subject enrollments..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchEnrollments} />;

  const columns = [
    {
      header: "Student",
      accessor: (e: Enrollment) => (
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{e.studentName}</div>
          <div className="text-xs text-gray-500 dark:text-slate-400">Scholar #: {e.scholarNumber || "N/A"}</div>
        </div>
      ),
    },
    {
      header: "Enrolled Subject",
      accessor: (e: Enrollment) => (
        <div>
          <div className="font-medium text-gray-800 dark:text-slate-200">{e.subjectName}</div>
          <Badge variant="indigo">{e.subjectCode}</Badge>
        </div>
      ),
    },
    {
      header: "Semester",
      accessor: (e: Enrollment) => `Semester ${e.semester}`,
    },
    {
      header: "Status",
      accessor: (e: Enrollment) => <Badge variant="emerald">{e.status || "Active"}</Badge>,
    },
    {
      header: "Actions",
      accessor: (e: Enrollment) => (
        <Button variant="danger" size="sm" onClick={() => setDeleteTarget(e)} icon={Trash2}>
          Drop / Revoke
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-indigo-500" />
            <span>Subject Enrollments</span>
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Enroll students into specific subject modules.
          </p>
        </div>

        <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
          Enroll Student
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Search enrollments..." className="w-full sm:w-72" />
      </div>

      {filteredEnrollments.length === 0 ? (
        <EmptyState
          icon={UserCheck}
          title="No Enrollments Found"
          description="Create student enrollments using the button above."
        />
      ) : (
        <Table columns={columns} data={filteredEnrollments} />
      )}

      {/* Add Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Enroll Student to Subject">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Student Name" value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="e.g. Alex Johnson" required />
          <Input label="Scholar Number" value={scholarNumber} onChange={(e) => setScholarNumber(e.target.value)} placeholder="e.g. SCH2024-0089" required />
          <Input label="Subject Name" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} placeholder="e.g. Data Structures" required />
          <Input label="Subject Code" value={subjectCode} onChange={(e) => setSubjectCode(e.target.value)} placeholder="e.g. CS401" required />
          <Input label="Semester" type="number" value={semester} onChange={(e) => setSemester(Number(e.target.value))} required />

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} type="button">
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              Confirm Enrollment
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
          title="Revoke Enrollment"
          message={`Are you sure you want to drop enrollment for ${deleteTarget.studentName} in ${deleteTarget.subjectName}?`}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default EnrollmentsPage;
