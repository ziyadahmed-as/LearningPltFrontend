import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
        <div className="grid-courses">
          {courses.map((course) => (
            <Link to={`/courses/${course.id}`} key={course.id}>
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">{course.title}</h3>
                  <p className="card-subtitle">by {course.instructor_name}</p>
                </div>
                <div className="card-body">
                  <p>{course.description?.substring(0, 120)}...</p>
                </div>
                <div className="card-footer">
                  {parseFloat(course.price) === 0 ? (
                    <span className="badge badge-free">Free</span>
                  ) : (
                    <span className="price-tag">${course.price}</span>
                  )}
                  <span className="badge badge-info">
                    {course.modules?.length || 0} modules
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
