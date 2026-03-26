import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getCourse, updateCourse,
  createChapter, deleteChapter,
  createLesson, deleteLesson,
  getCategories, generateCourseDescription
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
  const [generatingAI, setGeneratingAI] = useState(false);

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
    try { const { data } = await getCategories(); setCategories(Array.isArray(data) ? data : data.results || []); } catch { }
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

  const handleGenerateDescription = async () => {
    if (!settings.title) {
      alert('Please enter a course title first so AI can generate a relevant description.');
      return;
    }
    setGeneratingAI(true);
    try {
      const { data } = await generateCourseDescription({
        title: settings.title,
        // Optional: Could add inputs for audience/keywords if needed
      });
      setSettings({ ...settings, description: data.description });
    } catch (err) {
      console.error(err);
      alert('Failed to generate description. Make sure the backend has an OpenAI API key.');
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleTogglePublish = async () => {
    try {
      await updateCourse(id, { is_published: !course.is_published });
      loadCourse();
    } catch { alert('Failed to update publish status'); }
  };

  const handleAddChapter = async () => {
    const title = prompt('Enter chapter title:');
    if (!title) return;
    try {
      await createChapter({ course: id, title, order: course.chapters?.length || 0 });
      loadCourse();
    } catch { alert('Failed to add chapter'); }
  };

  const handleDeleteChapter = async (chapterId) => {
    if (window.confirm('Delete this chapter and all its lessons?')) {
      await deleteChapter(chapterId);
      loadCourse();
    }
  };

  const handleAddLesson = async (chapterId) => {
    const title = prompt('Enter lesson title:');
    if (!title) return;
    try {
      // Find the chapter to calculate lesson order
      const chapter = course.chapters.find(c => c.id === chapterId);
      await createLesson({ chapter: chapterId, title, content: '', order: chapter?.lessons?.length || 0 });
      loadCourse();
    } catch { alert('Failed to add lesson'); }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (window.confirm('Delete this lesson?')) {
      await deleteLesson(lessonId);
      loadCourse();
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
  if (!course) return <div className="empty-state"><p className="empty-state-text">Course not found</p></div>;

  const lessonCount = course.lessons?.length || 0;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Course Editor: {course.title}</h1>
          <p className="page-subtitle">Manage lessons and course settings</p>
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
            <span className="badge badge-info">{lessonCount} lessons</span>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Description</label>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={handleGenerateDescription}
                  disabled={generatingAI}
                  style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', border: 'none' }}
                >
                  {generatingAI ? '✨ Generating...' : '✨ AI Assist'}
                </button>
              </div>
              <textarea className="form-textarea" value={settings.description}
                onChange={e => setSettings({ ...settings, description: e.target.value })} required
                style={{ minHeight: '150px' }} />
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

      {/* Add Chapter button */}
      <div style={{ marginBottom: 'var(--space-2xl)' }}>
        <button className="btn btn-primary" onClick={handleAddChapter}>+ Add Chapter</button>
      </div>

      {course.chapters?.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📁</div>
          <p className="empty-state-text">No chapters added yet. Start by adding a chapter.</p>
        </div>
      ) : (
        <div className="editor-chapters-list" style={{ maxWidth: '800px' }}>
          {course.chapters?.map((chapter, ci) => (
            <div key={chapter.id} className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Chapter {ci + 1}:</span> {chapter.title}
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-sm btn-primary" onClick={() => handleAddLesson(chapter.id)}>+ Add Lesson</button>
                  <button className="btn btn-sm btn-secondary" onClick={() => handleDeleteChapter(chapter.id)}>Delete Chapter</button>
                </div>
              </div>

              {chapter.lessons?.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>No lessons in this chapter yet.</p>
              ) : (
                <div className="editor-lessons-list">
                  {chapter.lessons.map((lesson, li) => (
                    <div className="editor-lesson" key={lesson.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginTop: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                          width: '24px', height: '24px', borderRadius: '50%', background: 'var(--background)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.75rem', marginRight: 'var(--space-md)', color: 'var(--text-muted)', border: '1px solid var(--border)'
                        }}>
                          {li + 1}
                        </div>
                        <span style={{ fontWeight: 500 }}>{lesson.title}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-sm btn-primary" onClick={() => navigate(`/editor/lessons/${lesson.id}`)}>Edit Content</button>
                        <button className="btn btn-sm btn-secondary" onClick={() => handleDeleteLesson(lesson.id)}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
