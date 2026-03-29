import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getLesson, updateLesson,
  createContentBlock, updateContentBlock, deleteContentBlock
} from '../services/api';
import TiptapEditor from '../components/TiptapEditor';


function ContentBlockEditor({ block, onUpdate, onDelete }) {
  const [data, setData] = useState({ 
    title: block.title || '', 
    type: block.type || 'text',
    text_content: block.text_content || '', 
    url: block.url || '' 
  });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('type', data.type);
    formData.append('text_content', data.text_content);
    formData.append('url', data.url || '');
    if (file) formData.append('file', file);

    await onUpdate(block.id, formData);
    setSaving(false);
    setFile(null);
  };

  return (
    <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '12px' }}>
      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '1rem', marginBottom: '1rem' }}>
          <input 
            className="form-input" 
            value={data.title} 
            onChange={e => setData({ ...data, title: e.target.value })} 
            placeholder="Block Title (optional)" 
          />
          <select 
            className="form-input" 
            value={data.type} 
            onChange={e => setData({ ...data, type: e.target.value })}
          >
            <option value="text">Text Content</option>
            <option value="image">Image</option>
            <option value="pdf">PDF Document</option>
            <option value="video_upload">Video (Upload)</option>
            <option value="video_link">Video (Link)</option>
            <option value="link">Web Link</option>
          </select>
        </div>

        {data.type === 'text' && (
          <div className="form-group">
            <TiptapEditor
              value={data.text_content}
              onChange={val => setData({ ...data, text_content: val })}
              placeholder="Write your text here..."
            />
          </div>
        )}

        {['image', 'pdf', 'video_upload'].includes(data.type) && (
          <div className="form-group">
            <label className="form-label">Upload {data.type.replace('_', ' ')}</label>
            {block.file && (
              <div style={{ marginBottom: '0.5rem' }}>
                {data.type === 'image' ? (
                  <img src={block.file} alt="" style={{ height: '100px', borderRadius: '4px' }} />
                ) : (
                  <div className="badge badge-info">Current file: {block.file.split('/').pop()}</div>
                )}
              </div>
            )}
            <input 
              type="file" 
              className="form-input" 
              onChange={e => setFile(e.target.files[0])}
              accept={data.type === 'image' ? 'image/*' : data.type === 'pdf' ? '.pdf' : 'video/*'}
            />
          </div>
        )}

        {['video_link', 'link'].includes(data.type) && (
          <div className="form-group">
            <label className="form-label">{data.type === 'video_link' ? 'Video URL' : 'Website URL'}</label>
            <input 
              className="form-input" 
              value={data.url} 
              onChange={e => setData({ ...data, url: e.target.value })} 
              placeholder="https://..." 
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          <button type="submit" className="btn btn-sm btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Block Changes'}
          </button>
          <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onDelete(block.id)}>Delete Block</button>
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
  const [formData, setFormData] = useState({ title: '', description: '' });

  useEffect(() => {
    loadLesson();
  }, [id]);

  const loadLesson = async () => {
    try {
      const { data } = await getLesson(id);
      setLesson(data);
      setFormData({ title: data.title, description: data.description || '' });
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
      alert('Lesson header saved!');
    } catch (err) {
      alert('Failed to save lesson');
    } finally {
      setSaving(false);
    }
  };

  const handleAddBlock = async () => {
    try {
      await createContentBlock({ 
        lesson: id, 
        title: '', 
        type: 'text', 
        text_content: '', 
        order: lesson.content_blocks?.length || 0 
      });
      loadLesson();
    } catch { alert('Failed to add block'); }
  };

  const handleUpdateBlock = async (blockId, data) => {
    try {
      await updateContentBlock(blockId, data);
      alert('Block saved!');
      loadLesson();
    } catch { alert('Failed to save block'); }
  };

  const handleDeleteBlock = async (blockId) => {
    if (window.confirm('Delete this content block?')) {
      await deleteContentBlock(blockId);
      loadLesson();
    }
  };

  const handleMoveBlock = async (index, direction) => {
    const blocks = [...lesson.content_blocks];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;

    const current = blocks[index];
    const target = blocks[targetIndex];

    try {
      await Promise.all([
        updateContentBlock(current.id, { order: target.order }),
        updateContentBlock(target.id, { order: current.order })
      ]);
      loadLesson();
    } catch { alert('Failed to reorder blocks'); }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
  if (!lesson) return <div className="empty-state">Lesson not found</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">Edit Lesson: {lesson.title}</h1>
          <p className="page-subtitle">Manage all video, text, and supporting materials below</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>Back</button>
      </div>

      <div className="auth-card" style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Lesson Title</label>
            <input className="form-input" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Lesson Summary / Description</label>
            <textarea 
              className="form-input" 
              rows="3"
              value={formData.description} 
              onChange={e => setFormData({ ...formData, description: e.target.value })} 
              placeholder="What will students learn in this lesson?"
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Lesson Header'}
          </button>
        </form>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Lesson Content (Flexible Blocks)</h2>
          <button className="btn btn-success" onClick={handleAddBlock}>+ Add New Content Block</button>
        </div>

        {lesson.content_blocks?.length === 0 ? (
          <div className="empty-state" style={{ padding: '3rem', background: 'var(--bg-elevated)', borderRadius: '12px' }}>
            <p className="empty-state-text">No content blocks yet. Add blocks to build your lesson!</p>
            <button className="btn btn-outline-primary" style={{ marginTop: '1rem' }} onClick={handleAddBlock}>Add your first block</button>
          </div>
        ) : (
          <div>
            {lesson.content_blocks?.map((block, idx) => (
              <div key={block.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', padding: '0 0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="badge badge-secondary">#{idx + 1}</span>
                    <span style={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                      {block.type.replace('_', ' ')} Block
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button className="btn btn-sm btn-secondary" onClick={() => handleMoveBlock(idx, -1)} disabled={idx === 0}>↑</button>
                    <button className="btn btn-sm btn-secondary" onClick={() => handleMoveBlock(idx, 1)} disabled={idx === lesson.content_blocks.length - 1}>↓</button>
                  </div>
                </div>
                <ContentBlockEditor block={block} onUpdate={handleUpdateBlock} onDelete={handleDeleteBlock} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
