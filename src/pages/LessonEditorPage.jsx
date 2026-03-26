import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getLesson, updateLesson,
  uploadLessonImage, uploadLessonFile,
  createLessonLink, deleteLessonLink,
  createContentBlock, updateContentBlock, deleteContentBlock
} from '../services/api';
import TiptapEditor from '../components/TiptapEditor';


function ContentBlockEditor({ block, onUpdate, onDelete }) {
  const [data, setData] = useState({ title: block.title || '', content: block.content || '', video_url: block.video_url || '' });
  const [image, setImage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    if (image) formData.append('image', image);
    if (pdfFile) formData.append('pdf_file', pdfFile);
    if (videoFile) formData.append('video_file', videoFile);
    formData.append('video_url', data.video_url || '');

    await onUpdate(block.id, formData);
    setSaving(false);
    // Reset file inputs
    setImage(null);
    setPdfFile(null);
    setVideoFile(null);
  };

  return (
    <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '12px' }}>
      <form onSubmit={handleSave}>
        <div className="form-group">
          <input className="form-input" style={{ marginBottom: '0.75rem', fontWeight: 'bold' }} value={data.title} onChange={e => setData({ ...data, title: e.target.value })} placeholder="Sub-topic Title (optional)" />
        </div>
        <div className="form-group">
          <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Rich Content (Word-like Editor)</label>
          <TiptapEditor
            value={data.content}
            onChange={val => setData({ ...data, content: val })}
            placeholder="Detailed content for this block..."
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
          <div>
            <label className="form-label" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🖼️ Block Image
            </label>
            {block.image && (
              <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
                <img src={block.image} alt="" style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '6px' }} />
              </div>
            )}
            <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} className="form-input" style={{ fontSize: '0.8rem' }} />
          </div>
          <div>
            <label className="form-label" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📄 Block PDF
            </label>
            {block.pdf_file && (
              <div className="badge badge-info" style={{ marginBottom: '0.5rem', display: 'block', width: 'fit-content' }}>
                📄 {block.pdf_file.split('/').pop().substring(0, 20)}...
              </div>
            )}
            <input type="file" accept="application/pdf" onChange={e => setPdfFile(e.target.files[0])} className="form-input" style={{ fontSize: '0.8rem' }} />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label className="form-label" style={{ fontSize: '0.85rem' }}>📺 Block Video (YouTube URL or Upload)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input
                className="form-input"
                style={{ fontSize: '0.8rem' }}
                value={data.video_url || ''}
                onChange={e => setData({ ...data, video_url: e.target.value })}
                placeholder="Video URL (YouTube/Vimeo)"
              />
              <input
                type="file"
                accept="video/*"
                onChange={e => setVideoFile(e.target.files[0])}
                className="form-input"
                style={{ fontSize: '0.8rem' }}
              />
            </div>
            {(block.video_url || block.video_file) && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-success)' }}>
                ✅ Video attached
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
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

  const handleAddLink = async () => {
    const title = prompt('Link Title:');
    if (!title) return;
    const url = prompt('URL:');
    if (!url) return;
    try {
      await createLessonLink({ lesson: id, title, url });
      loadLesson();
    } catch { alert('Failed to add link'); }
  };

  const handleDeleteLink = async (linkId) => {
    if (window.confirm('Delete this link?')) {
      await deleteLessonLink(linkId);
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
              <input className="form-input" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Video URL (YouTube/Vimeo)</label>
              <input className="form-input" value={formData.video_url} onChange={e => setFormData({ ...formData, video_url: e.target.value })} placeholder="https://..." />
            </div>
            <div className="form-group">
              <label className="form-label">Detailed Lesson Content (Supports Microsoft Word–like formatting)</label>
              <TiptapEditor
                value={formData.content}
                onChange={val => setFormData({ ...formData, content: val })}
                placeholder="Write your lesson content here..."
              />
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0, color: 'var(--text-muted)' }}>Block {idx + 1}</h4>
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

          <div className="auth-card" style={{ padding: 'var(--space-lg)' }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: 'var(--space-md)' }}>Supplementary Links</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {lesson.links?.map(link => (
                <div key={link.id} className="badge badge-info" style={{ justifyContent: 'space-between', padding: '0.5rem', display: 'flex', alignItems: 'center' }}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                    🔗 {link.title.substring(0, 20)}...
                  </a>
                  <button onClick={() => handleDeleteLink(link.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: '0.5rem' }}>❌</button>
                </div>
              ))}
              <button className="btn btn-sm btn-secondary btn-block" onClick={handleAddLink}>
                + Add Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
