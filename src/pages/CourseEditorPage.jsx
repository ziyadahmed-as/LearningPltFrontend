import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getCourse, updateCourse,
  createModule, deleteModule,
  createLesson, deleteLesson,
  getCategories
} from '../services/api';

export default function CourseEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({ title: '', description: '', price: '0', category: '', is_published: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadCourse(); loadCategories(); }, [id]);

  const loadCourse = async () => {
    try {
      const { data } = await getCourse(id);
      setCourse(data);
      setSettings({
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category || '',
        is_published: data.is_published,
      });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const loadCategories = async () => {
    try { const { data } = await getCategories(); setCategories(Array.isArray(data) ? data : data.results || []); } catch {}
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateCourse(id, { ...settings, price: parseFloat(settings.price) });
      loadCourse();
      setShowSettings(false);
    } catch { alert('Failed to update course settings'); }
    finally { setSaving(false); }
  };

  const handleTogglePublish = async () => {
    try {
      await updateCourse(id, { is_published: !course.is_published });
      loadCourse();
    } catch { alert('Failed to update publish status'); }
  };

  const handleAddModule = async () => {
    const title = prompt('Enter module title:');
    if (!title) return;
    try {
      await createModule({ course: id, title, order: course.modules.length });
      loadCourse();
    } catch { alert('Failed to add module'); }
  };

  const handleAddLesson = async (moduleId, order) => {
    const title = prompt('Enter lesson title:');
    if (!title) return;
    try {
      await createLesson({ module: moduleId, title, content: 'Write your content here...', order });
      loadCourse();
    } catch { alert('Failed to add lesson'); }
  };

  const handleDeleteModule = async (moduleId) => {
    if (window.confirm('Delete this module and all its lessons?')) {
      await deleteModule(moduleId);
      loadCourse();
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (window.confirm('Delete this lesson?')) {
      await deleteLesson(lessonId);
      loadCourse();
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
  if (!course) return <div className="empty-state"><p className="empty-state-text">Course not found</p></div>;

  const lessonCount = course.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Course Editor: {course.title}</h1>
          <p className="page-subtitle">Manage chapters, lessons, and course settings</p>
          {/* Status badges */}
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            <span className={`badge ${course.is_published ? 'badge-success' : 'badge-warning'}`}>
              {course.is_published ? '📢 Published' : '📝 Draft'}
            </span>
            {course.is_published && (
              <span className={`badge ${course.is_approved ? 'badge-success' : 'badge-error'}`}>
                {course.is_approved ? '✅ Approved' : '⏳ Awaiting Approval'}
              </span>
            )}
            <span className="badge badge-info">{course.modules?.length || 0} modules · {lessonCount} lessons</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={() => setShowSettings(!showSettings)}>
            ⚙️ {showSettings ? 'Hide Settings' : 'Course Settings'}
          </button>
          <button
            className={`btn ${course.is_published ? 'btn-secondary' : 'btn-success'}`}
            onClick={handleTogglePublish}
          >
            {course.is_published ? 'Unpublish' : '🚀 Publish'}
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/my-courses')}>← Back</button>
        </div>
      </div>

      {/* Course Settings Panel */}
      {showSettings && (
        <div className="card" style={{ marginBottom: '2rem', animation: 'fadeIn 0.3s ease', maxWidth: '600px' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>⚙️ Course Settings</h3>
          <form onSubmit={handleSaveSettings}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input className="form-input" value={settings.title}
                onChange={e => setSettings({ ...settings, title: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" value={settings.description}
                onChange={e => setSettings({ ...settings, description: e.target.value })} required
                style={{ minHeight: '100px' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Price (USD)</label>
                <input className="form-input" type="number" step="0.01" value={settings.price}
                  onChange={e => setSettings({ ...settings, price: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={settings.category}
                  onChange={e => setSettings({ ...settings, category: e.target.value })}>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </div>
      )}

      {/* Add Module button */}
      <div style={{ marginBottom: 'var(--space-2xl)' }}>
        <button className="btn btn-primary" onClick={handleAddModule}>+ Add Chapter (Module)</button>
      </div>

      {course.modules?.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🧱</div>
          <p className="empty-state-text">No modules added yet. Start by adding a chapter.</p>
        </div>
      ) : (
        <div className="editor-modules-container">
          {course.modules.map((mod, mi) => (
            <div className="editor-module" key={mod.id}>
              <div className="editor-module-header">
                <div>
                  <span className="badge badge-info" style={{ marginRight: 'var(--space-md)' }}>Chapter {mi + 1}</span>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{mod.title}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '0.5rem' }}>
                    ({mod.lessons?.length || 0} lessons)
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-sm btn-secondary" onClick={() => handleAddLesson(mod.id, mod.lessons?.length || 0)}>+ Add Lesson</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDeleteModule(mod.id)}>Delete</button>
                </div>
              </div>
              <div className="editor-lessons-list">
                {mod.lessons?.length === 0 ? (
                  <div style={{ padding: 'var(--space-lg)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No lessons in this chapter yet. Click "+ Add Lesson" above.
                  </div>
                ) : (
                  mod.lessons.map((lesson, li) => (
                    <div className="editor-lesson" key={lesson.id}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                          width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg-elevated)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.75rem', marginRight: 'var(--space-md)', color: 'var(--text-muted)'
                        }}>
                          {li + 1}
                        </div>
                        <span style={{ fontWeight: 500 }}>{lesson.title}</span>
                        {/* Content indicators */}
                        <div style={{ display: 'flex', gap: '0.3rem', marginLeft: '0.5rem' }}>
                          {lesson.video_url && <span title="Has video" style={{ fontSize: '0.8rem' }}>🎬</span>}
                          {lesson.images?.length > 0 && <span title="Has images" style={{ fontSize: '0.8rem' }}>🖼️</span>}
                          {lesson.files?.length > 0 && <span title="Has files" style={{ fontSize: '0.8rem' }}>📄</span>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-sm btn-primary" onClick={() => navigate(`/editor/lessons/${lesson.id}`)}>Edit Content</button>
                        <button className="btn btn-sm btn-secondary" onClick={() => handleDeleteLesson(lesson.id)}>Remove</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
