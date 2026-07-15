import axios from "axios";

const BACKEND_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

console.log("🔗 Using API URL:", BACKEND_URL);

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

export default api;