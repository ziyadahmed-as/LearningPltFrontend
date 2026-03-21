import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCourses, createCourse, deleteCourse, updateCourse, getCategories } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MyCoursesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', slug: '', description: '', price: '0.00', category: '', is_published: false });
  const [error, setError] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [coursesRes, catsRes] = await Promise.all([getAllCourses(), getCategories()]);
      const allCourses = Array.isArray(coursesRes.data) ? coursesRes.data : coursesRes.data.results || [];
      // Instructors see only their own courses
      setCourses(allCourses.filter(c => c.instructor === user?.id));
      setCategories(Array.isArray(catsRes.data) ? catsRes.data : catsRes.data.results || []);
    } catch {}
    setLoading(false);
  };

  const toSlug = (str) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createCourse({ ...form, price: parseFloat(form.price) });
      setShowForm(false);
      setForm({ title: '', slug: '', description: '', price: '0.00', category: '', is_published: false });
      loadData();
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const firstKey = Object.keys(data)[0];
        setError(Array.isArray(data[firstKey]) ? data[firstKey][0] : JSON.stringify(data));
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      await deleteCourse(id);
      loadData();
    }
  };

  const handleTogglePublish = async (course) => {
    try {
      await updateCourse(course.id, { is_published: !course.is_published });
      loadData();
    } catch { alert('Failed to update publish status'); }
  };

  const update = (field, value) => {
    const next = { ...form, [field]: value };
    // Auto-generate slug from title
    if (field === 'title') next.slug = toSlug(value);
    setForm(next);
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  const published = courses.filter(c => c.is_published).length;
  const approved = courses.filter(c => c.is_approved).length;
  const drafts = courses.filter(c => !c.is_published).length;
  const pending = courses.filter(c => c.is_published && !c.is_approved).length;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <h1 className="page-title">Instructor Dashboard</h1>
          <p className="page-subtitle">Create courses, manage lessons, and track approval status</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Course'}
        </button>
      </div>

      {/* Stats overview */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card"><div className="stat-value">{courses.length}</div><div className="stat-label">Total Courses</div></div>
        <div className="stat-card"><div className="stat-value">{published}</div><div className="stat-label">Published</div></div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: approved > 0 ? 'var(--success)' : undefined }}>{approved}</div>
          <div className="stat-label">✅ Approved</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: pending > 0 ? 'var(--warning, #f59e0b)' : undefined }}>{pending}</div>
          <div className="stat-label">⏳ Awaiting Approval</div>
        </div>
        <div className="stat-card"><div className="stat-value">{drafts}</div><div className="stat-label">📝 Drafts</div></div>
      </div>

      {showForm && (
        <div className="auth-card" style={{ marginBottom: 'var(--space-2xl)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-lg)' }}>Create New Course</h2>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input className="form-input" value={form.title} onChange={(e) => update('title', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Slug (auto-generated)</label>
              <input className="form-input" value={form.slug} onChange={(e) => update('slug', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" value={form.description} onChange={(e) => update('description', e.target.value)} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Price (USD)</label>
                <input className="form-input" type="number" step="0.01" value={form.price} onChange={(e) => update('price', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={form.category} onChange={(e) => update('category', e.target.value)}>
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <button className="btn btn-primary btn-block" type="submit">Create Course</button>
          </form>
        </div>
      )}

      {courses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📖</div>
          <p className="empty-state-text">You haven't created any courses yet. Click "+ New Course" to get started!</p>
        </div>
      ) : (
        <div className="grid-courses">
          {courses.map((course) => {
            const lessonCount = course.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0;
            return (
              <div className="card" key={course.id}>
                <div className="card-header">
                  <h3 className="card-title">{course.title}</h3>
                  <p className="card-subtitle">{course.modules?.length || 0} modules · {lessonCount} lessons</p>
                </div>
                <div className="card-body">
                  <p>{course.description?.substring(0, 100)}{course.description?.length > 100 ? '...' : ''}</p>
                  {/* Status badges */}
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                    {parseFloat(course.price) === 0 ? (
                      <span className="badge badge-free">Free</span>
                    ) : (
                      <span className="price-tag">${course.price}</span>
                    )}
                    <span className={`badge ${course.is_published ? 'badge-success' : 'badge-warning'}`}>
                      {course.is_published ? '📢 Published' : '📝 Draft'}
                    </span>
                    {course.is_published && (
                      <span className={`badge ${course.is_approved ? 'badge-success' : 'badge-error'}`}>
                        {course.is_approved ? '✅ Approved' : '⏳ Awaiting Approval'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="card-footer" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <button
                    className={`btn btn-sm ${course.is_published ? 'btn-secondary' : 'btn-success'}`}
                    onClick={() => handleTogglePublish(course)}
                    title={course.is_published ? 'Unpublish this course' : 'Submit for admin approval'}
                  >
                    {course.is_published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button className="btn btn-sm btn-primary" onClick={() => navigate(`/editor/courses/${course.id}`)}>
                    Edit Structure
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(course.id)}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
