import { useState, useEffect } from 'react';
import Header from '../common/Header.jsx';
import Sidebar from '../common/Sidebar.jsx';
import { getStudentGrades } from '../../services/gradeService';
import "../../styles/student.css";

function StudentGrades() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const data = await getStudentGrades();
        setGrades(data);
      } catch {
        setError('Failed to load grades');
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className={`student-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      <div className="student-content">
        <Header onMenuClick={toggleSidebar} />

        <h2>My Grades</h2>
        <table className="grades-table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Assignment</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {grades.length > 0 ? (
              grades.map(grade => (
                <tr key={grade.id}>
                  <td>{grade.courseName || 'Unknown Course'}</td>
                  <td>{grade.assignmentTitle || 'N/A'}</td>
                  <td className={`grade-value grade-${(grade.grade || '').toLowerCase()}`}>
                    {grade.grade || '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="no-data">No grades found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentGrades;
