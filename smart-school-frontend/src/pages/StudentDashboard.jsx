import { Routes, Route } from 'react-router-dom';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import StudentDashboard from '../components/student/Dashboard';
import StudentCourses from '../components/student/Courses';
import StudentAssignments from '../components/student/Assignments';
import StudentGrades from '../components/student/Grades';
import StudentAttendance from '../components/student/Attendance';
import StudentProfile from '../components/student/Profile';

function StudentDashboardPage() {
  return (
    <div className="dashboard-container">
      <div className="main-content">
        <Sidebar />
        <main>
          <Routes>
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/courses" element={<StudentCourses />} />
            <Route path="/assignments" element={<StudentAssignments />} />
            <Route path="/grades" element={<StudentGrades />} />
            <Route path="/attendance" element={<StudentAttendance />} />
            <Route path="/profile" element={<StudentProfile />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default StudentDashboardPage;