import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getLesson, updateLesson, 
  uploadLessonImage, uploadLessonFile 
} from '../services/api';

export default function LessonEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', video_url: '' });

  useEffect(() => {
    loadLesson();
  }, [id]);

  const loadLesson = async () => {
    try {
      const { data } = await getLesson(id);
      setLesson(data);
      setFormData({ title: data.title, content: data.content, video_url: data.video_url || '' });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
        const { data } = await updateLesson(id, formData);
        setLesson(data);
        alert('Saved successfully!');
    } catch (err) {
        alert('Failed to save');
    } finally {
        setSaving(false);
    }
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append('lesson', id);
    data.append('image', file);
    data.append('caption', file.name);
    try {
      await uploadLessonImage(data);
      loadLesson();
    } catch (err) {
      alert('Upload failed');
    }
  };

  const handleUploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append('lesson', id);
    data.append('file', file);
    data.append('title', file.name);
    try {
      await uploadLessonFile(data);
      loadLesson();
    } catch (err) {
      alert('Upload failed');
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
  if (!lesson) return <div className="empty-state">Lesson not found</div>;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">Edit Lesson: {lesson.title}</h1>
          <p className="page-subtitle">Add text, video, images, and files</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>Back</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-2xl)' }}>
        <div className="auth-card" style={{ width: '100%', marginBottom: 'var(--space-xl)' }}>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Lesson Title</label>
              <input className="form-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Video URL (YouTube/Vimeo)</label>
              <input className="form-input" value={formData.video_url} onChange={e => setFormData({...formData, video_url: e.target.value})} placeholder="https://..." />
            </div>
            <div className="form-group">
              <label className="form-label">Detailed Description / Content</label>
              <textarea className="form-textarea" style={{ minHeight: '300px' }} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
            </div>
            <button className="btn btn-primary btn-block" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Content'}
            </button>
          </form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
          <div className="auth-card" style={{ padding: 'var(--space-lg)' }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: 'var(--space-md)' }}>Images</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {lesson.images?.map(img => (
                <div key={img.id} className="lesson-image-container" style={{ position: 'relative' }}>
                  <img src={img.image} alt="" className="lesson-image" style={{ height: '100px', objectFit: 'cover' }} />
                </div>
              ))}
              <label className="btn btn-sm btn-secondary btn-block">
                + Upload Image
                <input type="file" accept="image/*" onChange={handleUploadImage} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          <div className="auth-card" style={{ padding: 'var(--space-lg)' }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: 'var(--space-md)' }}>Supporting PDF Files</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {lesson.files?.map(file => (
                <div key={file.id} className="badge badge-info" style={{ justifyContent: 'flex-start', padding: '0.5rem' }}>
                  📄 {file.title.substring(0, 20)}...
                </div>
              ))}
              <label className="btn btn-sm btn-secondary btn-block">
                + Upload PDF
                <input type="file" accept="application/pdf" onChange={handleUploadFile} style={{ display: 'none' }} />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
