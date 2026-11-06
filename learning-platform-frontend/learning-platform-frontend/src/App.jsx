import { Navigate, Route, Routes, Outlet } from "react-router-dom";

import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import TeachOnLearnHub from "./pages/TeachOnLearnHub";

// Instructor components
import InstructorLayout from "./components/instructor/InstructorLayout";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import MyCourses from "./pages/instructor/MyCourses";
import CreateCourse from "./pages/instructor/CreateCourse";
import EditCourse from "./pages/instructor/EditCourse";
import ManageLessons from "./pages/instructor/ManageLessons";
import InstructorLearners from "./pages/instructor/InstructorLearners";

// Learner components
import CourseCatalogue from "./pages/learner/CourseCatalogue";
import LearnerDashboard from "./pages/learner/LearnerDashboard";
import CourseDetails from "./pages/learner/CourseDetails";
import LearningPlayer from "./pages/learner/LearningPlayer";

import MyCertificates from "./pages/learner/MyCertificates";
import VerifyCertificate from "./pages/VerifyCertificate";

// Admin components
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminEnrollments from "./pages/admin/AdminEnrollments";
import AdminCertificates from "./pages/admin/AdminCertificates";
import AdminAuditLogs from "./pages/admin/AdminAuditLogs";
import AdminSettings from "./pages/admin/AdminSettings";
import InstructorApplications from "./pages/admin/InstructorApplications";

// Protect instructor routes
function InstructorRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const hasInstructorAccess =
    user.role === "INSTRUCTOR" || user.role === "ADMIN";

  if (!hasInstructorAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

// Protect learner routes
function LearnerRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  if (user.role === "INSTRUCTOR") {
    return <Navigate to="/instructor" replace />;
  }

  if (user.role !== "LEARNER") {
    return <Navigate to="/courses" replace />;
  }

  return <Outlet />;
}

function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "ADMIN") {
    if (user.role === "INSTRUCTOR") {
      return <Navigate to="/instructor" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

// Redirect users based on login status and role
function HomeRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Loading LearnHub...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/courses" replace />;
  }

  if (user.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  if (user.role === "INSTRUCTOR") {
    return <Navigate to="/instructor" replace />;
  }
  if (user.role === "LEARNER") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/courses" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<HomeRedirect />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Public routes */}
      <Route path="/courses" element={<CourseCatalogue />} />
      <Route path="/courses/:courseId" element={<CourseDetails />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/teach" element={<TeachOnLearnHub />} />

      <Route path="/verify-certificate" element={<VerifyCertificate />} />
      {/* Protected learner routes */}
      <Route element={<LearnerRoute />}>
        <Route path="/dashboard" element={<LearnerDashboard />} />
        <Route path="/learn/:courseId" element={<LearningPlayer />} />
        <Route path="/certificates" element={<MyCertificates />} />
      </Route>

      {/* Protected instructor routes */}
      <Route element={<InstructorRoute />}>
        <Route path="/instructor" element={<InstructorLayout />}>
          <Route index element={<InstructorDashboard />} />

          <Route path="courses" element={<MyCourses />} />

          <Route path="courses/create" element={<CreateCourse />} />

          <Route path="courses/:courseId/edit" element={<EditCourse />} />

          <Route path="courses/:courseId/lessons" element={<ManageLessons />} />
          <Route path="learners" element={<InstructorLearners />} />
        </Route>
      </Route>

      {/* Protected admin routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="enrollments" element={<AdminEnrollments />} />
          <Route path="certificates" element={<AdminCertificates />} />
          <Route path="audit-logs" element={<AdminAuditLogs />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route
            path="instructor-applications"
            element={<InstructorApplications />}
          />
        </Route>
      </Route>

      {/* Unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
