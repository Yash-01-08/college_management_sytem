import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import { UserRole, User } from "../../types";
import { GraduationCap, CheckCircle2, AlertCircle, ArrowRight, User as UserIcon, Users, Shield } from "lucide-react";
import { AxiosError } from "axios";
import ThemeToggle from "../../components/ui/ThemeToggle";

export const Register: React.FC = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState<UserRole>("student");

  // Common Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Student Fields
  const [scholarNumber, setScholarNumber] = useState("");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [course, setCourse] = useState("B.Tech CSE");
  const [semester, setSemester] = useState(1);
  const [batch, setBatch] = useState("2024-2028");
  const [dateOfBirth, setDateOfBirth] = useState("");

  // Faculty / Coordinator Fields
  const [employeeId, setEmployeeId] = useState("");
  const [designation, setDesignation] = useState("Assistant Professor");
  const [qualification, setQualification] = useState("Ph.D.");

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<User | null>(null);

  const publicRoles: { value: UserRole; label: string; icon: React.ElementType }[] = [
    { value: "student", label: "Student", icon: UserIcon },
    { value: "faculty", label: "Faculty", icon: Users },
    { value: "coordinator", label: "Coordinator", icon: Shield },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Common validations
    if (!name.trim() || !email.trim() || !phone.trim() || !password || !confirmPassword) {
      setError("Please fill in all common required fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    let payload: any = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
      role,
    };

    if (role === "student") {
      if (!department || !course || !semester || !batch || !dateOfBirth) {
        setError("Please fill in all required student details.");
        return;
      }
      payload = {
        ...payload,
        scholarNumber: scholarNumber.trim() || undefined,
        department,
        course,
        semester: Number(semester),
        batch: batch.trim(),
        dateOfBirth,
      };
    } else if (role === "faculty") {
      if (!department) {
        setError("Please select a department.");
        return;
      }
      payload = {
        ...payload,
        employeeId: employeeId.trim() || undefined,
        department,
        designation,
        qualification,
      };
    } else if (role === "coordinator") {
      if (!department) {
        setError("Please select a department.");
        return;
      }
      payload = {
        ...payload,
        employeeId: employeeId.trim() || undefined,
        department,
      };
    }

    try {
      setIsSubmitting(true);
      const res = await registerUser(payload);
      const userObj = res.user || res.data?.user || ({ name, email, role } as User);
      setRegisteredUser(userObj);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>;
      if (axiosError.response) {
        setError(axiosError.response.data?.message || "Registration failed. Check form details.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to connect to backend server.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (registeredUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 flex flex-col justify-center items-center p-4 relative selection:bg-indigo-500 selection:text-white transition-colors duration-200">
        <div className="absolute top-4 right-4 z-20">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md bg-white dark:bg-slate-900/90 backdrop-blur-xl border border-gray-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-2xl text-center animate-fadeIn">
          <div className="inline-flex p-4 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Registration Submitted!</h2>
          <p className="text-gray-600 dark:text-slate-400 text-sm mb-6">
            Account for <span className="text-gray-900 dark:text-slate-200 font-semibold">{registeredUser.name}</span> ({registeredUser.role}) has been created successfully.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <span>Proceed to Login</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 flex flex-col justify-center items-center p-4 py-8 relative selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-2xl bg-white dark:bg-slate-900/90 backdrop-blur-xl border border-gray-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-2xl relative z-10 transition-all">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 shadow-lg shadow-indigo-500/25 mb-3">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">User Registration</h1>
          <p className="text-gray-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Register as a Student, Faculty, or Coordinator
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 flex items-start gap-3 text-rose-700 dark:text-rose-300 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Public Role Selector (Student, Faculty, Coordinator) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
              Select Registration Role
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 dark:bg-slate-950 rounded-xl border border-gray-200 dark:border-slate-800">
              {publicRoles.map((opt) => {
                const Icon = opt.icon;
                const isSelected = role === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRole(opt.value)}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
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

          {/* Common Fields Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-3.5 py-2 bg-gray-50 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@college.edu"
                className="w-full px-3.5 py-2 bg-gray-50 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full px-3.5 py-2 bg-gray-50 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 bg-gray-50 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 bg-gray-50 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm"
                required
              />
            </div>
          </div>

          {/* Dynamic Role-Specific Fields */}
          <div className="border-t border-gray-200 dark:border-slate-800 pt-4 mt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">
              {role.charAt(0).toUpperCase() + role.slice(1)} Specific Fields
            </h3>

            {role === "student" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1">
                    Scholar Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={scholarNumber}
                    onChange={(e) => setScholarNumber(e.target.value)}
                    placeholder="SCH2024-XXXX"
                    className="w-full px-3.5 py-2 bg-gray-50 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white text-sm"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1">
                    Course
                  </label>
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white text-sm"
                  >
                    <option value="B.Tech CSE">B.Tech CSE</option>
                    <option value="B.Tech IT">B.Tech IT</option>
                    <option value="BCA">BCA</option>
                    <option value="MCA">MCA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1">
                    Semester
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-gray-50 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white text-sm"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1">
                    Batch
                  </label>
                  <input
                    type="text"
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    placeholder="2024-2028"
                    className="w-full px-3.5 py-2 bg-gray-50 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white text-sm"
                    required
                  />
                </div>
              </div>
            )}

            {(role === "faculty" || role === "coordinator") && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1">
                    Employee ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="EMP-XXXX"
                    className="w-full px-3.5 py-2 bg-gray-50 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white text-sm"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                  </select>
                </div>

                {role === "faculty" && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1">
                        Designation
                      </label>
                      <input
                        type="text"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="Assistant Professor"
                        className="w-full px-3.5 py-2 bg-gray-50 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1">
                        Qualification
                      </label>
                      <input
                        type="text"
                        value={qualification}
                        onChange={(e) => setQualification(e.target.value)}
                        placeholder="Ph.D. / M.Tech"
                        className="w-full px-3.5 py-2 bg-gray-50 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white text-sm"
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 text-sm mt-4"
          >
            {isSubmitting ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <span>Register as {role.charAt(0).toUpperCase() + role.slice(1)}</span>
            )}
          </button>
        </form>

        <div className="mt-5 text-center border-t border-gray-100 dark:border-slate-800/80 pt-4">
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Already registered?{" "}
            <Link
              to="/login"
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold transition-colors"
            >
              Sign in to your account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
