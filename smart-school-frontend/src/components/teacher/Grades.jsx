import { useState, useEffect } from 'react';
import { getTeacherGrades, submitGrade } from '../../services/gradeService';

function TeacherGrades() {
  const [grades, setGrades] = useState([]);
  const [formData, setFormData] = useState({
    studentName: '',
    assignmentTitle: '',
    grade: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 🔥 Fetch teacher grades
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const data = await getTeacherGrades();
        console.log("Fetched Grades:", data);
        setGrades(data);  // Backend already sends correct structure
      } catch (err) {
        console.error(err);
        setError('Failed to load grades');
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, []);

  // Input handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit grade
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        studentName: formData.studentName,
        assignmentTitle: formData.assignmentTitle,
        grade: formData.grade
      };

      await submitGrade(payload);

      // Refresh UI instantly
      const updated = await getTeacherGrades();
      setGrades(updated);

      // Reset form
      setFormData({ studentName: '', assignmentTitle: '', grade: '' });
      setError('');
    } catch (err) {
      console.error(err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to submit grade || Assignment does not exist');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="teacher-grades">
      <h2 className="title">Manage Grades</h2>

      {error && (
        <div className="error-message" style={{ color: "red", marginBottom: "10px" }}>
          ⚠️ {error}
        </div>
      )}

      {/* Form */}
      <form className="form-container" onSubmit={handleSubmit}>
        <input
          type="text"
          name="studentName"
          value={formData.studentName}
          onChange={handleChange}
          placeholder="Student Name"
          className="input"
          required
        />
        <input
          type="text"
          name="assignmentTitle"
          value={formData.assignmentTitle}
          onChange={handleChange}
          placeholder="Assignment Title"
          className="input"
          required
        />
        <input
          type="text"
          name="grade"
          value={formData.grade}
          onChange={handleChange}
          placeholder="Grade (e.g. A, B, 85)"
          className="input"
          required
        />
        <button type="submit" className="button">Submit Grade</button>
      </form>

      {/* Table */}
      <table className="table">
        <thead>
          <tr>
            <th>Course</th>
            <th>Assignment</th>
            <th>Student</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {grades.length > 0 ? (
            grades.map((grade, index) => (
              <tr key={index}>
                <td>{grade.courseName}</td>
                <td>{grade.assignmentTitle}</td>
                <td>{grade.studentName}</td>
                <td>{grade.grade}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No grades submitted yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TeacherGrades;
