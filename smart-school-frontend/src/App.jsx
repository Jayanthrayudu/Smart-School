import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";

// Pages
import Home from "./pages/Home.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import TeacherDashboard from "./pages/TeacherDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import NotFound from "./pages/NotFound.jsx";

// Components
import PrivateRoute from "./components/common/PrivateRoute.jsx";
import Loader from "./components/common/Loader.jsx";

function AppRoutes({ isSidebarOpen, toggleSidebar, closeSidebar }) {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected */}
      <Route
        path="/admin/*"
        element={
          <PrivateRoute role="admin">
            <AdminDashboard
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
              closeSidebar={closeSidebar}
            />
          </PrivateRoute>
        }
      />

      <Route
        path="/teacher/*"
        element={
          <PrivateRoute role="teacher">
            <TeacherDashboard
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
              closeSidebar={closeSidebar}
            />
          </PrivateRoute>
        }
      />

      <Route
        path="/student/*"
        element={
          <PrivateRoute role="student">
            <StudentDashboard
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
              closeSidebar={closeSidebar}
            />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function AppWithOverlayLoader() {
  const { loading } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      <div className={loading ? "blurred" : ""}>
        <AppRoutes
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          closeSidebar={closeSidebar}
        />
      </div>
      {loading && <Loader />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppWithOverlayLoader />
      </Router>
    </AuthProvider>
  );
}
