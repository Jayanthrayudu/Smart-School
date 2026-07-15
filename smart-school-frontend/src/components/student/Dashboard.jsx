import { useEffect, useState } from "react";
import Header from "../common/Header.jsx";
import Sidebar from "../common/Sidebar.jsx";
import { fetchStudentDashboardData } from "../../services/dashboardService";
import "../../styles/student.css";

function StudentDashboard() {
  const [dashboard, setDashboard] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchStudentDashboardData();
        setDashboard(response.data);
      } catch {
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className={`student-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      <div className="student-content">
        <Header onMenuClick={toggleSidebar} />

        <header className="dashboard-header">
          <h2>🎓 Welcome to Your Dashboard</h2>
          <p>Track your progress, attendance, and grades all in one place.</p>
        </header>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>📚 Enrolled Courses</h3>
            <p>{dashboard.enrolledCoursesCount || 0}</p>
          </div>
          <div className="dashboard-card">
            <h3>📊 Attendance</h3>
            <p>{dashboard.attendancePercentage || 0}%</p>
          </div>
          <div className="dashboard-card">
            <h3>🏆 Average Grade</h3>
            <p>{dashboard.grades?.averageGrade || "N/A"}%</p>
          </div>
          <div className="dashboard-card">
            <h3>📅 Completed Courses</h3>
            <p>{dashboard.grades?.completedCourses || 0}</p>
          </div>
        </div>

        <section className="recent-section">
          <h3>🧾 Recent Assignments</h3>
          {dashboard.recentAssignments?.length > 0 ? (
            <ul>
              {dashboard.recentAssignments.map((a) => (
                <li key={a.id} className="assignment-item">
                  <div>
                    <strong>{a.title}</strong>
                    <p>Due: {a.dueDate || "N/A"}</p>
                  </div>
                  <span className={a.graded ? "graded" : "pending"}>
                    {a.graded ? "✅ Graded" : "⏳ Pending"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-data">No recent assignments available.</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default StudentDashboard;
