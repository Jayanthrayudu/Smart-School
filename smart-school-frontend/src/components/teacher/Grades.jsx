import { useState, useEffect } from 'react';
import { getTeacherGrades, submitGrade } from '../../services/gradeService';
import Header from '../common/Header.jsx';
import Sidebar from '../common/Sidebar.jsx';
import '../../styles/teacher.css';

function TeacherGrades() {
  const [grades, setGrades] = useState([]);
  const [formData, setFormData] = useState({ studentName: '', assignmentTitle: '', grade: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const data = await getTeacherGrades();
        setGrades(data);
      } catch {
        setError('Failed to load grades');
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitGrade(formData);
      const updated = await getTeacherGrades();
      setGrades(updated);
      setFormData({ studentName: '', assignmentTitle: '', grade: '' });
    } catch {
      setError('Failed to submit grade');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={`teacher-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      <div className="teacher-content">
        <Header onMenuClick={toggleSidebar} />

        <div className="teacher-grades">
          <h2>Manage Grades</h2>
          {error && <div className="error">{error}</div>}
          <form className="form-container" onSubmit={handleSubmit}>
            <input name="studentName" placeholder="Student Name" value={formData.studentName} onChange={handleChange} required />
            <input name="assignmentTitle" placeholder="Assignment Title" value={formData.assignmentTitle} onChange={handleChange} required />
            <input name="grade" placeholder="Grade" value={formData.grade} onChange={handleChange} required />
            <button type="submit">Submit Grade</button>
          </form>

          <table className="table">
            <thead>
              <tr><th>Course</th><th>Assignment</th><th>Student</th><th>Grade</th></tr>
            </thead>
            <tbody>
              {grades.length > 0 ? grades.map((g, i) => (
                <tr key={i}>
                  <td>{g.courseName}</td>
                  <td>{g.assignmentTitle}</td>
                  <td>{g.studentName}</td>
                  <td>{g.grade}</td>
                </tr>
              )) : <tr><td colSpan="4">No grades submitted yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TeacherGrades;
