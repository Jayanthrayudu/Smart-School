import { Routes, Route } from 'react-router-dom';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import TeacherDashboard from '../components/teacher/Dashboard';
import TeacherCourses from '../components/teacher/Courses';
import TeacherAssignments from '../components/teacher/Assignments';
import TeacherGrades from '../components/teacher/Grades';
import TeacherAttendance from '../components/teacher/Attendance';
import TeacherProfile from '../components/teacher/Profile';
import '../styles/teacher.css'; 

function TeacherDashboardPage() {
  return (
    <div className="dashboard-container">
      <div className="main-content">
        <Sidebar />
        <main>
          <Routes>
            <Route path="/dashboard" element={<TeacherDashboard />} />
            <Route path="/courses" element={<TeacherCourses />} />
            <Route path="/assignments" element={<TeacherAssignments />} />
            <Route path="/grades" element={<TeacherGrades />} />
            <Route path="/attendance" element={<TeacherAttendance />} />
            <Route path="/profile" element={<TeacherProfile />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default TeacherDashboardPage;