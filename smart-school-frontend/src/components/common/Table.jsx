import React, { useState } from 'react';
import '../../styles/Table.css'; // optional CSS for styling

/**
 * Props:
 * - data: array of objects (students or attendance entries)
 * - markAttendance: function to call when marking attendance (optional)
 */
function Table({ data = [], markAttendance }) {
  const [attendanceStatus, setAttendanceStatus] = useState({});

  const handleChange = (studentId, status) => {
    setAttendanceStatus(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = () => {
    if (markAttendance) {
      markAttendance(attendanceStatus);
    }
  };

  if (!data.length) return <p>No data available.</p>;

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            {data[0].email && <th>Email</th>}
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.name || item.studentName}</td>
              {item.email && <td>{item.email}</td>}
              <td>
                {markAttendance ? (
                  <select
                    value={attendanceStatus[item.id] || ''}
                    onChange={(e) => handleChange(item.id, e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="leave">Leave</option>
                  </select>
                ) : (
                  item.status || '—'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {markAttendance && (
        <button className="button" onClick={handleSubmit}>
          Mark Attendance
        </button>
      )}
    </div>
  );
}

export default Table;
