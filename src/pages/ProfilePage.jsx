import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateMe } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';

export default function ProfilePage() {
  const { user, fetchUser } = useAuth();
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    bio: user?.bio || '',
  });
  const [picFile, setPicFile] = useState(null);

  const [passwordForm, setPasswordForm] = useState({
    password: '',
    confirm_password: ''
  });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    
    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    if (picFile) formData.append('profile_picture', picFile);

    try {
      await updateMe(formData);
      await fetchUser();
      setMsg('Profile updated successfully');
    } catch {
      setError('Failed to update profile');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    
    if (passwordForm.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (passwordForm.password !== passwordForm.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    try {
      await updateMe({ password: passwordForm.password });
      setMsg('Password updated successfully');
      setPasswordForm({ password: '', confirm_password: '' });
    } catch {
      setError('Failed to update password');
    }
  };

  const update = (field, value) => setForm({ ...form, [field]: value });
  const updatePass = (field, value) => setPasswordForm({ ...passwordForm, [field]: value });

  return (
    <DashboardLayout 
      title="My Profile"
      subtitle={`${user?.role} Portal · @${user?.username} · ${user?.email}`}
    >
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {msg && <div className="alert alert-success">{msg}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <div className="auth-card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 700 }}>Profile Information</h3>
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
              <textarea className="form-textarea" value={form.bio} onChange={(e) => update('bio', e.target.value)} placeholder="Tell us about yourself..." />
            </div>
            <div className="form-group">
              <label className="form-label">Profile Picture</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
                <div style={{ 
                  width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', 
                  background: 'var(--bg-elevated)', border: '2px solid var(--accent-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {picFile ? (
                    <img src={URL.createObjectURL(picFile)} alt="Preview" style={{ width: '100%', height: '100%', objectPosition: 'center', objectFit: 'cover' }} />
                  ) : (
                    <img src={user?.profile_picture || '/default-avatar.png'} alt="Current" style={{ width: '100%', height: '100%', objectPosition: 'center', objectFit: 'cover' }} />
                  )}
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setPicFile(e.target.files[0])}
                  style={{ fontSize: '0.85rem' }} 
                />
              </div>
            </div>
            <button className="btn btn-primary" type="submit">Update Basic Info</button>
          </form>
        </div>

        <div className="card" style={{ 
          padding: '2rem', 
          borderRadius: 'var(--radius-2xl)', 
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', 
          boxShadow: '0 10px 25px rgba(99, 102, 241, 0.2)',
          border: 'none',
          color: 'white'
        }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>Security Settings</h3>
          <form onSubmit={handlePasswordSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" style={{ color: 'rgba(255,255,255,0.9)' }}>New Password</label>
                <input 
                  className="form-input" 
                  type="password" 
                  required
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
                  placeholder="At least 6 characters"
                  value={passwordForm.password} 
                  onChange={(e) => updatePass('password', e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ color: 'rgba(255,255,255,0.9)' }}>Confirm New Password</label>
                <input 
                  className="form-input" 
                  type="password" 
                  required
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
                  placeholder="Repeat new password"
                  value={passwordForm.confirm_password} 
                  onChange={(e) => updatePass('confirm_password', e.target.value)} 
                />
              </div>
            </div>
            <button className="btn btn-white btn-block" style={{ marginTop: '0.5rem', background: 'white', color: '#6366f1', fontWeight: 700 }} type="submit">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
