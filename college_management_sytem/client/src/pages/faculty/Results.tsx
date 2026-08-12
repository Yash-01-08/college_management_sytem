import React, { useEffect, useState } from "react";
import { getFacultySubjects, getFacultyStudents, createFacultyResult } from "../../services/facultyService";
import { Subject, User } from "../../types";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Loader } from "../../components/ui/Loader";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { CheckCircle2, Award } from "lucide-react";

export const FacultyResults: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [semester, setSemester] = useState<number>(4);
  const [students, setStudents] = useState<User[]>([]);
  
  // Marks map: studentId -> { internal, external }
  const [marksMap, setMarksMap] = useState<Record<string, { internal: number; external: number }>>({});
  
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    getFacultySubjects()
      .then((res) => {
        const list = res.data || [];
        setSubjects(list);
        if (list.length > 0) {
          const firstId = list[0].id || list[0]._id || "";
          setSelectedSubjectId(firstId);
          setSemester(list[0].semester || 4);
          loadStudentsForSubject(firstId);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoadingSubjects(false));
  }, []);

  const loadStudentsForSubject = async (subjectId: string) => {
    try {
      setLoadingStudents(true);
      setError(null);
      setSuccessMsg(null);
      const res = await getFacultyStudents(subjectId);
      const list = res.data || [];
      setStudents(list);

      const initialMarks: Record<string, { internal: number; external: number }> = {};
      list.forEach((s) => {
        const sid = s.id || s._id || "";
        if (sid) initialMarks[sid] = { internal: 25, external: 55 };
      });
      setMarksMap(initialMarks);
    } catch (err: any) {
      setError(err.message || "Failed to load students for results entry.");
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    const sub = subjects.find((s) => (s.id || s._id) === subjectId);
    if (sub) setSemester(sub.semester || 4);
    loadStudentsForSubject(subjectId);
  };

  const handleMarkChange = (studentId: string, field: "internal" | "external", value: number) => {
    setMarksMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: Math.max(0, Math.min(field === "internal" ? 30 : 70, value)),
      },
    }));
  };

  const calculateGrade = (total: number) => {
    if (total >= 90) return { grade: "A+", point: 10, status: "Pass" };
    if (total >= 80) return { grade: "A", point: 9, status: "Pass" };
    if (total >= 70) return { grade: "B+", point: 8, status: "Pass" };
    if (total >= 60) return { grade: "B", point: 7, status: "Pass" };
    if (total >= 50) return { grade: "C", point: 6, status: "Pass" };
    if (total >= 40) return { grade: "P", point: 5, status: "Pass" };
    return { grade: "F", point: 0, status: "Fail" };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!selectedSubjectId) {
      setError("Please select a subject.");
      return;
    }

    try {
      setIsSubmitting(true);
      for (const [studentId, marks] of Object.entries(marksMap)) {
        await createFacultyResult({
          studentId,
          subjectId: selectedSubjectId,
          semester,
          internalMarks: marks.internal,
          externalMarks: marks.external,
        });
      }
      setSuccessMsg("Marks and grades published successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to publish examination results.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingSubjects) return <Loader label="Loading assigned subjects..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Enter Examination Results
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
          Input internal (max 30) and external (max 70) marks to compute final student grades
        </p>
      </div>

      {error && <ErrorMessage message={error} />}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Control Selector */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1.5">
              Select Assigned Subject
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {subjects.map((s) => (
                <option key={s.id || s._id} value={s.id || s._id}>
                  {s.code} - {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1.5">
              Semester
            </label>
            <input
              type="number"
              value={semester}
              readOnly
              className="w-full px-3.5 py-2.5 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-bold text-gray-700 dark:text-slate-300 cursor-not-allowed"
            />
          </div>
        </div>
      </Card>

      {/* Results Table Form */}
      {loadingStudents ? (
        <Loader label="Loading student roster..." />
      ) : students.length === 0 ? (
        <Card className="text-center p-8 text-xs text-gray-500">
          No students found for this subject.
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Card title={`Student Grade Roster (${students.length} Students)`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-800 text-xs font-semibold uppercase text-gray-400">
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Scholar No</th>
                    <th className="py-3 px-4">Internal (Max 30)</th>
                    <th className="py-3 px-4">External (Max 70)</th>
                    <th className="py-3 px-4 text-center">Total (100)</th>
                    <th className="py-3 px-4 text-center">Grade Preview</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800/80 text-xs">
                  {students.map((stu) => {
                    const sid = stu.id || stu._id || "";
                    const m = marksMap[sid] || { internal: 0, external: 0 };
                    const total = m.internal + m.external;
                    const gradeInfo = calculateGrade(total);

                    return (
                      <tr key={sid} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          {stu.name}
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-indigo-600 dark:text-indigo-400">
                          {stu.scholarNumber || "N/A"}
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            min={0}
                            max={30}
                            value={m.internal}
                            onChange={(e) => handleMarkChange(sid, "internal", Number(e.target.value))}
                            className="w-20 px-2.5 py-1.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
                            required
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            min={0}
                            max={70}
                            value={m.external}
                            onChange={(e) => handleMarkChange(sid, "external", Number(e.target.value))}
                            className="w-20 px-2.5 py-1.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
                            required
                          />
                        </td>
                        <td className="py-3 px-4 text-center font-extrabold text-gray-900 dark:text-white">
                          {total}
                        </td>
                        <td className="py-3 px-4 text-center font-bold">
                          <span
                            className={`px-2.5 py-1 rounded-md text-xs ${
                              gradeInfo.status === "Pass"
                                ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                                : "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                            }`}
                          >
                            {gradeInfo.grade} ({gradeInfo.point} pts)
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" loading={isSubmitting} icon={Award}>
              Save & Publish Grades
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default FacultyResults;
