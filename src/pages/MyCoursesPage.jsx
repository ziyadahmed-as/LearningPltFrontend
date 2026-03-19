import { useEffect, useState } from 'react';
import { getCourses, createCourse, deleteCourse, getCategories } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MyCoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', slug: '', description: '', price: '0.00', category: '', is_published: false });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [coursesRes, catsRes] = await Promise.all([getCourses(), getCategories()]);
      const allCourses = Array.isArray(coursesRes.data) ? coursesRes.data : coursesRes.data.results || [];
      setCourses(allCourses.filter(c => c.instructor === user?.id));
      setCategories(Array.isArray(catsRes.data) ? catsRes.data : catsRes.data.results || []);
    } catch {}
    setLoading(false);
  };

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

  const update = (field, value) => setForm({ ...form, [field]: value });

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <h1 className="page-title">My Courses</h1>
          <p className="page-subtitle">Manage your teaching content</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Course'}
        </button>
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
              <label className="form-label">Slug</label>
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
          <p className="empty-state-text">You haven't created any courses yet</p>
        </div>
      ) : (
        <div className="grid-courses">
          {courses.map((course) => (
            <div className="card" key={course.id}>
              <div className="card-header">
                <h3 className="card-title">{course.title}</h3>
                <p className="card-subtitle">{course.modules?.length || 0} modules</p>
              </div>
              <div className="card-body">
                <p>{course.description?.substring(0, 100)}...</p>
              </div>
              <div className="card-footer">
                {parseFloat(course.price) === 0 ? (
                  <span className="badge badge-free">Free</span>
                ) : (
                  <span className="price-tag">${course.price}</span>
                )}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span className={`badge ${course.is_published ? 'badge-success' : 'badge-warning'}`}>
                    {course.is_published ? 'Published' : 'Draft'}
                  </span>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(course.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
