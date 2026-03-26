import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCourses } from '../services/api';

export default function HomePage() {
  const { user } = useAuth();
  const [featuredCourses, setFeaturedCourses] = useState([]);

  useEffect(() => {
    getCourses().then(res => {
      const all = Array.isArray(res.data) ? res.data : res.data.results || [];
      setFeaturedCourses(all.slice(0, 3));
    }).catch(() => {});
  }, []);

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero container">
        <h1 className="hero-title">
          Inspiring the Next Generation of <span style={{ color: 'var(--accent-primary)' }}>Ethiopian Leaders</span>
        </h1>
        <p className="hero-subtitle">
          From Grade 9-12 Entrance Exam prep to high-demand Technology skills. 
          Learn from experts, join live classes, and master your future.
        </p>
        <div className="hero-buttons">
          <Link to="/courses" className="btn btn-primary">Start Learning Now</Link>
          {!user && <Link to="/register" className="btn btn-secondary">Create Free Account</Link>}
        </div>
      </section>

      {/* Categories Section */}
      <section className="section container">
        <div className="section-header">
          <h2 className="section-title">What do you want to learn?</h2>
          <p className="section-subtitle">Choose your path and start your journey today.</p>
        </div>
        <div className="features-grid">
          <div className="card feature-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
              <img src="/ethiopian_role_model_student_1774533798043.png" alt="Top Scorer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '1rem', color: 'white' }}>
                <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>Top Scorer</span>
                <h4 style={{ margin: 0 }}>Amanuel T.</h4>
                <p style={{ fontSize: '0.75rem', margin: 0 }}>9th Grade National Exam: 98%</p>
              </div>
            </div>
            <div style={{ padding: '1.5rem', textAlign: 'left' }}>
              <h3 className="card-title">Entrance Exam Prep</h3>
              <p className="card-body">Score like Amanuel. Master Mathematics, Physics, and more with our proven curriculum.</p>
            </div>
          </div>
          
          <div className="card feature-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
              <img src="/ethiopian_expert_instructor_1774533894053.png" alt="Expert Instructor" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '1rem', color: 'white' }}>
                <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>Master Instructor</span>
                <h4 style={{ margin: 0 }}>Dr. Selamawit G.</h4>
                <p style={{ fontSize: '0.75rem', margin: 0 }}>Senior Software Architect & Researcher</p>
              </div>
            </div>
            <div style={{ padding: '1.5rem', textAlign: 'left' }}>
              <h3 className="card-title">Technology & Code</h3>
              <p className="card-body">Learn from industry veterans. Web dev, AI, and systems design taught with local context.</p>
            </div>
          </div>

          <div className="card feature-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="feature-icon">🌐</div>
            <h3 className="card-title">Soft Skills</h3>
            <p className="card-body">Communication, Leadership, and Digital Literacy skills essential for modern workplace success.</p>
            <Link to="/courses" className="btn btn-sm btn-secondary" style={{ marginTop: '1rem' }}>Browse Skills</Link>
          </div>
        </div>
      </section>

      {/* Top Rated Courses Section */}
      <section className="section" style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-2xl)', margin: 'var(--space-xl) var(--space-lg)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">⭐ Top Rated Courses</h2>
            <p className="section-subtitle">Verified high-quality content based on student feedback and results.</p>
          </div>
          <div className="grid-courses">
            {featuredCourses.length > 0 ? featuredCourses.map(course => (
              <Link to={`/courses/${course.id}`} key={course.id} className="card" style={{ background: 'var(--bg-card)' }}>
                 <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <span className="badge badge-success">Top Rated</span>
                 </div>
                 <div className="card-header">
                    <h3 className="card-title">{course.title}</h3>
                    <p className="card-subtitle">by {course.instructor_name}</p>
                 </div>
                 <div className="card-body">
                    <div style={{ display: 'flex', color: '#fbbf24', marginBottom: '0.5rem' }}>
                       ★★★★★ <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem', fontSize: '0.8rem' }}>(4.9/5)</span>
                    </div>
                    <p>{course.description?.substring(0, 80)}...</p>
                 </div>
                 <div className="card-footer">
                    <span className="price-tag">${course.price}</span>
                    <button className="btn btn-sm btn-primary">Enroll Now</button>
                 </div>
              </Link>
            )) : <p style={{ textAlign: 'center', width: '100%', color: 'var(--text-muted)' }}>Loading top rated courses...</p>}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="section section-light">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Courses</h2>
            <p className="section-subtitle">Start with our most popular and highest-rated programs.</p>
          </div>
          <div className="grid-courses">
            {featuredCourses.map(course => (
              <Link to={`/courses/${course.id}`} key={course.id} className="card">
                <div className="badge-new">NEW</div>
                <div className="card-header">
                  <h3 className="card-title">{course.title}</h3>
                  <p className="card-subtitle">by {course.instructor_name}</p>
                </div>
                <div className="card-body">
                  <p>{course.description?.substring(0, 100)}...</p>
                </div>
                <div className="card-footer">
                   <span className="price-tag">${course.price}</span>
                   <span className="badge badge-info">{course.chapters?.length || 0} Chapters</span>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 'var(--space-2xl)' }}>
            <Link to="/courses" className="btn btn-secondary">View All Courses</Link>
          </div>
        </div>
      </section>

      {/* Live Classes Section */}
      <section id="live" className="section container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div className="live-indicator">
              <span className="live-dot"></span>
              Live Classes
            </div>
            <h2 className="section-title" style={{ textAlign: 'left', marginTop: '0.5rem' }}>
              Interactive Live Sessions with Top Tutors
            </h2>
            <p className="section-subtitle" style={{ textAlign: 'left', marginBottom: 'var(--space-xl)' }}>
              Don't just watch videos—join live Q&A sessions, coding bootcamps, and exam review marathons. 
              Get your questions answered in real-time.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: 'var(--space-xl)' }}>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>✅ Real-time interaction</li>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>✅ Downloadable session notes</li>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>✅ Group study environments</li>
            </ul>
            <button className="btn btn-primary">See Schedule</button>
          </div>
          <div style={{ flex: 1, minWidth: '300px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-2xl)', textAlign: 'center' }}>
             <div style={{ fontSize: '4rem' }}>📡</div>
             <h4 style={{ marginTop: '1rem' }}>Next Live Class Starts In:</h4>
             <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem', fontSize: '1.5rem', fontWeight: 800 }}>
                <div>02<span style={{ fontSize: '0.8rem', display: 'block', fontWeight: 400 }}>Hours</span></div>
                <div>45<span style={{ fontSize: '0.8rem', display: 'block', fontWeight: 400 }}>Mins</span></div>
                <div>12<span style={{ fontSize: '0.8rem', display: 'block', fontWeight: 400 }}>Secs</span></div>
             </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section section-light">
        <div className="container features-grid">
           <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>10k+</h2>
              <p>Active Learners</p>
           </div>
           <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>500+</h2>
              <p>Verified Instructors</p>
           </div>
           <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>98%</h2>
              <p>Success Rate</p>
           </div>
        </div>
      </section>

      {/* Become an Instructor */}
      <section className="section container">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: 'var(--space-2xl)', border: 'none', background: 'var(--bg-elevated)' }}>
           <div style={{ fontSize: '4rem' }}>👨‍🏫</div>
           <div style={{ flex: 1 }}>
              <h2 style={{ marginBottom: '0.5rem' }}>Become an Instructor</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Share your knowledge with thousands of students and earn revenue while you sleep. We provide the tools, you provide the expertise.</p>
              <Link to="/register" className="btn btn-primary">Start Teaching Today</Link>
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container">
        <div className="cta-section">
          <h2 className="cta-title">Ready to Transform Your Future?</h2>
          <p className="cta-subtitle">Join thousands of students across Ethiopia mastering new skills every day.</p>
          <div className="hero-buttons">
            <Link to="/register" className="btn" style={{ background: 'white', color: 'var(--accent-primary)' }}>Join for Free</Link>
            <Link to="/courses" className="btn btn-secondary" style={{ border: '1px solid white', color: 'white' }}>Browse Catalog</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <Link to="/" className="footer-logo">
                <span style={{ color: 'var(--accent-primary)' }}>Fatra</span> Academy
              </Link>
              <p style={{ fontSize: '0.9rem' }}>The premier digital learning platform for Ethiopian students. Quality education, accessible everywhere.</p>
            </div>
            <div>
              <h4 className="footer-links-title">Platform</h4>
              <Link to="/courses" className="footer-link">Browse Courses</Link>
              <Link to="/#live" className="footer-link">Live Classes</Link>
              <Link to="/register" className="footer-link">Sign Up</Link>
            </div>
            <div>
              <h4 className="footer-links-title">Support</h4>
              <Link to="/help" className="footer-link">Help Center</Link>
              <Link to="/contact" className="footer-link">Contact Us</Link>
              <Link to="/faq" className="footer-link">FAQ</Link>
            </div>
            <div>
              <h4 className="footer-links-title">Legal</h4>
              <Link to="/terms" className="footer-link">Terms of Service</Link>
              <Link to="/privacy" className="footer-link">Privacy Policy</Link>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-xl)', textAlign: 'center', fontSize: '0.8rem' }}>
            © 2026 Fatra Academy. All rights reserved. Made with ❤️ in Ethiopia.
          </div>
        </div>
      </footer>
    </div>
  );
}
