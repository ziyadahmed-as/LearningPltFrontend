import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Users, CheckCircle, Layers, 
  BookOpen, DollarSign, UserCircle, LogOut 
} from 'lucide-react';

export default function DashboardLayout({ 
  children, 
  title, 
  subtitle, 
  tabs = null, 
  activeTab = null, 
  onTabChange = null 
}) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Default menu configuration based on role
  // This is used if no local 'tabs' are provided
  const getRoleMenu = () => {
    switch (user?.role) {
      case 'ADMIN':
        return []; // We handle Admin purely via local tabs currently
      case 'INSTRUCTOR':
        return [
          { id: 'my-courses', label: 'My Courses', icon: BookOpen, path: '/my-courses' },
          { id: 'revenue', label: 'Revenue & Stats', icon: DollarSign, path: '/revenue' },
        ];
      case 'STUDENT':
        return [
          { id: 'enrollments', label: 'My Enrollments', icon: BookOpen, path: '/my-enrollments' },
        ];
      default:
        return [];
    }
  };

  const navItems = tabs || getRoleMenu();

  return (
    <div className="dashboard-layout fade-in">
      <aside className="dashboard-sidebar">
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1.5rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent-primary)', letterSpacing: '-0.03em' }}>
            Fatra <span style={{ color: 'var(--text-primary)' }}>OS</span>
          </h2>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.2rem' }}>
            {user?.role} Portal
          </p>
        </div>
        
        <nav style={{ padding: '0 0.75rem', flex: 1 }}>
          {navItems.map(item => {
            const isActive = tabs ? activeTab === item.id : location.pathname === item.path;
            const Icon = item.icon;
            
            const content = (
              <>
                {Icon && <Icon size={18} />}
                <span>{item.label}</span>
              </>
            );

            if (tabs) {
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`dashboard-sidebar-item ${isActive ? 'active' : ''}`}
                >
                  {content}
                </button>
              );
            }

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`dashboard-sidebar-item ${isActive ? 'active' : ''}`}
              >
                {content}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-subtle)', marginTop: 'auto' }}>
          <Link to="/profile" className={`dashboard-sidebar-item ${location.pathname === '/profile' ? 'active' : ''}`}>
            <UserCircle size={18} />
            <span>Profile Settings</span>
          </Link>
          <button onClick={handleLogout} className="dashboard-sidebar-item" style={{ color: 'var(--error)' }}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="dashboard-main-content">
        {(title || subtitle) && (
          <header style={{ 
            marginBottom: '2rem', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-end',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '1rem'
          }}>
            <div>
              <h1 className="page-title" style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>{title}</h1>
              {subtitle && <p className="page-subtitle" style={{ fontSize: '0.85rem' }}>{subtitle}</p>}
            </div>
            
            {user?.role === 'ADMIN' && (
              <div style={{ 
                display: 'flex', alignItems: 'center', gap: '0.5rem', 
                background: 'var(--success-bg)', padding: '0.4rem 0.8rem', 
                borderRadius: 'var(--radius-full)', border: '1px solid var(--success-border)',
                fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px var(--success)' }}></div>
                System OK
              </div>
            )}
          </header>
        )}
        
        {children}
      </main>
    </div>
  );
}
