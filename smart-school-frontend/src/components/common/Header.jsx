import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import "../../styles/header.css";

function Header({ onMenuClick }) {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  // role-based links
  const basePath = `/${user?.role}`;
  const links = {
    student: [
      { path: "/dashboard", label: "Dashboard" },
      { path: "/courses", label: "Courses" },
      { path: "/assignments", label: "Assignments" },
      { path: "/grades", label: "Grades" },
      { path: "/attendance", label: "Attendance" },
      { path: "/profile", label: "Profile" },
    ],
    teacher: [
      { path: "/dashboard", label: "Dashboard" },
      { path: "/courses", label: "Courses" },
      { path: "/assignments", label: "Assignments" },
      { path: "/grades", label: "Grades" },
      { path: "/attendance", label: "Attendance" },
      { path: "/profile", label: "Profile" },
    ],
    admin: [
      { path: "/dashboard", label: "Dashboard" },
      { path: "/Classes", label: "Classes" },
      { path: "/users", label: "Users" },
      { path: "/courses", label: "Courses" },
      { path: "/attendance", label: "Attendance" },
      { path: "/profile", label: "Profile" },
    ],
  };

  return (
    <header className="header">
      <div className="header-left">
        {/* Hamburger icon for mobile */}
        <button className="hamburger" onClick={onMenuClick}>
          ☰
        </button>

        {/* Logo */}
        <Link to="/" className="header-title">
          Smart School
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="header-nav">
        {user &&
          links[user.role]?.map((link) => (
            <Link
              key={link.path}
              to={`${basePath}${link.path}`}
              className={`header-nav-link ${
                location.pathname === `${basePath}${link.path}`
                  ? "active"
                  : ""
              }`}
            >
              {link.label}
            </Link>
          ))}

        {user && (
          <button className="header-nav-link logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}

export default Header;
