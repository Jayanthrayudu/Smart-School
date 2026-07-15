// src/components/admin/AdminCourses.jsx
import { useState, useEffect } from 'react';
import Header from '../common/Header.jsx';
import Sidebar from '../common/Sidebar.jsx';
import Loader from '../common/Loader.jsx';
import api from '../../services/api';
import '../../styles/admin.css';

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [teacherNames, setTeacherNames] = useState({});
  const [assigning, setAssigning] = useState({});

  // ⭐ Sidebar Toggle State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses/all');
      setCourses(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleInputChange = (courseName, value) => {
    setTeacherNames((prev) => ({
      ...prev,
      [courseName]: value,
    }));
  };

  const handleAssign = async (courseName) => {
    const teacherName = teacherNames[courseName];
    if (!teacherName) {
      alert('Please enter a Teacher Name');
      return;
    }
    try {
      setAssigning((prev) => ({ ...prev, [courseName]: true }));
      await api.put(`/courses/by-name/${courseName}/assign-teacher/${teacherName}`);
      alert(`Teacher "${teacherName}" assigned to course "${courseName}"`);
      setTeacherNames((prev) => ({ ...prev, [courseName]: '' }));
      fetchCourses();
    } catch (err) {
      console.error(err);
      alert('Failed to assign teacher');
    } finally {
      setAssigning((prev) => ({ ...prev, [courseName]: false }));
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className={`admin-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

      <div className="admin-content">
        {/* Header */}
        <Header onMenuClick={toggleSidebar} />

        <div className="admin-courses">
          <h2>Manage Courses</h2>

          {/* ===== Assign Teacher Table ===== */}
          <table className="table">
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Schedule</th>
                <th>Assign Teacher</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td>{course.name}</td>
                  <td>{course.schedule || '-'}</td>
                  <td>
                    <input
                      type="text"
                      placeholder="Teacher Name"
                      value={teacherNames[course.name] || ''}
                      onChange={(e) => handleInputChange(course.name, e.target.value)}
                      disabled={assigning[course.name]}
                    />
                    <button
                      onClick={() => handleAssign(course.name)}
                      disabled={assigning[course.name]}
                    >
                      {assigning[course.name] ? 'Assigning...' : 'Assign'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ===== Current Assignments Table ===== */}
          <h2 style={{ marginTop: '2rem' }}>Current Course Assignments</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Instructor</th>
                <th>Schedule</th>
                <th>Student Count</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td>{course.name}</td>
                  <td>{course.instructor || 'Unknown'}</td>
                  <td>{course.schedule || '-'}</td>
                  <td>{course.studentCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
