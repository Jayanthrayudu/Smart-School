import { useState, useEffect } from 'react';
import { getStudentAssignments, markAssignmentCompleted } from '../../services/assignmentService';

function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await getStudentAssignments();
        setAssignments(data);
      } catch (err) {
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

      // Update frontend state
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === assignmentId ? { ...a, status: newStatus } : a
        )
      );

      // Show success message
      setMessage(`Assignment marked as ${newStatus}!`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="student-assignments">
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
          {assignments.map((assignment) => (
            <tr key={assignment.id}>
              <td>{assignment.title}</td>
              <td>{assignment.courseName}</td>
              <td>{assignment.dueDate}</td>
              <td>
                <select
                  value={assignment.status || 'Pending'}
                  onChange={(e) =>
                    handleStatusChange(assignment.id, e.target.value)
                  }
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
  );
}

export default StudentAssignments;
