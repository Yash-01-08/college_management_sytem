import React, { useEffect, useState } from "react";
import { getStudentCourses } from "../../services/studentService";
import { Course } from "../../types";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Loader } from "../../components/ui/Loader";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { EmptyState } from "../../components/ui/EmptyState";
import { BookOpen, GraduationCap, Building2, Calendar } from "lucide-react";

export const StudentCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getStudentCourses();
      setCourses(res.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load course details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) return <Loader label="Loading enrolled courses..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchCourses} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          My Academic Program
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
          Detailed overview of your current degree and course structure
        </p>
      </div>

      {courses.length === 0 ? (
        <EmptyState
          title="No Course Enrolled"
          description="You are currently not enrolled in any registered course."
          icon={GraduationCap}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <Card key={course.id || course._id} className="relative overflow-hidden">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                      {course.name}
                    </h3>
                    <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                      {course.code}
                    </span>
                  </div>
                </div>
                <Badge variant={course.status === "Active" ? "success" : "neutral"}>
                  {course.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 dark:border-slate-800/80 text-xs">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <span className="text-gray-400 block text-[10px]">Department</span>
                    <span className="font-semibold text-gray-800 dark:text-slate-200">
                      {typeof course.department === "object" ? course.department.name : course.department}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <span className="text-gray-400 block text-[10px]">Duration</span>
                    <span className="font-semibold text-gray-800 dark:text-slate-200">
                      {course.duration} Years ({course.totalSemesters} Semesters)
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentCourses;
