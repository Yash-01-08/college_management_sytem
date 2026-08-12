import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getCoordinatorDepartments, getCoordinatorCourses, getCoordinatorSubjects, getCoordinatorStudents, getCoordinatorFaculty } from "../../services/coordinatorService";
import { Card } from "../../components/ui/Card";
import { Loader } from "../../components/ui/Loader";
import { Building2, GraduationCap, BookOpen, Users, UserCog, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export const CoordinatorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    departments: 0,
    courses: 0,
    subjects: 0,
    students: 0,
    faculty: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getCoordinatorDepartments(),
      getCoordinatorCourses(),
      getCoordinatorSubjects(),
      getCoordinatorStudents(),
      getCoordinatorFaculty(),
    ])
      .then(([depRes, crsRes, subRes, stuRes, facRes]) => {
        setStats({
          departments: depRes.data?.length || 0,
          courses: crsRes.data?.length || 0,
          subjects: subRes.data?.length || 0,
          students: stuRes.data?.length || 0,
          faculty: facRes.data?.length || 0,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading coordinator dashboard..." />;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/80 via-slate-900 to-indigo-950 border border-purple-500/20 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
              <span>Academic Coordinator Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name || "Coordinator"}!
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Oversee departments, degree courses, subject curricula, and assign faculty members.
            </p>
          </div>

          <Link
            to="/coordinator/assignments"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold shadow-lg shadow-purple-600/30 transition-all shrink-0"
          >
            <span>Assign Faculty</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase text-gray-500 dark:text-slate-400 block">Departments</span>
            <span className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1 block">{stats.departments}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Building2 className="w-5 h-5" />
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase text-gray-500 dark:text-slate-400 block">Courses</span>
            <span className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1 block">{stats.courses}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <GraduationCap className="w-5 h-5" />
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase text-gray-500 dark:text-slate-400 block">Subjects</span>
            <span className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1 block">{stats.subjects}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
            <BookOpen className="w-5 h-5" />
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase text-gray-500 dark:text-slate-400 block">Total Students</span>
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">{stats.students}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Users className="w-5 h-5" />
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase text-gray-500 dark:text-slate-400 block">Total Faculty</span>
            <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1 block">{stats.faculty}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <UserCog className="w-5 h-5" />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;
