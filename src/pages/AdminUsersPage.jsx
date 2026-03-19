import { useEffect, useState } from 'react';
import { getUsers, updateUser, deleteUser, createUser } from '../services/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editRole, setEditRole] = useState('');
  
  // Create user form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'STUDENT'
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data } = await getUsers();
      setUsers(Array.isArray(data) ? data : data.results || []);
    } catch {}
    setLoading(false);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await createUser(formData);
      setFormData({ username: '', email: '', password: '', role: 'STUDENT' });
      setShowAddForm(false);
      loadUsers();
    } catch (err) {
      setFormError(err.response?.data?.detail || 'Failed to create user. Check if username/email already exists.');
    }
  };

  const handleRoleUpdate = async (id) => {
    try {
      await updateUser(id, { role: editRole });
      setEditingId(null);
      loadUsers();
    } catch {
      alert('Failed to update role');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await deleteUser(id);
      loadUsers();
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Manage Users</h1>
          <p className="page-subtitle">View, update roles, and manage all platform users</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add New User'}
        </button>
      </div>

      {showAddForm && (
        <div className="card" style={{ marginBottom: '2rem', maxWidth: '600px', animation: 'fadeIn 0.3s ease' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Create New User / Instructor</h2>
          <form onSubmit={handleCreateUser}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input 
                type="text" 
                className="form-control" 
                required 
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-control" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-control" 
                required 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select 
                className="form-select" 
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="STUDENT">STUDENT</option>
                <option value="INSTRUCTOR">INSTRUCTOR</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            {formError && <p style={{ color: 'var(--error)', marginBottom: '1rem', fontSize: '0.9rem' }}>{formError}</p>}
            <button type="submit" className="btn btn-primary">Create User</button>
          </form>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{users.length}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{users.filter(u => u.role === 'STUDENT').length}</div>
          <div className="stat-label">Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{users.filter(u => u.role === 'INSTRUCTOR').length}</div>
          <div className="stat-label">Instructors</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{users.filter(u => u.role === 'ADMIN').length}</div>
          <div className="stat-label">Admins</div>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td style={{ fontWeight: 600 }}>{u.username}</td>
                <td>{u.email}</td>
                <td>
                  {editingId === u.id ? (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <select className="form-select" value={editRole} onChange={(e) => setEditRole(e.target.value)} style={{ width: 'auto', padding: '0.3rem 0.5rem', fontSize: '0.8rem' }}>
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
