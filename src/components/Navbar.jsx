import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { HelpCircle } from 'lucide-react';

export default function Navbar({ onHelpClick }) {
  const { user, logoutUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span style={{ color: 'var(--accent-primary)' }}>Fatra</span> Academy
        </Link>
        <div className="navbar-links">
          <Link to="/courses">Courses</Link>
          <Link to="/#live">Live Classes</Link>
          {user ? (
            <>
              {user.role === 'STUDENT' && <Link to="/my-enrollments">My Enrollments</Link>}
              {user.role === 'INSTRUCTOR' && (
                <>
                  <Link to="/my-courses">My Courses</Link>
                  <Link to="/revenue">Revenue</Link>
                </>
              )}
              {user.role === 'ADMIN' && <Link to="/admin">Admin Dashboard</Link>}
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
          <button 
            onClick={onHelpClick}
            className="btn btn-sm btn-secondary"
            style={{ 
              borderRadius: 'var(--radius-full)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.4rem',
              background: 'var(--surface-hover)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)'
            }}
          >
            <HelpCircle size={16} />
            <span>Help</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
