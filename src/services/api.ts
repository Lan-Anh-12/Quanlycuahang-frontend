// src/services/api.ts
import axios from "axios";

// ĐIỀU CHỈNH: Sử dụng cú pháp chuẩn của Vite: import.meta.env
// Giá trị này sẽ là "https://quanlycuahang-backend-production.up.railway.app" trên Vercel
const BASE_URL: string = (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:8080";

// (Bạn không cần khối if kiểm tra lỗi nữa vì BASE_URL luôn có giá trị)

const api = axios.create({
  // Sử dụng biến đã được xác định
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
