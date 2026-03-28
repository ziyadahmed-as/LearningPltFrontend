import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import { useAuth } from '../context/AuthContext';
import { getCourses, getInstructorStats } from '../services/api';
import { Eye } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  const [featuredCourses, setFeaturedCourses] = useState([]);

  const [stats, setStats] = useState(null);

  useEffect(() => {
    getCourses().then(res => {
      const all = Array.isArray(res.data) ? res.data : res.data.results || [];
      setFeaturedCourses(all.slice(0, 3));
    }).catch(() => {});

    getInstructorStats().then(res => setStats(res.data)).catch(() => {});
  }, []);

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background" style={{ backgroundImage: 'url(/hero_image_new.jpg)', filter: 'brightness(0.9) contrast(1.1)' }}></div>
        <div className="hero-overlay" style={{ background: 'linear-gradient(135deg, rgba(8, 8, 16, 0.85) 0%, rgba(8, 8, 16, 0.5) 50%, rgba(8, 8, 16, 0.85) 100%), radial-gradient(circle at center, transparent 0%, rgba(8, 8, 16, 0.4) 100%)' }}></div>
        <div className="container hero-content">
          <h1 className="hero-title white">
            <span style={{ 
              background: 'var(--accent-gradient)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              display: 'block',
              fontSize: '0.45em',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: '1rem'
            }}>Empowering Progress</span>
            Inspiring the Next Generation of <br/>
            <span style={{ color: 'var(--eth-yellow)', textShadow: '0 0 30px rgba(254, 203, 0, 0.4)' }}>Ethiopian Leaders</span>
          </h1>
          <p className="hero-subtitle" style={{ color: '#a855f7', fontSize: '1.25rem', fontWeight: 600, maxWidth: '800px', lineHeight: 1.6 }}>
            From Grade 9-12 Entrance Exam prep to high-demand Technology skills. <br/>
            Learn from experts, join live classes, and master your future.
          </p>
          <div className="hero-buttons">
            <Link to="/courses" className="btn btn-primary">Start Learning Now</Link>
            {!user && <Link to="/register" className="btn btn-secondary" style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}>Create Free Account</Link>}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section container">
        <div className="section-header">
          <h2 className="section-title">What do you want to learn?</h2>
          <p className="section-subtitle">Choose your path and start your journey today.</p>
        </div>
        <div className="features-grid">
          {/* Soft Skills Card */}
          <div className="card feature-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
              <img src="/soft_skills.png" alt="Soft Skills" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(8, 8, 16, 0.85) 100%)' }}></div>
              <div style={{ position: 'absolute', bottom: '1.2rem', left: '1.2rem', color: 'white' }}>
                <span className="badge badge-info" style={{ marginBottom: '0.4rem', background: 'rgba(59, 130, 246, 0.2)', backdropFilter: 'blur(4px)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>Career Growth</span>
                <h4 style={{ margin: 0, fontSize: '1.2rem' }}>Soft Skills</h4>
              </div>
            </div>
            <div style={{ padding: '1.5rem', textAlign: 'left' }}>
              <p className="card-body" style={{ margin: 0, fontSize: '0.9rem' }}>Master communication, leadership, and critical thinking essential for thriving in the modern workplace.</p>
              <Link to="/courses" className="btn btn-sm btn-secondary" style={{ marginTop: '1.2rem', width: '100%' }}>Explore Skills</Link>
            </div>
          </div>

          {/* Tech Courses Card */}
          <div className="card feature-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
              <img src="/tech_courses.png" alt="Tech Courses" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(8, 8, 16, 0.85) 100%)' }}></div>
              <div style={{ position: 'absolute', bottom: '1.2rem', left: '1.2rem', color: 'white' }}>
                <span className="badge badge-success" style={{ marginBottom: '0.4rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>Engineering</span>
                <h4 style={{ margin: 0, fontSize: '1.2rem' }}>Tech Courses</h4>
              </div>
            </div>
            <div style={{ padding: '1.5rem', textAlign: 'left' }}>
              <p className="card-body" style={{ margin: 0, fontSize: '0.9rem' }}>Dive deep into full-stack development, AI, and cloud infrastructure with industry-standard curriculum.</p>
              <Link to="/courses" className="btn btn-sm btn-secondary" style={{ marginTop: '1.2rem', width: '100%' }}>Start Coding</Link>
            </div>
          </div>

          {/* Live Tutorial Card */}
          <div className="card feature-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
              <img src="/live_tutorials.png" alt="Live Tutorials" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(8, 8, 16, 0.85) 100%)' }}></div>
              <div style={{ position: 'absolute', bottom: '1.2rem', left: '1.2rem', color: 'white' }}>
                <span className="badge badge-warning" style={{ marginBottom: '0.4rem', border: '1px solid rgba(245, 158, 11, 0.3)' }}>Real-time</span>
                <h4 style={{ margin: 0, fontSize: '1.2rem' }}>Live Tutorials</h4>
              </div>
            </div>
            <div style={{ padding: '1.5rem', textAlign: 'left' }}>
              <p className="card-body" style={{ margin: 0, fontSize: '0.9rem' }}>Join interactive live sessions with experts. Ask questions, get feedback, and learn together in real-time.</p>
              <Link to="/courses" className="btn btn-sm btn-secondary" style={{ marginTop: '1.2rem', width: '100%' }}>Join Live</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="mission-vision-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Who We Are</h2>
            <p className="section-subtitle">Driving the future of education with passion, innovation, and unwavering commitment.</p>
          </div>
          <div className="mission-vision-grid">
            {/* Mission Card */}
            <div className="mv-card">
              <div className="mv-icon">🚀</div>
              <h3 className="mv-title">Our Mission</h3>
              <p className="mv-text">
                To democratize high-quality education by providing accessible, world-class learning experiences that empower individuals to achieve their fullest potential and excel in a rapidly evolving global economy.
              </p>
            </div>
            {/* Vision Card */}
            <div className="mv-card">
              <div className="mv-icon">👁️</div>
              <h3 className="mv-title">Our Vision</h3>
              <p className="mv-text">
                To become the most trusted and innovative educational platform globally, cultivating a community of lifelong learners, expert instructors, and visionary leaders who shape a brighter tomorrow.
              </p>
            </div>
          </div>
          <div className="mv-background-decoration"></div>
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
            {featuredCourses.length > 0 ? (
              featuredCourses.map(course => <CourseCard key={`top-${course.id}`} course={course} variant="top-rated" />)
            ) : (
              <p style={{ textAlign: 'center', width: '100%', color: 'var(--text-muted)' }}>Loading top rated courses...</p>
            )}
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
            {featuredCourses.length > 0 ? (
              featuredCourses.map(course => <CourseCard key={`featured-${course.id}`} course={{...course, is_new: true}} variant="featured" />)
            ) : (
              <p style={{ textAlign: 'center', width: '100%', color: 'var(--text-muted)' }}>Loading featured courses...</p>
            )}
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
       <section className="section section-light" style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-primary)', padding: 'var(--space-2xl) 0' }}>
         <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', textAlign: 'center' }}>
            <div style={{ padding: '0.5rem' }}>
               <h2 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0 }}>10k+</h2>
               <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Learners</p>
            </div>
            <div style={{ padding: '0.5rem', borderLeft: '1px solid var(--border-subtle)' }}>
               <h2 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0 }}>500+</h2>
               <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Instructors</p>
            </div>
            <div style={{ padding: '0.5rem', borderLeft: '1px solid var(--border-subtle)' }}>
               <h2 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0, color: 'var(--success)' }}>98%</h2>
               <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Success</p>
            </div>
            <div style={{ padding: '0.5rem', borderLeft: '1px solid var(--border-subtle)' }}>
               <h2 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                 <Eye size={16} style={{ color: 'var(--accent-primary)' }} />
                 {stats?.total_views || 13}
               </h2>
               <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Traffic</p>
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
