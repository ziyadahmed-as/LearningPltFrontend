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
      .catch(() => {})
      .finally(() => setLoading(false));

    // Record a view for this course
    recordCourseView(id).catch(() => {});
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
    const firstLesson = course.modules?.[0]?.lessons?.[0];
    if (firstLesson) {
      navigate(`/learning/${course.id}/lessons/${firstLesson.id}`);
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

      {course.modules?.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
            Course Content — {course.modules.length} Modules
          </h2>
          {course.modules.map((mod, mi) => (
            <div className="module-card" key={mod.id}>
              <div className="module-header">
                <span>Module {mi + 1}</span>
                {mod.title}
              </div>
              {mod.lessons?.map((lesson, li) => (
                <div 
                  className={`lesson-item ${course.is_enrolled ? 'clickable' : ''}`} 
                  key={lesson.id}
                  onClick={() => course.is_enrolled && navigate(`/learning/${course.id}/lessons/${lesson.id}`)}
                  style={{ cursor: course.is_enrolled ? 'pointer' : 'default' }}
                >
                  <div className="lesson-icon">{li + 1}</div>
                  {lesson.title}
                  {lesson.is_completed && <span className="badge badge-success" style={{ marginLeft: 'var(--space-md)' }}>Completed</span>}
                  {lesson.video_url && <span className="badge badge-info" style={{ marginLeft: 'auto' }}>Video</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
