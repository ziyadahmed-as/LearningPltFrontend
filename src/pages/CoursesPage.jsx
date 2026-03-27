import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import { getCourses } from '../services/api';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourses()
      .then(({ data }) => setCourses(Array.isArray(data) ? data : data.results || []))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Browse Courses</h1>
        <p className="page-subtitle">Discover courses built by industry experts</p>
      </div>

      {courses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <p className="empty-state-text">No courses available yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid-courses" style={{ padding: '0 var(--space-lg)' }}>
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
