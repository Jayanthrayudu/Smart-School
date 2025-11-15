import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

function Sidebar() {
  const { user, logoutUser } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const basePath = `/${user?.role}`;

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const links = {
    student: [
      { path: '/dashboard', label: 'Dashboard' },
      { path: '/courses', label: 'Courses' },
      { path: '/assignments', label: 'Assignments' },
      { path: '/grades', label: 'Grades' },
      { path: '/attendance', label: 'Attendance' },
      { path: '/profile', label: 'Profile' },
    ],
    teacher: [
      { path: '/dashboard', label: 'Dashboard' },
      { path: '/courses', label: 'Courses' },
      { path: '/assignments', label: 'Assignments' },
      { path: '/grades', label: 'Grades' },
      { path: '/attendance', label: 'Attendance' },
      { path: '/profile', label: 'Profile' },
    ],
    admin: [
      { path: '/dashboard', label: 'Dashboard' },
      { path: '/Classes', label: 'classes' }, 
      { path: '/users', label: 'Users' },
      { path: '/courses', label: 'Courses' },
      { path: '/attendance', label: 'Attendance' },
      { path: '/profile', label: 'profile' },
    ],
  };

  return (
    <aside className="sidebar">
      <ul>
        {user && links[user.role]?.map((link) => (
          <li key={link.path}>
            <Link
              to={`${basePath}${link.path}`}
              className={`sidebar-link ${location.pathname === `${basePath}${link.path}` ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          </li>
        ))}
        {user && (
          <li>
            <button onClick={handleLogout} className="sidebar-link" style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
              Logout
            </button>
          </li>
        )}
      </ul>
    </aside>
  );
}

export default Sidebar;
