import { Routes, Route } from 'react-router-dom';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import AdminDashboard from '../components/admin/Dashboard';
import AdminUsers from '../components/admin/Users';
import AdminClasses from '../components/admin/Classes';
import AdminCourses from '../components/admin/Courses';
import AdminAttendance from '../components/admin/Attendance';
import AdminSettings from '../components/admin/profile.jsx';
import '../styles/admin.css'; 
import '../styles/dashboard.css';
import AdminProfile from '../components/admin/profile';



function AdminDashboardPage() {
  return (
    <div className="dashboard-container">
      <Header />
      <div className="main-content">
        <Sidebar />
        <main>
          <Routes>
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/Classes" element={<AdminClasses />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/courses" element={<AdminCourses />} />
            <Route path="/attendance" element={<AdminAttendance />} />
            <Route path="/profile" element={<AdminProfile />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default AdminDashboardPage;