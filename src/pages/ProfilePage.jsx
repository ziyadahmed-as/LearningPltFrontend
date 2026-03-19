import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateMe } from '../services/api';

export default function ProfilePage() {
  const { user, fetchUser } = useAuth();
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    bio: user?.bio || '',
    profile_picture: user?.profile_picture || '',
  });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    try {
      await updateMe(form);
      await fetchUser();
      setMsg('Profile updated successfully');
    } catch {
      setError('Failed to update profile');
    }
  };

  const update = (field, value) => setForm({ ...form, [field]: value });

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">
          <span className="badge badge-info">{user?.role}</span>{' '}
          @{user?.username} · {user?.email}
        </p>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="auth-card">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input className="form-input" value={form.first_name} onChange={(e) => update('first_name', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input className="form-input" value={form.last_name} onChange={(e) => update('last_name', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea className="form-textarea" value={form.bio} onChange={(e) => update('bio', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Profile Picture URL</label>
            <input className="form-input" value={form.profile_picture} onChange={(e) => update('profile_picture', e.target.value)} />
          </div>
          <button className="btn btn-primary btn-block" type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
}
