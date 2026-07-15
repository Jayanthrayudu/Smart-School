import { useState, useEffect } from 'react';
import { getTeacherAssignments, createAssignment } from '../../services/assignmentService';
import Header from '../common/Header.jsx';
import Sidebar from '../common/Sidebar.jsx';
import '../../styles/teacher.css';

function TeacherAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [formData, setFormData] = useState({ title: '', courseName: '', dueDate: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await getTeacherAssignments();
        setAssignments(data);
      } catch {
        setError('Failed to load assignments');
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newAssignment = await createAssignment(formData);
      setAssignments(prev => [...prev, newAssignment]);
      setFormData({ title: '', courseName: '', dueDate: '' });
    } catch {
      setError('Failed to create assignment');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className={`teacher-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      <div className="teacher-content">
        <Header onMenuClick={toggleSidebar} />

        <div className="teacher-assignments">
          <h2>Manage Assignments</h2>
          <form className="form-container" onSubmit={handleSubmit}>
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Assignment Title" />
            <input type="text" name="courseName" value={formData.courseName} onChange={handleChange} placeholder="Course Name" />
            <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} />
            <button type="submit">Create Assignment</button>
          </form>

          <table className="table">
            <thead>
              <tr><th>Title</th><th>Course</th><th>Due Date</th></tr>
            </thead>
            <tbody>
              {assignments.map(a => (
                <tr key={a.id}>
                  <td>{a.title}</td>
                  <td>{a.courseName}</td>
                  <td>{new Date(a.dueDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TeacherAssignments;
