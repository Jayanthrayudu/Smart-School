// src/components/admin/AdminAttendance.jsx
import { useState, useEffect } from 'react';
import { getAllStudents, getAllAttendance } from '../../services/attendanceService';
import Header from '../common/Header.jsx';
import Sidebar from '../common/Sidebar.jsx';
import '../../styles/admin.css';

export default function AdminAttendance() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ⭐ Sidebar Toggle State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, attendanceRes] = await Promise.all([
          getAllStudents(),
          getAllAttendance(),
        ]);

        const studentsWithKey = studentsRes.map((s, i) => ({
          ...s,
          tempKey: `s-${i}`,
        }));
        setStudents(studentsWithKey);

        setAttendance(attendanceRes);
      } catch (err) {
        console.error(err);
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading…</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className={`admin-layout ${isSidebarOpen ? "sidebar-open" : ""}`}>
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

      <div className="admin-content">
        {/* Header */}
        <Header onMenuClick={toggleSidebar} />

        <div className="admin-attendance-container">
          <h2 className="title">Admin Attendance Overview</h2>

          {/* ---------- ALL STUDENTS ---------- */}
          <div className="section">
            <h3>All Students</h3>
            <table className="table">
              <thead>
                <tr><th>#</th><th>Name</th></tr>
              </thead>
              <tbody>
                {students.map((s, idx) => (
                  <tr key={s.tempKey}><td>{idx + 1}</td><td>{s.studentName}</td></tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ---------- ALL ATTENDANCE RECORDS ---------- */}
          <div className="section">
            <h3>All Attendance Records</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th><th>Student ID</th><th>Student Name</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map(a => (
                  <tr key={a.id}>
                    <td>{a.date}</td>
                    <td>{a.id}</td>
                    <td>{a.studentName}</td>
                    <td style={{
                      color: a.status?.toLowerCase() === 'present' ? 'green' : 'red',
                      fontWeight: 'bold'
                    }}>
                      {a.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
