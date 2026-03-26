import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getUsers, updateUser, deleteUser, createUser,
  getCategories, createCategory, deleteCategory,
  getAllCourses, approveCourse, unapproveCourse,
  getInstructorStats,
} from '../services/api';
import { 
  Users, Layers, CheckCircle, BarChart3, LayoutDashboard, 
  Trash2, UserPlus, Search, Shield, GraduationCap, Eye, ExternalLink,
  Users2, BookOpen, Clock, TrendingUp
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';

const MENU_ITEMS = [
  { id: 'Overview', icon: LayoutDashboard, label: 'Systems Overview' },
  { id: 'Users', icon: Users, label: 'User Management' },
  { id: 'Courses', icon: CheckCircle, label: 'Course Approvals' },
  { id: 'Categories', icon: Layers, label: 'Categories' },
];

export default function AdminDashboardPage() {
  const [activeItem, setActiveItem] = useState('Overview');
  const navigate = useNavigate();

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar" style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-subtle)' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1.5rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent-primary)', letterSpacing: '-0.03em' }}>Fatra <span style={{ color: 'var(--text-primary)' }}>OS</span></h2>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.2rem' }}>Administration Suite</p>
        </div>
        <nav style={{ padding: '0 0.75rem' }}>
          {MENU_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`admin-sidebar-item ${activeItem === item.id ? 'active' : ''}`}
              style={{ 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                padding: '0.85rem 1rem', 
                borderRadius: 'var(--radius-md)',
                marginBottom: '0.25rem',
                border: 'none',
                background: activeItem === item.id ? 'var(--accent-primary)' : 'transparent',
                color: activeItem === item.id ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'var(--transition-normal)',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main-content">
        <header style={{ 
          marginBottom: '1.5rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-end',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '1rem'
        }}>
          <div>
            <h1 className="page-title" style={{ fontSize: '1.5rem', marginBottom: '0' }}>
              {MENU_ITEMS.find(i => i.id === activeItem)?.label}
            </h1>
            <p className="page-subtitle" style={{ fontSize: '0.8rem' }}>Welcome back, Administrator.</p>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            background: 'var(--success-bg)', 
            padding: '0.4rem 0.8rem', 
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--success-border)',
            fontSize: '0.75rem',
            color: 'var(--success)',
            fontWeight: 600
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px var(--success)' }}></div>
            System status: Stable
          </div>
        </header>

        {activeItem === 'Overview' && <OverviewTab />}
        {activeItem === 'Users' && <UsersTab />}
        {activeItem === 'Categories' && <CategoriesTab />}
        {activeItem === 'Courses' && <CourseApprovalsTab />}
      </main>
    </div>
  );
}

/* ─── OVERVIEW TAB (REPORTS & GRAPHS) ─────────────────────── */
function OverviewTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getInstructorStats(); // Admin gets global stats from this endpoint
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch admin stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  // Prepare chart data from stats
  const courseData = [
    { name: 'Published', value: stats?.published || 0, color: '#10b981' },
    { name: 'Pending', value: stats?.pending || 0, color: '#f59e0b' },
    { name: 'Drafts', value: stats?.drafts || 0, color: '#64748b' },
  ];

  // Dummy monthly data for visualization if real data is not available
  const enrollmentData = [
    { month: 'Jan', enrollments: 12, views: 45 },
    { month: 'Feb', enrollments: 19, views: 52 },
    { month: 'Mar', enrollments: 32, views: 88 },
    { month: 'Apr', enrollments: stats?.total_enrollments || 45, views: stats?.total_views / 10 || 120 },
  ];

  return (
    <div className="fade-in">
      {/* Quick Stats Grid */}
      <div className="stats-grid-modern">
        <StatCard 
          icon={Users2} 
          label="Total Enrollments" 
          value={stats?.total_enrollments || 0} 
          trend="+12% from last month"
        />
        <StatCard 
          icon={BookOpen} 
          label="Total Courses" 
          value={stats?.total_courses || 0} 
          trend="Global reach"
        />
        <StatCard 
          icon={Eye} 
          label="Platform Views" 
          value={stats?.total_views || 0} 
          trend="Real-time traffic"
        />
        <StatCard 
          icon={TrendingUp} 
          label="Approval Queue" 
          value={stats?.pending || 0} 
          variant={stats?.pending > 0 ? 'warning' : 'success'}
          trend={stats?.pending > 0 ? 'Urgent attention' : 'All clear'}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {/* Course Status Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Course Ecosystem</h3>
          </div>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {courseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Growth Trend Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Activity Metrics</h3>
          </div>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enrollmentData}>
                <defs>
                  <linearGradient id="colorEnroll" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="enrollments" stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorEnroll)" />
                <Area type="monotone" dataKey="views" stroke="#10b981" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, trend, variant = 'primary' }) {
  return (
    <div className="stat-card-modern">
      <div className="stat-icon-wrapper" style={{ flexShrink: 0 }}>
        <Icon size={18} />
      </div>
      <div className="stat-info" style={{ overflow: 'hidden' }}>
        <span className="stat-label-modern" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span className="stat-value-modern">{value}</span>
          <span style={{ fontSize: '0.6rem', color: variant === 'warning' ? 'var(--warning)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            {trend.split(' ').slice(0, 2).join(' ')}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── USERS TAB ─────────────────────────────────────────── */
function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editRole, setEditRole] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'STUDENT' });
  const [formError, setFormError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try { const { data } = await getUsers(); setUsers(Array.isArray(data) ? data : data.results || []); } catch {}
    setLoading(false);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault(); setFormError('');
    try {
      await createUser(formData);
      setFormData({ username: '', email: '', password: '', role: 'STUDENT' });
      setShowAddForm(false); loadUsers();
    } catch (err) { setFormError(err.response?.data?.detail || 'Failed to create user.'); }
  };

  const handleRoleUpdate = async (id) => {
    try { await updateUser(id, { role: editRole }); setEditingId(null); loadUsers(); }
    catch { alert('Failed to update role'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this user?')) { await deleteUser(id); loadUsers(); }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search users..." 
            className="form-input" 
            style={{ paddingLeft: '3rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          <UserPlus size={18} />
          {showAddForm ? 'Cancel' : 'Add User'}
        </button>
      </div>

      {showAddForm && (
        <div className="card" style={{ marginBottom: '2.5rem', maxWidth: '500px', animation: 'slideDown 0.3s ease' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={20} className="text-accent" />
            Registry Management
          </h3>
          <form onSubmit={handleCreateUser}>
            <div className="form-group">
              <label className="form-label">Account Identity</label>
              <input type="text" className="form-input" required placeholder="Unique username" value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Verified Email</label>
              <input type="email" className="form-input" required placeholder="name@example.com" value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Security Credentials</label>
              <input type="password" className="form-input" required placeholder="Choose a secure password" value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">System Privileges</label>
              <select className="form-select" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                <option value="STUDENT">Learner (Student)</option>
                <option value="INSTRUCTOR">Educator (Instructor)</option>
                <option value="ADMIN">System Administrator</option>
              </select>
            </div>
            {formError && <div className="alert alert-error">{formError}</div>}
            <button type="submit" className="btn btn-primary btn-block">Confirm & Provision</button>
          </form>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Contact</th>
              <th>Status / Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                      {u.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{u.username}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>UID: #{u.id}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: '0.85rem' }}>{u.email}</div>
                </td>
                <td>
                  {editingId === u.id ? (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <select className="form-select" value={editRole} onChange={e => setEditRole(e.target.value)}
                        style={{ width: 'auto', padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>
                        <option value="STUDENT">STUDENT</option>
                        <option value="INSTRUCTOR">INSTRUCTOR</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                      <button className="btn btn-sm btn-success" onClick={() => handleRoleUpdate(u.id)}>Save</button>
                      <button className="btn btn-sm btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
                    </div>
                  ) : (
                    <span className={`badge ${u.role === 'ADMIN' ? 'badge-error' : u.role === 'INSTRUCTOR' ? 'badge-info' : 'badge-success'}`}>
                      {u.role}
                    </span>
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-sm btn-secondary" onClick={() => { setEditingId(u.id); setEditRole(u.role); }}>Edit</button>
                    <button className="btn btn-sm btn-danger" style={{ background: 'transparent', border: '1px solid var(--error)', color: 'var(--error)' }} onClick={() => handleDelete(u.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── CATEGORIES TAB ─────────────────────────────────────── */
function CategoriesTab() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    try { const { data } = await getCategories(); setCategories(Array.isArray(data) ? data : data.results || []); } catch {}
    setLoading(false);
  };

  const toSlug = (str) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const handleAdd = async (e) => {
    e.preventDefault(); setError('');
    const slug = newSlug || toSlug(newName);
    try {
      await createCategory({ name: newName, slug });
      setNewName(''); setNewSlug(''); loadCategories();
    } catch (err) { setError(err.response?.data?.slug?.[0] || err.response?.data?.name?.[0] || 'Failed to create category.'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category? Courses in it will lose their category.')) {
      try { await deleteCategory(id); loadCategories(); }
      catch { alert('Failed to delete category.'); }
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="fade-in">
      <div className="card" style={{ maxWidth: '500px', marginBottom: '2.5rem' }}>
        <h3 style={{ marginBottom: '1.25rem' }}>Taxonomy Management</h3>
        <form onSubmit={handleAdd}>
          <div className="form-group">
            <label className="form-label">Display Name</label>
            <input type="text" className="form-input" required placeholder="e.g. Mechanical Engineering"
              value={newName} onChange={e => { setNewName(e.target.value); setNewSlug(toSlug(e.target.value)); }} />
          </div>
          <div className="form-group">
            <label className="form-label">Uniform Resource Slug</label>
            <input type="text" className="form-input" required placeholder="e.g. mechanical-engineering"
              value={newSlug} onChange={e => setNewSlug(e.target.value)} />
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <button type="submit" className="btn btn-primary">Define Category</button>
        </form>
      </div>

      <div className="table-container">
        <table>
          <thead><tr><th>ID</th><th>Structure Name</th><th>Unique Slug</th><th>Actions</th></tr></thead>
          <tbody>
            {categories.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>Architecture is empty.</td></tr>
            ) : categories.map(cat => (
              <tr key={cat.id}>
                <td>#{cat.id}</td>
                <td style={{ fontWeight: 700 }}>{cat.name}</td>
                <td><code style={{ fontSize: '0.8rem', opacity: 0.8 }}>/{cat.slug}</code></td>
                <td><button className="btn btn-sm btn-danger" onClick={() => handleDelete(cat.id)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── COURSE APPROVALS TAB ───────────────────────────────── */
function CourseApprovalsTab() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // 'pending' | 'approved' | 'all'
  const navigate = useNavigate();

  useEffect(() => { loadCourses(); }, []);

  const loadCourses = async () => {
    setLoading(true);
    try { const { data } = await getAllCourses(); setCourses(Array.isArray(data) ? data : data.results || []); } catch {}
    setLoading(false);
  };

  const handleApprove = async (id) => {
    try { await approveCourse(id); loadCourses(); }
    catch { alert('Failed to approve course.'); }
  };

  const handleUnapprove = async (id) => {
    if (window.confirm('Revoke this course approval? Students will no longer see it.')) {
      try { await unapproveCourse(id); loadCourses(); }
      catch { alert('Failed to unapprove course.'); }
    }
  };

  const filtered = courses.filter(c => {
    if (filter === 'pending') return c.is_published && !c.is_approved;
    if (filter === 'approved') return c.is_approved;
    return true;
  });

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  const pendingCount = courses.filter(c => c.is_published && !c.is_approved).length;

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
        {[
          { id: 'pending', label: 'Pending Review', count: pendingCount, variant: 'warning' },
          { id: 'approved', label: 'In Production', count: courses.filter(c => c.is_approved).length, variant: 'success' },
          { id: 'all', label: 'Inventory', count: courses.length, variant: 'secondary' }
        ].map(btn => (
          <button 
            key={btn.id} 
            className={`btn btn-sm ${filter === btn.id ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(btn.id)}
            style={{ position: 'relative' }}
          >
            {btn.label}
            {btn.count > 0 && (
              <span style={{ 
                background: btn.variant === 'warning' ? 'var(--warning)' : 'var(--bg-elevated)', 
                color: btn.variant === 'warning' ? 'black' : 'var(--text-primary)',
                padding: '1px 6px', borderRadius: '10px', fontSize: '0.65rem', marginLeft: '0.5rem', fontWeight: 800
              }}>
                {btn.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Curriculum</th>
              <th>Architect</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                <div style={{ opacity: 0.5, marginBottom: '0.5rem' }}><CheckCircle size={32} style={{ margin: '0 auto' }}/></div>
                Clean queue. No courses to display.
              </td></tr>
            ) : filtered.map(course => (
              <tr key={course.id}>
                <td>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{course.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{course.category || 'Uncategorized'}</div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <GraduationCap size={14} className="text-muted" />
                    <span style={{ fontSize: '0.85rem' }}>{course.instructor_name}</span>
                  </div>
                </td>
                <td>
                  <span className={`badge ${course.is_approved ? 'badge-success' : course.is_published ? 'badge-warning' : 'badge-secondary'}`}>
                    {course.is_approved ? 'Live' : course.is_published ? 'Ready' : 'Draft'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-sm btn-secondary" onClick={() => navigate(`/courses/${course.id}`)}>
                      <ExternalLink size={14} />
                    </button>
                    {!course.is_approved ? (
                      <button className="btn btn-sm btn-success" onClick={() => handleApprove(course.id)} disabled={!course.is_published}>
                        Approve
                      </button>
                    ) : (
                      <button className="btn btn-sm btn-danger" onClick={() => handleUnapprove(course.id)}>
                        Revoke
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
