// src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// Interceptor tự động gắn token nếu có
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default api;
