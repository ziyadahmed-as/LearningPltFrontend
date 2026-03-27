import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, BookOpen, TrendingUp } from 'lucide-react';

export default function CourseCard({ course, variant = 'default' }) {
  const isFeatured = variant === 'featured';
  const isTopRated = variant === 'top-rated';

  return (
    <Link to={`/courses/${course.id}`} className={`course-card-premium ${variant}`}>
      {/* Decorative Gradient Background */}
      <div className="course-card-glow"></div>
      
      {/* Badges */}
      <div className="course-card-badges">
        {isTopRated && <span className="badge badge-success"><Star size={12} style={{ marginRight: '4px' }} /> Top Rated</span>}
        {isFeatured && <span className="badge badge-info"><TrendingUp size={12} style={{ marginRight: '4px' }} /> Featured</span>}
        {(!isTopRated && !isFeatured && course.is_new) && <span className="badge badge-new">New</span>}
      </div>

      <div className="course-card-content">
        <div className="course-card-header">
          <h3 className="course-card-title">{course.title}</h3>
          <p className="course-card-instructor">Instructor: <span>{course.instructor_name || 'Expert'}</span></p>
        </div>

        <div className="course-card-body">
          <p className="course-card-description">{course.description?.substring(0, 90) || 'No description available for this amazing course.'}...</p>
          
          <div className="course-card-metrics">
            <div className="metric">
              <Star size={14} className="icon-star" />
              <span>{course.rating || '4.9'}</span>
            </div>
            <div className="metric">
              <BookOpen size={14} className="icon-book" />
              <span>{course.modules?.length || course.chapters?.length || 0} Modules</span>
            </div>
            <div className="metric">
              <Clock size={14} className="icon-clock" />
              <span>12h 30m</span>
            </div>
          </div>
        </div>

        <div className="course-card-footer">
          {parseFloat(course.price) === 0 ? (
            <span className="course-price free">Free</span>
          ) : (
            <span className="course-price">${course.price}</span>
          )}
          <button className="btn btn-sm btn-primary enroll-btn">Enroll Now</button>
        </div>
      </div>
    </Link>
  );
}
