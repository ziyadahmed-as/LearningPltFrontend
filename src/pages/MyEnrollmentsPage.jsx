import { useEffect, useState } from 'react';
import { getMyEnrollments, createCheckoutSession } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';
import { BookOpen, CheckCircle, Clock } from 'lucide-react';

export default function MyEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyEnrollments()
      .then(({ data }) => setEnrollments(Array.isArray(data) ? data : data.results || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handlePay = async (enrollmentId) => {
    try {
      const { data } = await createCheckoutSession(enrollmentId);
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      alert(err.response?.data?.detail || err.response?.data?.error || 'Payment error');
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  const activeCount = enrollments.filter(e => e.is_paid).length;
  const pendingCount = enrollments.length - activeCount;

  return (
    <DashboardLayout 
      title="My Enrollments"
      subtitle="Track your enrolled courses and payment status"
    >
      <div className="stats-grid-modern" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '2rem' }}>
        <StatCard icon={BookOpen} label="Total Enrollments" value={enrollments.length} />
        <StatCard icon={CheckCircle} label="Active Courses" value={activeCount} variant={activeCount > 0 ? "success" : "primary"} />
        <StatCard icon={Clock} label="Pending Payments" value={pendingCount} variant={pendingCount > 0 ? "warning" : "primary"} />
      </div>

      {enrollments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎓</div>
          <p className="empty-state-text">You haven't enrolled in any courses yet</p>
          <a href="/courses" className="btn btn-primary">Browse Courses</a>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Enrolled</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((e) => (
                <tr key={e.id}>
                  <td style={{ fontWeight: 600 }}>{e.course_title}</td>
                  <td>{new Date(e.enrolled_at).toLocaleDateString()}</td>
                  <td>
                    {e.is_paid ? (
                      <span className="badge badge-success">Active</span>
                    ) : (
                      <span className="badge badge-warning">Pending Payment</span>
                    )}
                  </td>
                  <td>
                    {e.is_paid ? (
                      <a href={`/courses/${e.course}`} className="btn btn-sm btn-secondary">Go to Course</a>
                    ) : (
                      <button className="btn btn-sm btn-primary" onClick={() => handlePay(e.id)}>
                        Pay Now
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
