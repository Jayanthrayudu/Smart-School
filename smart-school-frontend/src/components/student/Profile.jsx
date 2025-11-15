import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

function StudentProfile() {
  const { user } = useContext(AuthContext);

  return (
    <div className="student-profile">
      <h2>My Profile</h2>
      <p><strong>Name:</strong> {user?.username}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Role:</strong> Student</p>
    </div>
  );
}

export default StudentProfile;