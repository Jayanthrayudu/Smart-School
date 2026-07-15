import { useEffect, useState } from 'react';
import { getTeacherCourses } from '../../services/courseService';
import { getCourseStudents, markAttendance } from '../../services/attendanceService';
import Loader from '../common/Loader';
import Header from '../common/Header.jsx';
import Sidebar from '../common/Sidebar.jsx';
import '../../styles/teacher.css';

function TeacherAttendance() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      try {
        const data = await getTeacherCourses();
        setCourses(data);
      } catch {
        setMessage("Failed to load your courses.");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  const handleCourseChange = async (courseName) => {
    if (!courseName) return;
    setSelectedCourse(courseName);
    setLoading(true);
    try {
      const data = await getCourseStudents(courseName);
      const studentList = data.students || [];
      setStudents(studentList);
      const initialAttendance = {};
      studentList.forEach(s => (initialAttendance[s.name] = 'Present'));
      setAttendance(initialAttendance);
    } catch {
      setMessage("Failed to load students.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (name, status) => {
    setAttendance(prev => ({ ...prev, [name]: status }));
  };

  const handleSubmit = async () => {
    if (!selectedCourse) {
      setMessage("Please select a course.");
      setMessageType("error");
      return;
    }
    try {
      await markAttendance(selectedCourse, attendance);
      setMessage(`Attendance marked for ${selectedCourse}!`);
      setMessageType("success");
    } catch {
      setMessage("Failed to save attendance.");
      setMessageType("error");
    }
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) return <Loader />;

  return (
    <div className={`teacher-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      <div className="teacher-content">
        <Header onMenuClick={toggleSidebar} />

        <div className="teacher-attendance">
          <h2>Mark Student Attendance</h2>

          {message && <div className={`message-box ${messageType}`}>{message}</div>}

          <div className="course-select">
            <label>Select Course:</label>
            <select value={selectedCourse} onChange={(e) => handleCourseChange(e.target.value)}>
              <option value="">-- Choose Course --</option>
              {courses.map(course => (
                <option key={course.id} value={course.name}>{course.name}</option>
              ))}
            </select>
          </div>

          {students.length > 0 && (
            <div className="attendance-form">
              <h3>{selectedCourse} - Mark Attendance</h3>
              <table>
                <thead>
                  <tr><th>Student</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>
                        <select
                          value={attendance[student.name] || 'Present'}
                          onChange={(e) => handleStatusChange(student.name, e.target.value)}
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button onClick={handleSubmit} className="submit-btn">Submit Attendance</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeacherAttendance;
