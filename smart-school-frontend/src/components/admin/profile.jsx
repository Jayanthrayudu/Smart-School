// src/components/admin/AdminProfile.jsx
import { useContext } from 'react';
import Header from '../common/Header.jsx';
import Sidebar from '../common/Sidebar.jsx';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/admin.css';
import { useState } from 'react';

export default function AdminProfile() {
  const { user } = useContext(AuthContext);

  // ⭐ Sidebar Toggle State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className={`admin-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

      <div className="admin-content">
        {/* Header */}
        <Header onMenuClick={toggleSidebar} />

        <div className="admin-profile">
          <h2>My Profile</h2>
          <p><strong>Name:</strong> {user?.username}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> Admin</p>
        </div>
      </div>
    </div>
  );
}
