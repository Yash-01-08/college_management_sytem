import React, { useEffect, useState } from "react";
import { getStudentEnrollments, createStudentEnrollment, getStudentSubjects } from "../../services/studentService";
import { Enrollment, Subject } from "../../types";
import { Table, Column } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Loader } from "../../components/ui/Loader";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { EmptyState } from "../../components/ui/EmptyState";
import { UserCheck, Plus, CheckCircle2 } from "lucide-react";

export const StudentEnrollment: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [enrollRes, subRes] = await Promise.all([
        getStudentEnrollments(),
        getStudentSubjects(),
      ]);
      setEnrollments(enrollRes.data || []);
      setAvailableSubjects(subRes.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load enrollments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEnroll = async (subjectId: string) => {
    try {
      setEnrollingId(subjectId);
      setError(null);
      setSuccessMsg(null);
      await createStudentEnrollment({ subjectId });
      setSuccessMsg("Successfully requested enrollment!");
      await fetchData();
    } catch (err: any) {
      setError(err.message || "Enrollment failed. Duplicate enrollment is not allowed.");
    } finally {
      setEnrollingId(null);
    }
  };

  if (loading) return <Loader message="Loading enrollment status..." />;

  const enrolledCodes = new Set(
    enrollments.map((e) => e.subjectCode || (typeof e.subject === "object" ? e.subject.code : ""))
  );

  const columns: Column<Enrollment>[] = [
    {
      header: "Subject Code",
      accessor: (row) => row.subjectCode || (typeof row.subject === "object" ? row.subject.code : "N/A"),
    },
    {
      header: "Subject Name",
      accessor: (row) => row.subjectName || (typeof row.subject === "object" ? row.subject.name : "N/A"),
    },
    {
      header: "Semester",
      accessor: (row) => `Sem ${row.semester || 4}`,
    },
    {
      header: "Status",
      accessor: (row) => (
        <Badge
          variant={
            row.status === "Active"
              ? "success"
              : row.status === "Completed"
              ? "primary"
              : "danger"
          }
        >
          {row.status}
        </Badge>
      ),
    },
    {
      header: "Enrolled Date",
      accessor: (row) => (row.enrolledAt ? new Date(row.enrolledAt).toLocaleDateString() : "Recent"),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Subject Enrollments
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
          View active course enrollments and enroll in available semester modules
        </p>
      </div>

      {error && <ErrorMessage message={error} />}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Active Enrollments */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-indigo-500" />
          <span>Current Active Enrollments</span>
        </h2>
        <Table columns={columns} data={enrollments} emptyMessage="No active enrollments found." />
      </div>

      {/* Available Subjects for Enrollment */}
      <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-slate-800">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">
          Available Subjects for Registration
        </h2>
        {availableSubjects.length === 0 ? (
          <EmptyState title="No Available Subjects" description="All eligible subjects are already enrolled." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableSubjects.map((sub) => {
              const isAlreadyEnrolled = enrolledCodes.has(sub.code);
              const subId = sub.id || sub._id || "";
              return (
                <div
                  key={subId}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {sub.code}
                      </span>
                      <span className="text-[11px] text-gray-400">({sub.credits} Credits)</span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{sub.name}</h4>
                  </div>

                  {isAlreadyEnrolled ? (
                    <Badge variant="success">Enrolled</Badge>
                  ) : (
                    <Button
                      size="sm"
                      isLoading={enrollingId === subId}
                      onClick={() => handleEnroll(subId)}
                      icon={Plus}
                    >
                      Enroll
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentEnrollment;
