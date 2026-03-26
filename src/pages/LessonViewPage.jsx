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
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>{lesson.title}</h1>
          {lesson.description && (
             <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontStyle: 'italic' }}>{lesson.description}</p>
          )}
        </div>
        
        {msg && <div className={`alert ${msg.startsWith('Error') ? 'alert-error' : 'alert-success'}`}>{msg}</div>}

        <div className="lesson-blocks">
          {lesson.content_blocks?.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <p className="empty-state-text">No content available for this lesson yet.</p>
            </div>
          ) : (
            lesson.content_blocks.map((block) => (
              <div key={block.id} className="content-block" style={{ marginBottom: '2.5rem' }}>
                {block.title && <h3 style={{ marginBottom: '1rem', fontSize: '1.4rem', fontWeight: 600 }}>{block.title}</h3>}
                
                {block.type === 'text' && (
                  <div className="lesson-text" style={{ fontSize: '1.05rem', lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: block.text_content }}></div>
                )}

                {block.type === 'image' && block.file && (
                   <div style={{ margin: '1.5rem 0' }}>
                      <img src={block.file} alt={block.title} style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                   </div>
                )}

                {block.type === 'pdf' && block.file && (
                   <div style={{ margin: '1.5rem 0' }}>
                      <div style={{ width: '100%', height: '600px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                        <embed src={block.file} type="application/pdf" width="100%" height="100%" />
                      </div>
                      <div style={{ marginTop: '0.75rem' }}>
                        <a href={block.file} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                            Open PDF in New Tab
                        </a>
                      </div>
                   </div>
                )}

                {block.type === 'video_upload' && block.file && (
                   <div style={{ margin: '1.5rem 0' }}>
                      <video controls style={{ width: '100%', borderRadius: '12px', background: '#000' }}>
                        <source src={block.file} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                   </div>
                )}

                {block.type === 'video_link' && block.url && (
                   <div style={{ margin: '1.5rem 0' }}>
                      <div className="video-container">
                        <iframe 
                          src={getYoutubeEmbed(block.url)} 
                          title="Block Video" 
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        ></iframe>
                      </div>
                   </div>
                )}

                {block.type === 'link' && block.url && (
                   <div className="badge badge-info" style={{ justifyContent: 'flex-start', padding: '1rem', display: 'flex', alignItems: 'center', margin: '1rem 0' }}>
                      <a href={block.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.2rem' }}>🔗</span>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600 }}>{block.title || 'External Link'}</span>
                          <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{new URL(block.url).hostname}</span>
                        </div>
                      </a>
                   </div>
                )}
              </div>
            ))
          )}
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '2.5rem', display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
          {!lesson.is_completed ? (
            <button className="btn btn-success" style={{ minWidth: '300px', padding: '1rem 2rem', fontSize: '1.1rem', fontWeight: 600 }} onClick={handleComplete} disabled={completing}>
              {completing ? 'Completing...' : 'Mark Lesson as Completed'}
            </button>
          ) : (
            <div className="badge badge-success" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '30px' }}>
              ✓ You have completed this lesson
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
