import { useState, useEffect } from 'react';
import { getStudentCourses } from '../../services/courseService';
import "../../styles/student.css"

function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCourses = async () => {
    try {
      const data = await getStudentCourses();
      setCourses(data);
    } catch {
      setError('Unable to load courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) return <div className="loading">Loading courses...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="student-courses">
      <h2>Available Courses</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Schedule</th>
            <th>Instructor</th>
            <th>Enrolled Students</th>
          </tr>
        </thead>
        <tbody>
          {courses.length > 0 ? (
            courses.map(course => (
              <tr key={`${course.id}-${course.name}`}>
                <td>{course.name}</td>
                <td>{course.schedule}</td>
                <td>{course.instructor}</td>
                <td>{course.studentCount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-data">No courses available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default StudentCourses;
