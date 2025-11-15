import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/register.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });

  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { registerUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Dummy class data – replace with API call if needed
    setClasses([
      { id: '1', className: 'Class 1' },
      { id: '2', className: 'Class 2' },
      { id: '3', className: 'Class 3' }
    ]);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const registrationData = {
      ...formData,
      ...(formData.role === 'student' && { classId: selectedClass }) // Only include classId if student
    };

    try {
      await registerUser(registrationData);
      navigate('/login');
    } catch (err) {
      console.error("Frontend register error:", err.response?.data || err.message);
      if (err.response?.status === 409) {
        setError('Email already registered. Please login or use a different email.');
      } else {
        setError(err.response?.data?.message || 'Registration failed');
      }
    }
  };

  const passwordMatch = formData.password && formData.confirmPassword
    ? formData.password === formData.confirmPassword
    : null;

  return (
    <div className="register-wrapper">
      <div className="register-box">
        <h2 className="register-heading">Create Account</h2>
        {error && <p className="register-error">{error}</p>}
        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="register-input"
            required
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="register-input"
            required
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="register-input"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>

          {/* Show class selector only if role is student */}
          {formData.role === 'student' && (
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="register-input"
              required
            >
              <option value="">Select Class</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.className}</option>
              ))}
            </select>
          )}

          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="register-input"
            required
          />

          <input
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="register-input"
            required
          />

          {passwordMatch !== null && (
            <p
              className="register-match"
              style={{ color: passwordMatch ? 'green' : 'red' }}
            >
              {passwordMatch ? 'Passwords match' : 'Passwords do not match'}
            </p>
          )}

          <label className="register-show-password">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            Show Password
          </label>

          <button type="submit" className="register-button">Register</button>

          <p className="register-login-prompt">
            Already have an account?{' '}
            <a href="/login" className="register-login-link">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
