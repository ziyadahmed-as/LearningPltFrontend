import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  getCourse, 
  getLesson, 
  markLessonCompleted 
} from '../services/api';

export default function LessonViewPage() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    loadData();
  }, [courseId, lessonId]);

  const loadData = async () => {
    setLoading(true);
    setMsg('');
    try {
      const [courseRes, lessonRes] = await Promise.all([
        getCourse(courseId),
        getLesson(lessonId)
      ]);
      setCourse(courseRes.data);
      setLesson(lessonRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    setCompleting(true);
    try {
      await markLessonCompleted(lessonId);
      setMsg('Lesson completed!');
      loadData();
      // Find next lesson to suggest
      const allLessons = course.chapters?.flatMap(c => c.lessons || []) || [];
      const currentIndex = allLessons.findIndex(l => l.id === parseInt(lessonId));
      if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
        const next = allLessons[currentIndex + 1];
        setMsg(prev => prev + ` Next: ${next.title}`);
      }
    } catch (err) {
      setMsg('Error: ' + (err.response?.data?.detail || 'Failed to complete'));
    } finally {
      setCompleting(false);
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
  if (!course || !lesson) return <div className="empty-state">Lesson not found</div>;

  // Check if course is approved. If not, and student is viewing, show restricted message.
  // We assume admins/instructors can still view for quality check.
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isElevated = user.role === 'ADMIN' || user.role === 'INSTRUCTOR';
  
  if (!course.is_approved && !isElevated) {
    return (
      <div className="empty-state" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</h1>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Under Review</h2>
        <p className="empty-state-text" style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto' }}>
          This course is currently undergoing a quality review by our admin team. 
          <strong> Please wait your cource back soon.</strong>
        </p>
        <button className="btn btn-primary" style={{ marginTop: '2rem' }} onClick={() => navigate('/learning')}>
          Back to My Courses
        </button>
      </div>
    );
  }

  const getYoutubeEmbed = (url) => {
    if (!url) return null;
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const embedUrl = getYoutubeEmbed(lesson.video_url);

  return (
    <div className="lesson-content-layout">
      {/* Sidebar */}
      <aside className="lesson-sidebar">
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, padding: 'var(--space-md)' }}>{course.title}</h2>
        <div className="sidebar-modules">
          {course.chapters?.map((chapter, ci) => (
            <div key={chapter.id} style={{ marginBottom: '1rem' }}>
              <div className="sidebar-module-title" style={{ background: 'var(--bg-elevated)', padding: '0.5rem var(--space-md)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                Chapter {ci + 1}: {chapter.title}
              </div>
              {chapter.lessons?.map((l, li) => {
                // Flatten all lessons to check sequential locking
                const allLessons = course.chapters.flatMap(c => c.lessons || []);
                const globalIdx = allLessons.findIndex(lesson => lesson.id === l.id);
                const isLocked = globalIdx > 0 && !allLessons[globalIdx - 1].is_completed;
                
                return (
                  <div 
                    key={l.id} 
                    className={`lesson-progress-item ${l.id === parseInt(lessonId) ? 'active' : ''} ${l.is_completed ? 'completed' : ''} ${isLocked ? 'locked' : ''}`}
                    onClick={() => !isLocked && navigate(`/learning/${courseId}/lessons/${l.id}`)}
                  >
                    <span className="lesson-progress-icon">
                      {l.is_completed ? '✅' : isLocked ? '🔒' : '📖'}
                    </span>
                    <span style={{ flex: 1 }}>{l.title}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="lesson-main">
        <h1 className="page-title">{lesson.title}</h1>
        {msg && <div className={`alert ${msg.startsWith('Error') ? 'alert-error' : 'alert-success'}`}>{msg}</div>}

        {embedUrl && (
          <div className="video-container">
            <iframe src={embedUrl} title="Video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </div>
        )}

        <div className="lesson-text" style={{ marginBottom: 'var(--space-xl)', fontSize: '1.05rem', lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: lesson.content }}>
        </div>

        {/* Dynamic Content Blocks */}
        {lesson.content_blocks?.map((block) => {
          const blockEmbedUrl = getYoutubeEmbed(block.video_url);
          return (
            <div key={block.id} className="content-block" style={{ marginBottom: 'var(--space-2xl)', background: 'var(--bg-elevated)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
              {block.title && <h3 style={{ marginBottom: 'var(--space-md)', fontSize: '1.3rem', fontWeight: 700 }}>{block.title}</h3>}
              
              {/* Block Video */}
              {blockEmbedUrl ? (
                <div className="video-container" style={{ marginBottom: '1.5rem' }}>
                  <iframe src={blockEmbedUrl} title="Block Video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </div>
              ) : block.video_file ? (
                <div style={{ marginBottom: '1.5rem' }}>
                    <video controls style={{ width: '100%', borderRadius: '12px' }}>
                        <source src={block.video_file} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
              ) : null}

              <div style={{ lineHeight: 1.8, color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '1.5rem' }} dangerouslySetInnerHTML={{ __html: block.content }}>
              </div>

              {block.image && (
                <div style={{ margin: '1.5rem 0' }}>
                  <img src={block.image} alt={block.title} style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }} />
                </div>
              )}

              {block.pdf_file && (
                <div style={{ margin: '1.5rem 0' }}>
                  <p style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.9rem' }}>📄 Supporting Document:</p>
                  <div style={{ width: '100%', height: '500px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <embed src={block.pdf_file} type="application/pdf" width="100%" height="100%" />
                  </div>
                  <div style={{ marginTop: '0.75rem' }}>
                    <a href={block.pdf_file} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-secondary">
                        Open PDF in New Tab
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {lesson.images?.length > 0 && (
          <div style={{ marginBottom: 'var(--space-2xl)', borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-xl)' }}>
            <h3 style={{ marginBottom: 'var(--space-md)' }}>Images</h3>
            <div className="lesson-media-grid">
              {lesson.images.map(img => (
                <div key={img.id} className="lesson-image-container">
                  <img src={img.image} alt={img.caption} className="lesson-image" />
                  {img.caption && <p style={{ fontSize: '0.75rem', padding: '0.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>{img.caption}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {lesson.files?.length > 0 && (
          <div style={{ marginBottom: 'var(--space-2xl)', borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-xl)' }}>
            <h3 style={{ marginBottom: 'var(--space-md)' }}>Supporting Resources</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
              {lesson.files.map(file => (
                <div key={file.id}>
                    <p style={{ fontWeight: 600, marginBottom: '0.75rem' }}>📁 {file.title}</p>
                    {file.file.toLowerCase().endsWith('.pdf') ? (
                        <div style={{ width: '100%', height: '600px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                            <embed src={file.file} type="application/pdf" width="100%" height="100%" />
                        </div>
                    ) : (
                        <a href={file.file} target="_blank" rel="noopener noreferrer" className="lesson-file-link">
                           Download {file.title}
                        </a>
                    )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-2xl)', display: 'flex', justifyContent: 'center' }}>
          {!lesson.is_completed ? (
            <button className="btn btn-success btn-block" style={{ maxWidth: '400px', padding: '1rem' }} onClick={handleComplete} disabled={completing}>
              {completing ? 'Taking note...' : 'Mark as Completed'}
            </button>
          ) : (
            <div className="badge badge-success" style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}>
              ✓ You completed this lesson
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
