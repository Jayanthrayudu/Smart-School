import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { fetchAdminDashboardData } from '../../services/dashboardService';
import Loader from '../common/Loader';

// ⭐ Import your Header & Sidebar components
import Header from '../common/Header.jsx';
import Sidebar from '../common/Sidebar.jsx';

function AdminDashboard() {
  const { user } = useContext(AuthContext);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    if (user?.token) {
      setLoading(true);
      fetchAdminDashboardData(user.token)
        .then(res => {
          setStats(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Dashboard error:", err);
          setLoading(false);
        });
    }
  }, [user]);

  const displayName = user?.email
    ? user.email.split("@")[0]
    : "Administrator";

  return (
    <div className="dashboard-layout">

      {/* Fixed Header */}
      <Header onMenuClick={toggleSidebar} />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main Content */}
      <div className="dashboard-content">
        <h2>Welcome {displayName}</h2>
        <p className="dashboard-subtitle">
          Monitor and manage the entire Smart School ecosystem from here.
        </p>

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

        {/* Sections */}
        <div className="dashboard-sections">
          <div className="section">
            <h4>📋 User Management</h4>
            <p>Manage teachers, students, parents.</p>
          </div>

          <div className="section">
            <h4>📚 Courses & Classes</h4>
            <p>Create classes, subjects, assign teachers.</p>
          </div>

          <div className="section">
            <h4>🗓️ Attendance</h4>
            <p>Track daily/monthly attendance.</p>
          </div>

          <div className="section">
            <h4>📝 Grades</h4>
            <p>Upload marks & view analytics.</p>
          </div>

          <div className="section">
            <h4>📨 Announcements</h4>
            <p>Send alerts, notices, reminders.</p>
          </div>

          <div className="section">
            <h4>⚙️ System Settings</h4>
            <p>Manage roles, backups & preferences.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
