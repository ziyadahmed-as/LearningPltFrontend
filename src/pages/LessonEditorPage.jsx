import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getLesson, updateLesson, 
  uploadLessonImage, uploadLessonFile,
  createContentBlock, updateContentBlock, deleteContentBlock
} from '../services/api';

function ContentBlockEditor({ block, onUpdate, onDelete }) {
  const [data, setData] = useState({ title: block.title || '', content: block.content || '' });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onUpdate(block.id, data);
    setSaving(false);
  };

  return (
    <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
      <form onSubmit={handleSave}>
        <input className="form-input" style={{ marginBottom: '0.75rem', fontWeight: 'bold' }} value={data.title} onChange={e => setData({...data, title: e.target.value})} placeholder="Sub-topic Title (optional)" />
        <textarea className="form-textarea" style={{ marginBottom: '0.75rem', minHeight: '150px' }} value={data.content} onChange={e => setData({...data, content: e.target.value})} placeholder="Detailed content for this block..." required />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" className="btn btn-sm btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Block'}</button>
          <button type="button" className="btn btn-sm btn-secondary" onClick={() => onDelete(block.id)}>Delete Block</button>
        </div>
      </form>
    </div>
  );
}

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

  const handleAddBlock = async () => {
    try {
      await createContentBlock({ lesson: id, title: '', content: 'New content block...', order: lesson.content_blocks?.length || 0 });
      loadLesson();
    } catch { alert('Failed to add block'); }
  };

  const handleUpdateBlock = async (blockId, data) => {
    try {
      await updateContentBlock(blockId, data);
      alert('Block saved successfully!');
      loadLesson();
    } catch { alert('Failed to save block'); }
  };

  const handleDeleteBlock = async (blockId) => {
    if (window.confirm('Delete this content block?')) {
      await deleteContentBlock(blockId);
      loadLesson();
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-2xl)', alignItems: 'start' }}>
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
              {saving ? 'Saving...' : 'Save Main Content'}
            </button>
          </form>
        </div>

        <div style={{ gridColumn: '1 / -1', marginBottom: 'var(--space-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem' }}>Content Blocks (Sub-topics)</h2>
            <button className="btn btn-success" onClick={handleAddBlock}>+ Add Content Block</button>
          </div>
          
          {lesson.content_blocks?.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <p className="empty-state-text">No content blocks yet. Add blocks for multiple descriptions.</p>
            </div>
          ) : (
            <div>
              {lesson.content_blocks?.map((block, idx) => (
                <div key={block.id}>
                  <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Block {idx + 1}</h4>
                  <ContentBlockEditor block={block} onUpdate={handleUpdateBlock} onDelete={handleDeleteBlock} />
                </div>
              ))}
            </div>
          )}
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
