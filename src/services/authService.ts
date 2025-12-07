// src/services/authService.ts
// Không cần import axios trực tiếp nữa, chỉ cần import instance 'api'
import api from "./api";

export const authService = {
  // Đăng nhập, trả về JWT token
  login: async (username: string, password: string) => {
    const response = await api.post(
      "/api/auth/login", // Đường dẫn tương đối: sẽ ghép với baseURL đã cấu hình
      { username, matkhau: password },
      { withCredentials: true } 
    );
    return response.data; // thường là token hoặc thông tin user
  },

  // Đăng xuất
  logout: async () => {
    // SỬA: Dùng 'api.post'
    await api.post("/api/auth/logout", {}, { withCredentials: true });
  },

  // Lấy refresh token nếu có
  refreshToken: async () => {
    // SỬA: Dùng 'api.post'
    const response = await api.post("/api/auth/refresh", {}, { withCredentials: true });
    return response.data;
  },

  // Lấy mã nhân viên hiện tại
  // Lấy mã nhân viên, token tự động được gắn bởi interceptor
  getMaNhanVien: async (): Promise<string> => {
    const response = await api.get("/api/auth/me/manv");
    return response.data;
  }
};
