import axios from "axios";

// 🟢 If running inside Docker → uses VITE_API_BASE_URL = "http://backend:5000"
// 🟢 If running locally (vite dev) → fallback to "http://localhost:5000"
const BACKEND_URL =
  import.meta.env.VITE_API_BASE_URL &&
  import.meta.env.VITE_API_BASE_URL !== "http://backend:5000"
    ? import.meta.env.VITE_API_BASE_URL                     // Local dev override
    : (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
      ? "http://localhost:5000"                             // Local dev fallback
      : "http://backend:5000";                              // Docker production

console.log("🔗 Using API URL:", BACKEND_URL);

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach auth token if exists
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;
