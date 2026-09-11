import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8081",
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired tokens
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn("Token expired or invalid. Redirecting to login...");
      localStorage.removeItem("token");
      window.location.href = "/"; // Force redirect to login page
    }
    return Promise.reject(error);
  }
);

export default API;