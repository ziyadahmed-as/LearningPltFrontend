import { useEffect, useState } from 'react';
import {
  getUsers, updateUser, deleteUser, createUser,
  getCategories, createCategory, deleteCategory,
  getAllCourses, approveCourse, unapproveCourse,
} from '../services/api';

const TABS = ['Users', 'Categories', 'Course Approvals'];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('Users');

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Manage users, course categories, and approve course content for learners</p>
      </div>

      {/* Tab navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '2px solid var(--border)', paddingBottom: '0' }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.6rem 1.4rem',
              border: 'none',
              borderBottom: activeTab === tab ? '3px solid var(--primary)' : '3px solid transparent',
              background: 'transparent',
              color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeTab === tab ? 700 : 500,
              cursor: 'pointer',
              fontSize: '0.95rem',
              transition: 'all 0.2s',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Users' && <UsersTab />}
      {activeTab === 'Categories' && <CategoriesTab />}
      {activeTab === 'Course Approvals' && <CourseApprovalsTab />}
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

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div className="stats-grid" style={{ flex: 1 }}>
          <div className="stat-card"><div className="stat-value">{users.length}</div><div className="stat-label">Total</div></div>
          <div className="stat-card"><div className="stat-value">{users.filter(u => u.role === 'STUDENT').length}</div><div className="stat-label">Students</div></div>
          <div className="stat-card"><div className="stat-value">{users.filter(u => u.role === 'INSTRUCTOR').length}</div><div className="stat-label">Instructors</div></div>
          <div className="stat-card"><div className="stat-value">{users.filter(u => u.role === 'ADMIN').length}</div><div className="stat-label">Admins</div></div>
        </div>
        <button className="btn btn-primary" style={{ marginLeft: '1rem' }} onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add User'}
        </button>
      </div>

      {showAddForm && (
        <div className="card" style={{ marginBottom: '2rem', maxWidth: '500px', animation: 'fadeIn 0.3s ease' }}>
          <h3 style={{ marginBottom: '1rem' }}>Create New User</h3>
          <form onSubmit={handleCreateUser}>
            {[['text', 'Username', 'username'], ['email', 'Email', 'email']].map(([type, label, key]) => (
              <div className="form-group" key={key}>
                <label className="form-label">{label}</label>
                <input type={type} className="form-control" required value={formData[key]}
                  onChange={e => setFormData({ ...formData, [key]: e.target.value })} />
              </div>
            ))}
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" required value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-select" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                <option value="STUDENT">Student</option>
                <option value="INSTRUCTOR">Instructor</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            {formError && <p style={{ color: 'var(--error)', marginBottom: '1rem', fontSize: '0.9rem' }}>{formError}</p>}
            <button type="submit" className="btn btn-primary">Create</button>
          </form>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead><tr><th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td style={{ fontWeight: 600 }}>{u.username}</td>
                <td>{u.email}</td>
                <td>
                  {editingId === u.id ? (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <select className="form-select" value={editRole} onChange={e => setEditRole(e.target.value)}
                        style={{ width: 'auto', padding: '0.3rem 0.5rem', fontSize: '0.8rem' }}>
                        <option value="STUDENT">STUDENT</option>
                        <option value="INSTRUCTOR">INSTRUCTOR</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                      <button className="btn btn-sm btn-success" onClick={() => handleRoleUpdate(u.id)}>Save</button>
                      <button className="btn btn-sm btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
                    </div>
                  ) : (
                    <span className={`badge ${u.role === 'ADMIN' ? 'badge-error' : u.role === 'INSTRUCTOR' ? 'badge-info' : 'badge-success'}`}>{u.role}</span>
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-sm btn-secondary" onClick={() => { setEditingId(u.id); setEditRole(u.role); }}>Edit Role</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u.id)}>Delete</button>
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
    <div>
      <div className="card" style={{ maxWidth: '500px', marginBottom: '2rem', animation: 'fadeIn 0.3s ease' }}>
        <h3 style={{ marginBottom: '1rem' }}>Add New Category</h3>
        <form onSubmit={handleAdd}>
          <div className="form-group">
            <label className="form-label">Category Name</label>
            <input type="text" className="form-control" required placeholder="e.g. Web Development"
              value={newName} onChange={e => { setNewName(e.target.value); setNewSlug(toSlug(e.target.value)); }} />
          </div>
          <div className="form-group">
            <label className="form-label">Slug (auto-generated)</label>
            <input type="text" className="form-control" required placeholder="e.g. web-development"
              value={newSlug} onChange={e => setNewSlug(e.target.value)} />
          </div>
          {error && <p style={{ color: 'var(--error)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}
          <button type="submit" className="btn btn-primary">Add Category</button>
        </form>
      </div>

      <div className="table-container">
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>Slug</th><th>Actions</th></tr></thead>
          <tbody>
            {categories.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No categories yet.</td></tr>
            ) : categories.map(cat => (
              <tr key={cat.id}>
                <td>{cat.id}</td>
                <td style={{ fontWeight: 600 }}>{cat.name}</td>
                <td><code style={{ fontSize: '0.85rem' }}>{cat.slug}</code></td>
                <td><button className="btn btn-sm btn-danger" onClick={() => handleDelete(cat.id)}>Delete</button></td>
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
    <div>
      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-value" style={{ color: pendingCount > 0 ? 'var(--warning, #f59e0b)' : undefined }}>{pendingCount}</div>
          <div className="stat-label">Awaiting Approval</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{courses.filter(c => c.is_approved).length}</div>
          <div className="stat-label">Approved</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{courses.filter(c => !c.is_published).length}</div>
          <div className="stat-label">Draft (not published)</div>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {[['pending', '⏳ Awaiting Approval'], ['approved', '✅ Approved'], ['all', '📋 All']].map(([val, label]) => (
          <button key={val} className={filter === val ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
            onClick={() => setFilter(val)}>{label}</button>
        ))}
      </div>

      {pendingCount > 0 && filter === 'pending' && (
        <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
          ⚠️ <strong>{pendingCount}</strong> course{pendingCount > 1 ? 's' : ''} published by instructors and waiting for your approval.
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Title</th><th>Instructor</th><th>Category</th>
              <th>Published</th><th>Approved</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                {filter === 'pending' ? '🎉 No courses awaiting approval.' : 'No courses found.'}
              </td></tr>
            ) : filtered.map(course => (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td style={{ fontWeight: 600 }}>{course.title}</td>
                <td>{course.instructor_name}</td>
                <td>{course.category ?? <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                <td>
                  <span className={`badge ${course.is_published ? 'badge-success' : 'badge-secondary'}`}>
                    {course.is_published ? 'Yes' : 'No'}
                  </span>
                </td>
                <td>
                  <span className={`badge ${course.is_approved ? 'badge-success' : 'badge-error'}`}>
                    {course.is_approved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {!course.is_approved ? (
                      <button className="btn btn-sm btn-success" onClick={() => handleApprove(course.id)}
                        disabled={!course.is_published} title={!course.is_published ? 'Instructor must publish first' : ''}>
                        ✅ Approve
                      </button>
                    ) : (
                      <button className="btn btn-sm btn-danger" onClick={() => handleUnapprove(course.id)}>
                        ❌ Revoke
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
