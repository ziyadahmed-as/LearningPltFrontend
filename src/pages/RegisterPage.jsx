import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '', email: '', password: '', password_confirm: '', 
    first_name: '', last_name: '', role: 'STUDENT',
    expertise: '', education_level: '', years_of_experience: 0
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isInstructorMode, setIsInstructorMode] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/login');
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const firstKey = Object.keys(data)[0];
        setError(Array.isArray(data[firstKey]) ? data[firstKey][0] : JSON.stringify(data));
      } else {
        setError('Registration failed');
      }
    }
    setLoading(false);
  };

  const update = (field, value) => setForm({ ...form, [field]: value });

  return (
    <div className="auth-container" style={{ padding: 'var(--space-2xl) 0' }}>
      <div className="auth-card" style={{ maxWidth: '600px' }}>
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label className="form-label" style={{ fontSize: '0.8rem', opacity: 0.8, textTransform: 'uppercase' }}>I want to join as</label>
          <select 
            className="form-input" 
            style={{ padding: '0.8rem', fontWeight: 600, background: 'var(--bg-elevated)', cursor: 'pointer' }}
            value={form.role}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'INSTRUCTOR') {
                navigate('/instructor-onboarding');
              } else {
                update('role', val);
                setIsInstructorMode(false);
              }
            }}
          >
            <option value="STUDENT">🎓 Student - I want to learn</option>
            <option value="INSTRUCTOR">👨‍🏫 Instructor - I want to teach</option>
          </select>
        </div>

        <h1 className="auth-title" style={{ marginTop: '0.5rem' }}>{isInstructorMode ? 'Teach with Us' : 'Create Account'}</h1>
        <p className="auth-subtitle">
          {isInstructorMode 
            ? 'Share your expertise and empower the next generation.' 
            : 'Join the platform and start learning today'}
        </p>
        
        {error && <div className="alert alert-error">{error}</div>}
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
            <label className="form-label">Username</label>
            <input className="form-input" value={form.username} onChange={(e) => update('username', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" value={form.password} onChange={(e) => update('password', e.target.value)} required />
          </div>
          <div className="form-group" style={{ marginBottom: isInstructorMode ? '2rem' : '1.5rem' }}>
            <label className="form-label">Confirm Password</label>
            <input className="form-input" type="password" value={form.password_confirm} onChange={(e) => update('password_confirm', e.target.value)} required />
          </div>



          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? 'Processing...' : isInstructorMode ? 'Submit Application' : 'Create Account'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
