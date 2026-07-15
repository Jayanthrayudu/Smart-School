import { useState, useEffect } from 'react';
import Header from '../common/Header.jsx';
import Sidebar from '../common/Sidebar.jsx';
import { getStudentAssignments, markAssignmentCompleted } from '../../services/assignmentService';
import "../../styles/student.css";

function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await getStudentAssignments();
        setAssignments(data);
      } catch {
        setError('Failed to load assignments');
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const handleStatusChange = async (assignmentId, newStatus) => {
    try {
      if (newStatus === 'Completed') {
        await markAssignmentCompleted(assignmentId);
      }

      setAssignments(prev =>
        prev.map(a =>
          a.id === assignmentId ? { ...a, status: newStatus } : a
        )
      );

      setMessage(`Assignment marked as ${newStatus}!`);
      setTimeout(() => setMessage(''), 3000);
    } catch {
      alert('Failed to update status');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className={`student-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      <div className="student-content">
        <Header onMenuClick={toggleSidebar} />

        <h2>My Assignments</h2>
        {message && <div className="success-message">{message}</div>}

        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Course</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map(a => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.courseName}</td>
                <td>{a.dueDate}</td>
                <td>
                  <select
                    value={a.status || 'Pending'}
                    onChange={(e) => handleStatusChange(a.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentAssignments;
