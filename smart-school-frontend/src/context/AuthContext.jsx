import { createContext, useState, useEffect, useContext } from 'react';
import { login, logout, register } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const timer = setTimeout(() => {
    setLoading(false); // simulate delay for showing loader
  }, 1000); // 1 second delay

  return () => clearTimeout(timer); // clean up if unmounted early
}, []);


  const loginUser = async (credentials) => {
  try {
    const response = await login(credentials);
    const { token, user } = response;
    const { _id, name, email, role } = user;

    const userObj = {
      _id,
      username: name,
      email,
      role: role.toLowerCase(),
      token,
    };

    setUser(userObj);
    localStorage.setItem('user', JSON.stringify(userObj));
    return { user: userObj };
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw new Error("Authentication failed");
  }
};



  const registerUser = async (data) => {
  try {
    const response = await register(data);
    // ❌ Don’t store user if no auto-login
    return response; // just return response for Register.jsx
  } catch (error) {
    console.error("Register error:", error.response?.data || error.message);
    throw error;
  }
};


  const logoutUser = async () => {
    await logout();
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, registerUser, logoutUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);