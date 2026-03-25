import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChatWidget from '../components/ChatWidget';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="hero">
      <h1 className="hero-title">Master Full-Stack Development</h1>
      <p className="hero-subtitle">
        Build production-ready applications with Django, React, and modern tools.
        Learn APIs, authentication, payments, and deployment from industry experts.
      </p>
      <div className="hero-buttons">
        <Link to="/courses" className="btn btn-primary">Explore Courses</Link>
        {!user && <Link to="/register" className="btn btn-secondary">Create Account</Link>}
        {user?.role === 'INSTRUCTOR' && (
          <Link to="/my-courses" className="btn btn-secondary">Manage Your Courses</Link>
        )}
      </div>
      <ChatWidget />
    </div>
  );
}
