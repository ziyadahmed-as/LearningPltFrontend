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
      const allLessons = course.lessons || [];
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
          <div className="sidebar-module-title">Course Lessons</div>
          {course.lessons?.map((l, idx) => {
            // A lesson is locked if previous lesson is not completed
            const isLocked = idx > 0 && !course.lessons[idx - 1].is_completed;
            
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

        <div className="lesson-text" style={{ whiteSpace: 'pre-wrap', marginBottom: 'var(--space-3xl)', fontSize: '1.05rem', lineHeight: 1.8 }}>
          {lesson.content}
        </div>

        {lesson.images?.length > 0 && (
          <div style={{ marginBottom: 'var(--space-2xl)' }}>
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
          <div style={{ marginBottom: 'var(--space-2xl)' }}>
            <h3 style={{ marginBottom: 'var(--space-md)' }}>Supporting Resources</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {lesson.files.map(file => (
                <a key={file.id} href={file.file} target="_blank" rel="noopener noreferrer" className="lesson-file-link">
                  📁 {file.title}
                </a>
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
