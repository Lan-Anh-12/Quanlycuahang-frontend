// src/services/authService.ts
import axios from "axios";
import api from "./api";

const API_URL = "http://localhost:8080/api/auth";

export const authService = {
  // Đăng nhập, trả về JWT token
  login: async (username: string, password: string) => {
    const response = await axios.post(
      `${API_URL}/login`,
      { username, matkhau: password },
      { withCredentials: true } // quan trọng để gửi cookie nếu backend set HttpOnly cookie
    );
    return response.data; // thường là token hoặc thông tin user
  },

  // Đăng xuất
  logout: async () => {
    await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
  },

  // Lấy refresh token nếu có
  refreshToken: async () => {
    const response = await axios.post(`${API_URL}/refresh-token`, {}, { withCredentials: true });
    return response.data;
  },

  // Lấy mã nhân viên hiện tại
  // Lấy mã nhân viên, token tự động được gắn bởi interceptor
  getMaNhanVien: async (): Promise<string> => {
    const response = await api.get("/api/auth/me/manv");
    return response.data;
  }
};
