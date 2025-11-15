import { useState, useEffect } from 'react';
import { getTeacherAssignments, createAssignment } from '../../services/assignmentService';

function TeacherAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    courseName: '',
    dueDate: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await getTeacherAssignments();
        setAssignments(data);
      } catch (err) {
        setError('Failed to load assignments');
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      dueDate: formData.dueDate,
      courseName: formData.courseName
    };

    console.log("Submitting assignment payload:", payload);

    try {
      const newAssignment = await createAssignment(payload); // returns data only
      setAssignments((prev) => [...prev, newAssignment]);   // ✅ directly push
      setFormData({ title: '', courseName: '', dueDate: '' });
    } catch (err) {
      console.error("Error creating assignment:", err.response?.data || err.message);
      setError(err.response?.data || 'Failed to create assignment');
    }
  };




  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="teacher-assignments">
      <h2>Manage Assignments</h2>
      <form className="form-container" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Assignment Title"
          className="input"
        />
        <input
          type="text"
          name="courseName"
          value={formData.courseName}
          onChange={handleChange}
          placeholder="Course Name"
          className="input"
        />
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="input"
        />
        <button type="submit" className="button">Create Assignment</button>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Course</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => (
            <tr key={assignment.id}>
            <td>{assignment.title}</td>
            <td>{assignment.courseName}</td>
            <td>{new Date(assignment.dueDate).toLocaleDateString()}</td>
          </tr>
            ))}
          </tbody>
      </table>
    </div>
  );
}

export default TeacherAssignments;
