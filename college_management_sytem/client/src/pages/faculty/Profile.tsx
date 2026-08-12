import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getFacultyProfile } from "../../services/facultyService";
import { User } from "../../types";
import { Card } from "../../components/ui/Card";
import { Loader } from "../../components/ui/Loader";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { UserCheck, Mail, Phone, Building2, Briefcase, Award } from "lucide-react";

export const FacultyProfile: React.FC = () => {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(authUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getFacultyProfile()
      .then((res) => {
        if (res.data) setProfile(res.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading faculty profile..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Faculty Profile
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
          Academic rank, department assignment, and official employment details
        </p>
      </div>

      <Card className="relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100 dark:border-slate-800">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-cyan-400 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
            {profile?.name ? profile.name.charAt(0).toUpperCase() : "F"}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{profile?.name}</h2>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">{profile?.designation || "Faculty Member"}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{profile?.department || "Computer Science & Engineering"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 text-xs">
          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-slate-950/60 border border-gray-100 dark:border-slate-800 flex items-center gap-3">
            <UserCheck className="w-4 h-4 text-indigo-500 shrink-0" />
            <div>
              <span className="text-gray-400 block text-[10px]">Employee ID</span>
              <span className="font-mono font-bold text-gray-900 dark:text-white">{profile?.employeeId || "EMP-FAC-001"}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-slate-950/60 border border-gray-100 dark:border-slate-800 flex items-center gap-3">
            <Mail className="w-4 h-4 text-cyan-500 shrink-0" />
            <div>
              <span className="text-gray-400 block text-[10px]">Email Address</span>
              <span className="font-semibold text-gray-900 dark:text-white">{profile?.email}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-slate-950/60 border border-gray-100 dark:border-slate-800 flex items-center gap-3">
            <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
            <div>
              <span className="text-gray-400 block text-[10px]">Phone Number</span>
              <span className="font-semibold text-gray-900 dark:text-white">{profile?.phone || "+1 555-0188"}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-slate-950/60 border border-gray-100 dark:border-slate-800 flex items-center gap-3">
            <Award className="w-4 h-4 text-purple-500 shrink-0" />
            <div>
              <span className="text-gray-400 block text-[10px]">Qualification</span>
              <span className="font-semibold text-gray-900 dark:text-white">{profile?.qualification || "Ph.D. in Computer Science"}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FacultyProfile;
