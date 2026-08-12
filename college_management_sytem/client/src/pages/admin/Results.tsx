import React, { useEffect, useState } from "react";
import { Result } from "../../types";
import { getAdminResults, createAdminResult, deleteAdminResult } from "../../services/adminService";
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
import { Award, Plus, Trash2 } from "lucide-react";

export const ResultsPage: React.FC = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [scholarNumber, setScholarNumber] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [semester, setSemester] = useState(1);
  const [internalMarks, setInternalMarks] = useState(25);
  const [externalMarks, setExternalMarks] = useState(60);
  const [grade, setGrade] = useState("A");
  const [status, setStatus] = useState<"Pass" | "Fail">("Pass");
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Result | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminResults();
      if (res.data) setResults(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch exam results.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !subjectName) return;
    try {
      setIsSaving(true);
      const total = Number(internalMarks) + Number(externalMarks);
      const res = await createAdminResult({
        studentName,
        scholarNumber,
        subjectName,
        subjectCode,
        semester: Number(semester),
        internalMarks: Number(internalMarks),
        externalMarks: Number(externalMarks),
        totalMarks: total,
        grade,
        status,
      });
      const newRes = res.data || ({
        id: `r_${Date.now()}`,
        studentName,
        scholarNumber,
        subjectName,
        subjectCode,
        semester: Number(semester),
        internalMarks: Number(internalMarks),
        externalMarks: Number(externalMarks),
        totalMarks: total,
        grade,
        status,
      } as Result);

      setResults((prev) => [newRes, ...prev]);
      setIsModalOpen(false);
      setStudentName("");
      setScholarNumber("");
    } catch (err: any) {
      alert(err.message || "Failed to add examination result.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await deleteAdminResult(deleteTarget.id || (deleteTarget as any)._id);
      setResults((prev) => prev.filter((r) => (r.id || (r as any)._id) !== (deleteTarget.id || (deleteTarget as any)._id)));
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete result.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredResults = results.filter(
    (r) =>
      r.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      r.scholarNumber?.toLowerCase().includes(search.toLowerCase()) ||
      r.subjectName?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader message="Loading exam results & grades..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchResults} />;

  const columns = [
    {
      header: "Student",
      accessor: (r: Result) => (
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{r.studentName}</div>
          <div className="text-xs text-gray-500 dark:text-slate-400">Scholar #: {r.scholarNumber}</div>
        </div>
      ),
    },
    {
      header: "Subject",
      accessor: (r: Result) => (
        <div>
          <div className="font-medium text-gray-800 dark:text-slate-200">{r.subjectName}</div>
          <Badge variant="indigo">{r.subjectCode}</Badge>
        </div>
      ),
    },
    {
      header: "Marks (Int + Ext)",
      accessor: (r: Result) => `${r.internalMarks} + ${r.externalMarks} = ${r.totalMarks}`,
    },
    {
      header: "Grade / Status",
      accessor: (r: Result) => (
        <div className="flex items-center gap-2">
          <Badge variant="emerald">{r.grade}</Badge>
          <Badge variant={r.status === "Pass" ? "emerald" : "rose"}>{r.status}</Badge>
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: (r: Result) => (
        <Button variant="danger" size="sm" onClick={() => setDeleteTarget(r)} icon={Trash2}>
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
            <Award className="w-6 h-6 text-indigo-500" />
            <span>Academic Examination Results</span>
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Record and manage student grades, internal marks, and exam outcomes.
          </p>
        </div>

        <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
          Add Result
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Search results..." className="w-full sm:w-72" />
      </div>

      {filteredResults.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No Results Found"
          description="Record student marks using the button above."
        />
      ) : (
        <Table columns={columns} data={filteredResults} />
      )}

      {/* Add Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Student Grade Result">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Student Name" value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Alex Johnson" required />
          <Input label="Scholar Number" value={scholarNumber} onChange={(e) => setScholarNumber(e.target.value)} placeholder="SCH2024-0089" required />
          <Input label="Subject Name" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} placeholder="Data Structures" required />
          <Input label="Subject Code" value={subjectCode} onChange={(e) => setSubjectCode(e.target.value)} placeholder="CS401" required />
          <div className="grid grid-cols-3 gap-3">
            <Input label="Internal Marks" type="number" value={internalMarks} onChange={(e) => setInternalMarks(Number(e.target.value))} required />
            <Input label="External Marks" type="number" value={externalMarks} onChange={(e) => setExternalMarks(Number(e.target.value))} required />
            <Input label="Grade" value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="A+" required />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} type="button">
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              Save Result
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
          title="Delete Result Record"
          message={`Are you sure you want to delete result for ${deleteTarget.studentName}?`}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default ResultsPage;
