import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

function AdminProfile() {
  const { user } = useContext(AuthContext);


  return (
    <div className="admin-profile">
      <h2>My Profile</h2>
      <p><strong>Name:</strong> {user?.username}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Role:</strong> Admin</p>
    </div>
  );
}

export default AdminProfile;
