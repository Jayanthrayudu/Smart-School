import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

function TeacherProfile() {
  const { user } = useContext(AuthContext);

  return (
    <div className="teacher-profile">
      <h2>My Profile</h2>
      <p><strong>Name:</strong> {user?.username}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Role:</strong> Teacher</p>
    </div>
  );
}

export default TeacherProfile;