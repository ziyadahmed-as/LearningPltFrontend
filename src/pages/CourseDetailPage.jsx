import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourse, enrollCourse, recordCourseView } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CourseDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrollMsg, setEnrollMsg] = useState('');
  const [enrollError, setEnrollError] = useState('');

  useEffect(() => {
    getCourse(id)
      .then(({ data }) => setCourse(data))
      .catch(() => { })
      .finally(() => setLoading(false));

    // Record a view for this course
    recordCourseView(id).catch(() => { });
  }, [id]);

  const handleEnroll = async () => {
    setEnrollMsg('');
    setEnrollError('');
    try {
      const { data } = await enrollCourse(id);
      setEnrollMsg(data.detail);
      // Reload course to update is_enrolled
      getCourse(id).then(({ data }) => setCourse(data));
    } catch (err) {
      setEnrollError(err.response?.data?.detail || 'Failed to enroll');
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
  if (!course) return <div className="empty-state"><p className="empty-state-text">Course not found</p></div>;

  const startLearning = () => {
    const firstChapter = course.chapters?.[0];
    const firstLesson = firstChapter?.lessons?.[0];
    if (firstLesson) {
      navigate(`/learning/${course.id}/lessons/${firstLesson.id}`);
    } else {
      alert("No lessons available in this course yet.");
    }
  };

  return (
    <div>
      <div className="course-detail-header">
        <div className="course-detail-info">
          <h1 className="page-title">{course.title}</h1>
          <p className="page-subtitle" style={{ marginBottom: '0.5rem' }}>
            Instructor: <strong>{course.instructor_name}</strong>
          </p>
          {parseFloat(course.price) === 0 ? (
            <span className="badge badge-free" style={{ fontSize: '0.85rem' }}>Free Course</span>
          ) : (
            <span className="price-tag">${course.price}</span>
          )}
        </div>
        <div className="course-detail-actions">
          {user && user.role === 'STUDENT' && !course.is_enrolled && (
            <button className="btn btn-primary" onClick={handleEnroll}>Enroll Now</button>
          )}
          {user && user.role === 'STUDENT' && course.is_enrolled && (
            <button className="btn btn-success" onClick={startLearning}>Start Learning</button>
          )}
          {!user && (
            <a href="/login" className="btn btn-primary">Login to Enroll</a>
          )}
        </div>
      </div>

      {enrollMsg && <div className="alert alert-success">{enrollMsg}</div>}
      {enrollError && <div className="alert alert-error">{enrollError}</div>}

      <div style={{ marginBottom: 'var(--space-2xl)' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 'var(--space-md)' }}>About this Course</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{course.description}</p>
      </div>

      {course.chapters?.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
            Course Content — {course.chapters.length} Chapters
          </h2>
          {course.chapters.map((chapter, ci) => (
            <div className="module-card" key={chapter.id} style={{ marginBottom: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
              <div className="module-header" style={{ padding: '1rem', background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)', fontWeight: 'bold' }}>
                <span style={{ color: 'var(--primary)', marginRight: '0.5rem' }}>Chapter {ci + 1}:</span>
                {chapter.title}
              </div>
              <div style={{ padding: '0.5rem' }}>
                {chapter.lessons?.length === 0 && <p style={{ padding: '0.5rem', color: 'var(--text-muted)' }}>No lessons available.</p>}
                {chapter.lessons?.map((lesson, li) => (
                  <div
                    className={`lesson-item ${course.is_enrolled ? 'clickable' : ''}`}
                    key={lesson.id}
                    onClick={() => course.is_enrolled && navigate(`/learning/${course.id}/lessons/${lesson.id}`)}
                    style={{ 
                      cursor: course.is_enrolled ? 'pointer' : 'default', 
                      display: 'flex', alignItems: 'center', padding: '0.75rem',
                      borderBottom: '1px solid var(--bg-hover)'
                    }}
                  >
                    <div className="lesson-icon" style={{
                      width: '24px', height: '24px', borderRadius: '50%', background: 'var(--background)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', marginRight: 'var(--space-md)', color: 'var(--text-muted)', border: '1px solid var(--border)'
                    }}>{li + 1}</div>
                    <span>{lesson.title}</span>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {lesson.video_url && <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>🎬 Video</span>}
                      {lesson.content_blocks?.length > 0 && <span className="badge" style={{ fontSize: '0.7rem', background: 'var(--border)' }}>📝 {lesson.content_blocks.length} sections</span>}
                      {lesson.is_completed && <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>✅ Done</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
