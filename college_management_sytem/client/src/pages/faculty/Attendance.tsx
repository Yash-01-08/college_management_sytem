import React, { useEffect, useState } from "react";
import { getFacultySubjects, getFacultyStudents, createFacultyAttendance } from "../../services/facultyService";
import { Subject, User } from "../../types";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Loader } from "../../components/ui/Loader";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { CheckCircle2, ClipboardList, Calendar } from "lucide-react";

export const FacultyAttendance: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState<User[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, "Present" | "Absent" | "Late">>({});
  
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

      // Default all loaded students to "Present"
      const initialMap: Record<string, "Present" | "Absent" | "Late"> = {};
      list.forEach((s) => {
        const sid = s.id || s._id || "";
        if (sid) initialMap[sid] = "Present";
      });
      setAttendanceRecords(initialMap);
    } catch (err: any) {
      setError(err.message || "Failed to load students for attendance.");
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    loadStudentsForSubject(subjectId);
  };

  const handleStatusChange = (studentId: string, status: "Present" | "Absent" | "Late") => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!selectedSubjectId || !selectedDate) {
      setError("Please select a subject and date.");
      return;
    }

    const payloadRecords = Object.entries(attendanceRecords).map(([studentId, status]) => ({
      studentId,
      status,
    }));

    try {
      setIsSubmitting(true);
      await createFacultyAttendance({
        subjectId: selectedSubjectId,
        date: selectedDate,
        records: payloadRecords,
      });
      setSuccessMsg("Attendance submitted successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to submit attendance.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingSubjects) return <Loader label="Loading assigned subjects..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Mark Student Attendance
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
          Select assigned subject and date to record daily student attendance roster
        </p>
      </div>

      {error && <ErrorMessage message={error} />}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Selector Control Bar */}
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
                  {s.code} - {s.name} (Sem {s.semester})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1.5">
              Select Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Student Attendance List Form */}
      {loadingStudents ? (
        <Loader label="Loading student list..." />
      ) : students.length === 0 ? (
        <Card className="text-center p-8 text-xs text-gray-500">
          No students found for this subject.
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Card title={`Roster (${students.length} Students)`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-800 text-xs font-semibold uppercase text-gray-400">
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Scholar Number</th>
                    <th className="py-3 px-4 text-center">Attendance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800/80 text-xs">
                  {students.map((stu) => {
                    const sid = stu.id || stu._id || "";
                    const currentStatus = attendanceRecords[sid] || "Present";
                    return (
                      <tr key={sid} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-3.5 px-4 font-semibold text-gray-900 dark:text-white">
                          {stu.name}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-medium text-indigo-600 dark:text-indigo-400">
                          {stu.scholarNumber || "N/A"}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-2">
                            {(["Present", "Absent", "Late"] as const).map((st) => {
                              const isSelected = currentStatus === st;
                              return (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => handleStatusChange(sid, st)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    isSelected
                                      ? st === "Present"
                                        ? "bg-emerald-600 text-white shadow-sm"
                                        : st === "Absent"
                                        ? "bg-rose-600 text-white shadow-sm"
                                        : "bg-amber-600 text-white shadow-sm"
                                      : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700"
                                  }`}
                                >
                                  {st}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" loading={isSubmitting} icon={ClipboardList}>
              Submit Attendance Roster
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default FacultyAttendance;
