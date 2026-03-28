import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';
import {
  getUsers, updateUser, deleteUser, createUser,
  getCategories, createCategory, deleteCategory,
  getAllCourses, approveCourse, unapproveCourse,
  getInstructorStats,
} from '../services/api';
import { 
  Users, Layers, CheckCircle, BarChart3, LayoutDashboard, 
  Trash2, UserPlus, Search, Shield, GraduationCap, Eye, ExternalLink,
  Users2, BookOpen, Clock, TrendingUp, Plus, X
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
    <DashboardLayout 
      title={MENU_ITEMS.find(i => i.id === activeItem)?.label}
      subtitle="Welcome back, Administrator."
      tabs={MENU_ITEMS}
      activeTab={activeItem}
      onTabChange={setActiveItem}
    >
      {activeItem === 'Overview' && <OverviewTab />}
      {activeItem === 'Users' && <UsersTab />}
      {activeItem === 'Categories' && <CategoriesTab />}
      {activeItem === 'Courses' && <CourseApprovalsTab />}
    </DashboardLayout>
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
  const [showForm, setShowForm] = useState(false);
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
      setNewName(''); setNewSlug(''); setShowForm(false); loadCategories();
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
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Site Taxonomy</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Manage course categories and URL structures</p>
        </div>
        <button 
          className={`btn ${showForm ? 'btn-secondary' : 'btn-primary'}`}
          onClick={() => setShowForm(!showForm)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'Cancel' : 'Add Taxonomy'}
        </button>
      </header>

      <div className="grid" style={{ 
        gridTemplateColumns: showForm ? 'minmax(320px, 1fr) 2fr' : '1fr', 
        gap: '2rem', 
        alignItems: 'start',
        transition: 'all 0.3s ease'
      }}>
        {/* Left: Add Form (Animated) */}
        {showForm && (
          <div className="card fade-in" style={{ position: 'sticky', top: 'var(--space-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '0.6rem', background: 'var(--info-bg)', borderRadius: 'var(--radius-lg)', color: 'var(--info)' }}>
                <Layers size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Define Category</h3>
            </div>

            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label className="form-label">Category Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  placeholder="e.g. Mechanical Engineering"
                  value={newName} 
                  onChange={e => { 
                    setNewName(e.target.value); 
                    if (!newSlug || newSlug === toSlug(newName)) {
                      setNewSlug(toSlug(e.target.value));
                    }
                  }} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">URL Slug</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>/</span>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    style={{ paddingLeft: '1.6rem' }}
                    placeholder="mech-engineering"
                    value={newSlug} 
                    onChange={e => setNewSlug(e.target.value)} 
                  />
                </div>
              </div>
              {error && <div className="alert alert-error" style={{ marginBottom: '1rem', padding: '0.6rem', fontSize: '0.75rem' }}>{error}</div>}
              <button type="submit" className="btn btn-primary btn-block">
                Create Structure
              </button>
            </form>
          </div>
        )}

        {/* Right: Category List */}
        <div className="card">
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Active Categories</h3>
            <span className="badge badge-info">{categories.length} Total</span>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Slug Reference</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                      <Layers size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                      <p>No categories defined yet.</p>
                    </td>
                  </tr>
                ) : categories.map(cat => (
                  <tr key={cat.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{cat.name}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>ID: #{cat.id}</div>
                    </td>
                    <td>
                      <code style={{ 
                        fontSize: '0.75rem', 
                        padding: '0.2rem 0.5rem', 
                        background: 'var(--bg-elevated)', 
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--accent-primary)'
                      }}>
                        /{cat.slug}
                      </code>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className="btn btn-sm" 
                        style={{ color: 'var(--error)', background: 'transparent' }}
                        onClick={() => handleDelete(cat.id)}
                        title="Delete Category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
