import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { GraduationCap, Eye, EyeOff, LogIn, AlertCircle, Shield, User as UserIcon, Users, ShieldAlert } from "lucide-react";
import { AxiosError } from "axios";
import { UserRole } from "../../types";
import { getDashboardRoute } from "../../utils/navigation";
import ThemeToggle from "../../components/ui/ThemeToggle";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect immediately to target dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      const targetRoute = getDashboardRoute(user.role);
      navigate(targetRoute, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const roleOptions: { value: UserRole; label: string; icon: React.ElementType }[] = [
    { value: "student", label: "Student", icon: UserIcon },
    { value: "faculty", label: "Faculty", icon: Users },
    { value: "coordinator", label: "Coordinator", icon: Shield },
    { value: "admin", label: "Admin", icon: ShieldAlert },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Please fill in login ID and password.");
      return;
    }

    try {
      setIsSubmitting(true);
      const loggedUser = await login({ email: email.trim(), password, role });
      const targetRoute = getDashboardRoute(loggedUser.role || role);
      navigate(targetRoute, { replace: true });
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>;
      if (axiosError.response) {
        setError(axiosError.response.data?.message || "Invalid credentials or role mismatch.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to connect to backend server. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 flex flex-col justify-center items-center p-4 relative selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Top Navbar / ThemeToggle Bar */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Background Glow Accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Card Container */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900/90 backdrop-blur-xl border border-gray-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-2xl dark:shadow-indigo-950/40 relative z-10 transition-all">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 shadow-lg shadow-indigo-500/25 mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            College Management System
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Sign in to access your portal dashboard
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 flex items-start gap-3 text-rose-700 dark:text-rose-300 text-xs sm:text-sm animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection Tabs */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
              Select Role
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-gray-100 dark:bg-slate-950 rounded-xl border border-gray-200 dark:border-slate-800">
              {roleOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = role === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRole(opt.value)}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm font-semibold"
                        : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Identifier (Phone / Scholar Number / Email) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1.5">
              Phone / Scholar Number / Email
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Phone number, Scholar number, or Email"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-2.5 pr-12 bg-gray-50 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 transition-colors p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-2 text-sm"
          >
            {isSubmitting ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Log In as {role.charAt(0).toUpperCase() + role.slice(1)}</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center border-t border-gray-100 dark:border-slate-800/80 pt-4">
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Need an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold transition-colors"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
