import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { fetchAdminDashboardData } from '../../services/dashboardService';
import Loader from '../common/Loader';

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null); // null while loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.token) {
      setLoading(true);
      fetchAdminDashboardData(user.token)
        .then(res => {
          setStats(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Dashboard error:', err);
          setLoading(false);
        });
    }
  }, [user]);

  const displayName = user?.email ? user.email.split("@")[0] : "Administrator";

  return (
    <div className="admin-dashboard">
      <h2>Welcome {displayName}</h2>
      <p className="dashboard-subtitle">
        Monitor and manage the entire Smart School ecosystem from here.
      </p>

      {/* Dashboard Statistics */}
      {loading ? (
        <Loader />
      ) : (
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Total Students</h3>
            <p>{stats?.students}</p>
          </div>
          <div className="dashboard-card">
            <h3>Total Teachers</h3>
            <p>{stats?.teachers}</p>
          </div>
          <div className="dashboard-card">
            <h3>Courses Offered</h3>
            <p>{stats?.courses}</p>
          </div>
          <div className="dashboard-card">
            <h3>Attendance Issues</h3>
            <p>{stats?.attendanceIssues}</p>
          </div>
        </div>
      )}

      {/* Feature Sections */}
      <div className="dashboard-sections">
        <div className="section">
          <h4>📋 User Management</h4>
          <p>Manage teachers, students, and parents. Add, update, delete, or reset accounts.</p>
        </div>
        <div className="section">
          <h4>📚 Course & Class Control</h4>
          <p>Create new classes, assign teachers, manage subjects, and set schedules.</p>
        </div>
        <div className="section">
          <h4>🗓️ Attendance & Reports</h4>
          <p>Track daily/monthly attendance. View absentee reports and generate summaries.</p>
        </div>
        <div className="section">
          <h4>📝 Grade & Exam Control</h4>
          <p>Upload marks, view exam schedules, and monitor student performance analytics.</p>
        </div>
        <div className="section">
          <h4>📨 Notifications & Announcements</h4>
          <p>Send important alerts to students or staff. Set reminders or publish notices.</p>
        </div>
        <div className="section">
          <h4>⚙️ System Settings</h4> 
          <p>Configure login roles, access control, database backups, and school preferences.</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
