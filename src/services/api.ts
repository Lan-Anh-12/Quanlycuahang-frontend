// src/services/api.ts
import axios from "axios";

const BASE_URL: string = (process.env.REACT_APP_API_URL as string) || "http://localhost:8080";

const api = axios.create({
  // 2. Chỉ truyền BASE_URL đã được xác định
  baseURL: BASE_URL,
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
