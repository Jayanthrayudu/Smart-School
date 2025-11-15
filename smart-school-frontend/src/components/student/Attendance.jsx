import { useState, useEffect } from 'react';
import { getStudentAttendance } from '../../services/attendanceService';
import { formatDate } from '../../utils/attendanceHelpers';

function StudentAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const data = await getStudentAttendance();
        setAttendance(data);
      } catch (err) {
        setError('Failed to load attendance');
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="student-attendance">
      <h2>My Attendance</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Course</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((record) => (
            <tr key={record.id}>
              <td>{record.courseName}</td>
              <td>{formatDate(record.date)}</td>
              <td>{record.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentAttendance;