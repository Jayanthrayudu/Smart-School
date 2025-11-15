import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import '../../src/index.css';

function Home() {
  return (
    <div className="home-page">
      <Header />
      <main className="home-main">
        <h1 className="home-title">Welcome to Smart School</h1>
        <p className="home-subtitle">
          A feature-rich platform designed for modern education. Manage courses, assignments,
          grades, attendance, and more — all in one place.
        </p>

        <div className="features">
          <ul>
            <li>📚 Intuitive course & subject management</li>
            <li>📝 Seamless assignment submissions</li>
            <li>📊 Real-time grading and progress tracking</li>
            <li>📅 Monthly attendance insights</li>
            <li>👩‍🏫 Role-based dashboards for Admins, Teachers, and Students</li>
          </ul>
        </div>

        <div className="auth-buttons">
          <Link to="/login" className="home-login-button">Login</Link>
          <Link to="/register" className="home-register-button">Register</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
