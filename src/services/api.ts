// src/services/api.ts
import axios from "axios";

// Lấy giá trị của biến môi trường REACT_APP_API_URL
// Biến này chứa: https://quanlycuahang-backend-production.up.railway.app
const BASE_URL = process.env.REACT_APP_API_URL;

// Kiểm tra nếu biến môi trường không tồn tại (chỉ nên xảy ra khi dev cục bộ)
// Bạn có thể giữ lại localhost làm fallback cho môi trường DEV
if (!BASE_URL) {
    console.error("REACT_APP_API_URL is not set. Using default localhost:8080.");
}

const api = axios.create({
  // Sử dụng biến môi trường (hoặc fallback về localhost nếu không có)
  baseURL: BASE_URL || "http://localhost:8080",
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
