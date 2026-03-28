import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import FatraAIChat from './components/FatraAIChat';
import { HelpCircle } from 'lucide-react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import MyEnrollmentsPage from './pages/MyEnrollmentsPage';
import ProfilePage from './pages/ProfilePage';
import MyCoursesPage from './pages/MyCoursesPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CourseEditorPage from './pages/CourseEditorPage';
import LessonEditorPage from './pages/LessonEditorPage';
import LessonViewPage from './pages/LessonViewPage';
import InstructorRevenuePage from './pages/InstructorRevenuePage';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/courses/:id" element={<CourseDetailPage />} />
      <Route
        path="/my-enrollments"
        element={<ProtectedRoute allowedRoles={['STUDENT']}><MyEnrollmentsPage /></ProtectedRoute>}
      />
      <Route
        path="/profile"
        element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
      />
      <Route
        path="/my-courses"
        element={<ProtectedRoute allowedRoles={['INSTRUCTOR']}><MyCoursesPage /></ProtectedRoute>}
      />
      <Route
        path="/revenue"
        element={<ProtectedRoute allowedRoles={['INSTRUCTOR']}><InstructorRevenuePage /></ProtectedRoute>}
      />
      <Route
        path="/admin"
        element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboardPage /></ProtectedRoute>}
      />
      {/* Legacy redirect kept for any bookmarks */}
      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboardPage /></ProtectedRoute>} />
      <Route
        path="/editor/courses/:id"
        element={<ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}><CourseEditorPage /></ProtectedRoute>}
      />
      <Route
        path="/editor/lessons/:id"
        element={<ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}><LessonEditorPage /></ProtectedRoute>}
      />
      <Route
        path="/learning/:courseId/lessons/:lessonId"
        element={<ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}><LessonViewPage /></ProtectedRoute>}
      />
    </Routes>
  );
}

function LayoutWrapper() {
  const location = useLocation();
  const isDashboard = ['/admin', '/admin/users', '/my-courses', '/revenue', '/my-enrollments', '/profile'].includes(location.pathname);

  const openHelp = () => {
    window.dispatchEvent(new CustomEvent('open-fatra-ai'));
  };

  return (
    <div className="app-container">
      {!isDashboard && <Navbar onHelpClick={openHelp} />}
      <main className="main-content">
        <AppRoutes />
      </main>
      <FatraAIChat />
      {!isDashboard && (
        <footer className="app-footer">
          © 2026 Fatra Academy — Full-Stack Django & React Learning Platform
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <LayoutWrapper />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
