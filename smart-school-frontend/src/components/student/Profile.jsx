import { useContext, useState } from 'react';
import Header from '../common/Header.jsx';
import Sidebar from '../common/Sidebar.jsx';
import { AuthContext } from '../../context/AuthContext';
import "../../styles/student.css";

function StudentProfile() {
  const { user } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className={`student-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      <div className="student-content">
        <Header onMenuClick={toggleSidebar} />

        <div className="student-profile">
          <h2>My Profile</h2>
          <p><strong>Name:</strong> {user?.username}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> Student</p>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
