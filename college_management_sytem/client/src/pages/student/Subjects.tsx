import React, { useEffect, useState } from "react";
import { getStudentSubjects } from "../../services/studentService";
import { Subject } from "../../types";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Loader } from "../../components/ui/Loader";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { EmptyState } from "../../components/ui/EmptyState";
import { BookOpen, Layers, Award } from "lucide-react";

export const StudentSubjects: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getStudentSubjects();
      setSubjects(res.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load subjects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  if (loading) return <Loader message="Loading registered subjects..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchSubjects} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Current Semester Subjects
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
          Theory, laboratory, and elective modules registered for your semester
        </p>
      </div>

      {subjects.length === 0 ? (
        <EmptyState
          title="No Subjects Found"
          description="There are no subjects registered for your current semester."
          icon={BookOpen}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {subjects.map((sub) => (
            <Card key={sub.id || sub._id} className="relative flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    {sub.code}
                  </span>
                  <Badge
                    variant={
                      sub.type === "Theory"
                        ? "primary"
                        : sub.type === "Lab"
                        ? "warning"
                        : "secondary"
                    }
                  >
                    {sub.type}
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                  {sub.name}
                </h3>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-gray-600 dark:text-slate-400">
                  <Award className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{sub.credits} Credits</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600 dark:text-slate-400 justify-end">
                  <Layers className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Sem {sub.semester}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentSubjects;
