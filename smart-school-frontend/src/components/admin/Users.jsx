import { useState, useEffect } from 'react';
import { getUsers } from '../../services/authService';
import '../../styles/admin.css';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();

        // Normalize roles to lowercase for easier comparison
        const normalizedUsers = (data || []).map(user => ({
          ...user,
          role: user.role?.toLowerCase() || 'unknown'
        }));

        setUsers(normalizedUsers);
      } catch (err) {
        console.error(err);
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const teachers = users.filter(user => user.role === 'teacher');
  const students = users.filter(user => user.role === 'student');

  return (
    <div className="admin-users">
      <h2>Manage Users</h2>

      <h3>Teachers</h3>
      {teachers.length === 0 ? <p>No teachers found.</p> : (
        <table className="table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th></tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td>{teacher.name}</td>
                <td>{teacher.email}</td>
                <td>{teacher.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>Students</h3>
      {students.length === 0 ? <p>No students found.</p> : (
        <table className="table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th></tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminUsers;
