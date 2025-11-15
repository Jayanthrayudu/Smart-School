import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { fetchTeacherDashboardData } from '../../services/dashboardService';
import { Link } from 'react-router-dom';

function TeacherDashboard() {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      // 🟡 Wait until user is available — don't exit, just delay fetch
      if (!user || !user.email) return;

      try {
        const response = await fetchTeacherDashboardData();
        const data = response?.data || response;

        setDashboardData(data);
      } catch (err) {
        console.error('❌ Error loading teacher dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  // 🟢 Prevent infinite loading if user not ready
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!dashboardData && !user) setLoading(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, [dashboardData, user]);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (!dashboardData) {
    return <p>No dashboard data found.</p>;
  }

  const {
    assignedCourses = [],
    assignedCoursesCount = 0,
    pendingGrading = 0,
  } = dashboardData;

  return (
    <div className="teacher-dashboard">
      <header className="dashboard-header">
        <h1>Hello, {user?.name || user?.username || 'Teacher'}</h1>
        <p className="subtext">Manage your teaching journey, effortlessly.</p>
      </header>

      {/* === Metrics Section === */}
      <section className="metrics-grid">
        <div className="metric-card">
          <h3>📘 Assigned Courses</h3>
          <p>{assignedCoursesCount}</p>
        </div>
        <div className="metric-card">
          <h3>📝 Pending Grading</h3>
          <p>{pendingGrading}</p>
        </div>
        <div className="metric-card">
          <h3>📆 Upcoming Classes</h3>
          <p>3 Today</p>
        </div>
        <div className="metric-card">
          <h3>💬 Student Feedback</h3>
          <p>12 new</p>
        </div>
      </section>

      {/* === Assigned Courses Section === */}
      <section className="teacher-section">
        <h2>👨‍🏫 Your Courses</h2>

        {assignedCourses.length === 0 ? (
          <p>No courses assigned yet.</p>
        ) : (
          <div className="course-list">
            {assignedCourses.map((course) => (
              <div key={course.id} className="course-card">
                <div className="course-info">
                  <h4>{course.name}</h4>
                  <p>🕒 {course.schedule || 'No schedule available'}</p>
                </div>
                <div className="course-actions">
                  <Link to={`/teacher/courses/${course.id}/attendance`}>📅 Attendance</Link>
                  <Link to={`/teacher/courses/${course.id}/grades`}>📝 Grades</Link>
                  <Link to={`/teacher/courses/${course.id}/assignments`}>📚 Assignments</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* === Extra Section === */}
      <section className="teacher-extras">
        <div className="extra-card">
          <h4>🗓️ Schedule</h4>
          <p>Review your week and class timings.</p>
        </div>
        <div className="extra-card">
          <h4>✉️ Announcements</h4>
          <p>Communicate updates to students.</p>
        </div>
        <div className="extra-card">
          <h4>⚙️ Gradebook</h4>
          <p>Update or review student marks.</p>
        </div>
      </section>
    </div>
  );
}

export default TeacherDashboard;
