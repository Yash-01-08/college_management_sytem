import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { getDashboardRoute } from "./utils/navigation";

// Public Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Unauthorized from "./pages/Unauthorized";

// Routing Guards
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleProtectedRoute from "./routes/RoleProtectedRoute";

// Layouts
import StudentLayout from "./layouts/StudentLayout";
import FacultyLayout from "./layouts/FacultyLayout";
import CoordinatorLayout from "./layouts/CoordinatorLayout";
import AdminLayout from "./layouts/AdminLayout";

// Student Pages
import StudentDashboard from "./pages/student/Dashboard";
import StudentProfile from "./pages/student/Profile";
import StudentCourses from "./pages/student/Courses";
import StudentSubjects from "./pages/student/Subjects";
import StudentEnrollment from "./pages/student/Enrollment";
import StudentAttendance from "./pages/student/Attendance";
import StudentResults from "./pages/student/Results";
import StudentTimetable from "./pages/student/Timetable";
import StudentFees from "./pages/student/Fees";
import StudentEvents from "./pages/student/Events";
import StudentNotifications from "./pages/student/Notifications";

// Faculty Pages
import FacultyDashboard from "./pages/faculty/Dashboard";
import FacultyProfile from "./pages/faculty/Profile";
import FacultySubjects from "./pages/faculty/Subjects";
import FacultyStudents from "./pages/faculty/Students";
import FacultyAttendance from "./pages/faculty/Attendance";
import FacultyResults from "./pages/faculty/Results";
import FacultyTimetable from "./pages/faculty/Timetable";
import FacultyEvents from "./pages/faculty/Events";
import FacultyNotifications from "./pages/faculty/Notifications";

// Coordinator Pages
import CoordinatorDashboard from "./pages/coordinator/Dashboard";
import CoordinatorProfile from "./pages/coordinator/Profile";
import CoordinatorDepartments from "./pages/coordinator/Departments";
import CoordinatorCourses from "./pages/coordinator/Courses";
import CoordinatorSubjects from "./pages/coordinator/Subjects";
import CoordinatorEnrollments from "./pages/coordinator/Enrollments";
import CoordinatorAssignments from "./pages/coordinator/Assignments";
import CoordinatorStudents from "./pages/coordinator/Students";
import CoordinatorFaculty from "./pages/coordinator/Faculty";
import CoordinatorTimetable from "./pages/coordinator/Timetable";
import CoordinatorEvents from "./pages/coordinator/Events";
import CoordinatorNotifications from "./pages/coordinator/Notifications";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminDepartments from "./pages/admin/Departments";
import AdminCourses from "./pages/admin/Courses";
import AdminSubjects from "./pages/admin/Subjects";
import AdminEnrollments from "./pages/admin/Enrollments";
import AdminAssignments from "./pages/admin/FacultyAssignments";
import AdminAttendance from "./pages/admin/Attendance";
import AdminResults from "./pages/admin/Results";
import AdminTimetable from "./pages/admin/Timetable";
import AdminFees from "./pages/admin/Fees";
import AdminEvents from "./pages/admin/Events";
import AdminNotifications from "./pages/admin/Notifications";
import PageLoader from "./components/ui/Loader";

const RootRedirect: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader message="Verifying session credentials..." />;
  }

  if (isAuthenticated && user) {
    const target = getDashboardRoute(user.role);
    return <Navigate to={target} replace />;
  }

  return <Navigate to="/login" replace />;
};

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected Student Routes */}
      <Route
        path="/student/*"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={["student"]}>
              <StudentLayout />
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="courses" element={<StudentCourses />} />
        <Route path="subjects" element={<StudentSubjects />} />
        <Route path="enrollment" element={<StudentEnrollment />} />
        <Route path="attendance" element={<StudentAttendance />} />
        <Route path="results" element={<StudentResults />} />
        <Route path="timetable" element={<StudentTimetable />} />
        <Route path="fees" element={<StudentFees />} />
        <Route path="events" element={<StudentEvents />} />
        <Route path="notifications" element={<StudentNotifications />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Protected Faculty Routes */}
      <Route
        path="/faculty/*"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={["faculty"]}>
              <FacultyLayout />
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<FacultyDashboard />} />
        <Route path="profile" element={<FacultyProfile />} />
        <Route path="subjects" element={<FacultySubjects />} />
        <Route path="students" element={<FacultyStudents />} />
        <Route path="attendance" element={<FacultyAttendance />} />
        <Route path="results" element={<FacultyResults />} />
        <Route path="timetable" element={<FacultyTimetable />} />
        <Route path="events" element={<FacultyEvents />} />
        <Route path="notifications" element={<FacultyNotifications />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Protected Coordinator Routes */}
      <Route
        path="/coordinator/*"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={["coordinator"]}>
              <CoordinatorLayout />
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<CoordinatorDashboard />} />
        <Route path="profile" element={<CoordinatorProfile />} />
        <Route path="departments" element={<CoordinatorDepartments />} />
        <Route path="courses" element={<CoordinatorCourses />} />
        <Route path="subjects" element={<CoordinatorSubjects />} />
        <Route path="enrollments" element={<CoordinatorEnrollments />} />
        <Route path="assignments" element={<CoordinatorAssignments />} />
        <Route path="students" element={<CoordinatorStudents />} />
        <Route path="faculty" element={<CoordinatorFaculty />} />
        <Route path="timetable" element={<CoordinatorTimetable />} />
        <Route path="events" element={<CoordinatorEvents />} />
        <Route path="notifications" element={<CoordinatorNotifications />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="departments" element={<AdminDepartments />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="subjects" element={<AdminSubjects />} />
        <Route path="enrollments" element={<AdminEnrollments />} />
        <Route path="assignments" element={<AdminAssignments />} />
        <Route path="attendance" element={<AdminAttendance />} />
        <Route path="results" element={<AdminResults />} />
        <Route path="timetable" element={<AdminTimetable />} />
        <Route path="fees" element={<AdminFees />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Root & Fallback */}
      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
