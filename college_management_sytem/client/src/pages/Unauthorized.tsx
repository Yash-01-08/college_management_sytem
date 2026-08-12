import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getDashboardRoute } from "../utils/navigation";
import ThemeToggle from "../components/ui/ThemeToggle";

export const Unauthorized: React.FC = () => {
  const { user } = useAuth();
  const dashboardRoute = getDashboardRoute(user?.role);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 flex flex-col justify-center items-center p-4 relative transition-colors duration-200">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl dark:shadow-2xl text-center">
        <div className="inline-flex p-4 rounded-full bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 mb-4">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">403 - Unauthorized Access</h1>
        <p className="text-gray-600 dark:text-slate-400 text-sm mb-6">
          You do not have permission to view this page. Access is restricted based on your assigned user role.
        </p>

        <Link
          to={dashboardRoute}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-md shadow-indigo-600/20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
