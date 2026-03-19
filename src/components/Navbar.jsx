import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">LearnPlatform</Link>
        <div className="navbar-links">
          <Link to="/courses">Courses</Link>
          {user ? (
            <>
              {user.role === 'STUDENT' && <Link to="/my-enrollments">My Enrollments</Link>}
              {user.role === 'INSTRUCTOR' && <Link to="/my-courses">My Courses</Link>}
              {user.role === 'ADMIN' && <Link to="/admin/users">Manage Users</Link>}
              <Link to="/profile">Profile</Link>
              <button onClick={logoutUser}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="nav-accent">Get Started</Link>
            </>
          )}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
}
