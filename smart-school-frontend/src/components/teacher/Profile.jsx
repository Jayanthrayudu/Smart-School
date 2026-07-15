import { useState,useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Header from '../common/Header.jsx';
import Sidebar from '../common/Sidebar.jsx';
import '../../styles/teacher.css';


function TeacherProfile() {
  const { user } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className={`teacher-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      <div className="teacher-content">
        <Header onMenuClick={toggleSidebar} />

        <div className="teacher-profile">
          <h2>My Profile</h2>
          <p><strong>Name:</strong> {user?.username}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> Teacher</p>
        </div>
      </div>
    </div>
  );
}

export default TeacherProfile;
