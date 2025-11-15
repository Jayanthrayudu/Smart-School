import { useState, useEffect } from 'react';
import { getStudentCourses, enrollCourse } from '../../services/courseService';
import "../../styles/student.css";

function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getStudentCourses();
        setCourses(data);
      } catch {
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleEnroll = async (courseName) => {
    try {
      await enrollCourse(courseName);

      setMessage(`Enrolled in ${courseName} successfully!`);
      setMessageType('success');

      const updated = await getStudentCourses();
      setCourses(updated);

      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage("Already enrolled or an error occurred.");
      setMessageType('error');

      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="student-courses">
      <h2>My Courses</h2>

      {message && (
        <div className={`message-box ${messageType}`}>
          {message}
        </div>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Instructor</th>
            <th>Schedule</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id || course._id}>
              <td>{course.name}</td>
              <td>{course.instructor || course.teacherName || 'TBA'}</td>
              <td>{course.schedule}</td>
              <td>
                {course.enrolled ? (
                  <button disabled className="btn btn-success">
                    Enrolled
                  </button>
                ) : (
                  <button
                    onClick={() => handleEnroll(course.name)}
                    className="btn btn-primary"
                  >
                    Enroll
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentCourses;
