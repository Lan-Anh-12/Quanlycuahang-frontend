// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect,type ReactNode } from "react";
import api from "../services/api";

interface User {
  username: string;
  maNV: string;
  maTK: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  // Khi có token, load lại user info từ backend
  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const usernamePayload = JSON.parse(atob(token.split(".")[1])).username;

        // Lấy maTK và maNV từ backend
        const [maTKRes, maNVRes] = await Promise.all([
          api.get("/api/auth/me/matk", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/api/auth/me/manv", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setUser({
          username: usernamePayload,
          maTK: maTKRes.data,
          maNV: maNVRes.data,
        });
      } catch {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
      }
    };

    fetchUser();
  }, [token]);

  // Login
  const login = async (username: string, password: string) => {
    const res = await api.post("/api/auth/login", { username, matkhau: password });
    const jwtToken = res.data;
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);

    // Lấy maTK và maNV ngay sau khi login
    const [maTKRes, maNVRes] = await Promise.all([
      api.get("/api/auth/me/matk", { headers: { Authorization: `Bearer ${jwtToken}` } }),
      api.get("/api/auth/me/manv", { headers: { Authorization: `Bearer ${jwtToken}` } }),
    ]);

    setUser({ username, maTK: maTKRes.data, maNV: maNVRes.data });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
