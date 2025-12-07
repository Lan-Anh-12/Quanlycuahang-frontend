// src/components/layout/Header.tsx
import { useState } from "react";
import { IoClose, IoChevronDown } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoginPopup from "../common/LoginPopup";
import ChangePasswordPopup from "../common/ChangePasswordPopup";

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [changePassOpen, setChangePassOpen] = useState(false);

  const { user, logout } = useAuth();

  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="bg-[#78AF38] text-white text-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
          {/* Nút mở sidebar */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 font-semibold"
          >
            <i className="fa-solid fa-house text-[#537B24]"></i>
          </button>

          {/* Thông tin liên hệ */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-envelope text-[#537B24]"></i>
              <span>contact@demo.com</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-phone text-[#537B24]"></i>
              <span>0123.456.789</span>
            </div>

            {/* Login / User Menu */}
            <div className="ml-4 relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-1 font-semibold hover:opacity-80"
                  >
                    <span>{user.username}</span>
                    <IoChevronDown />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border text-black z-50">
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => {
                          setChangePassOpen(true);
                          setMenuOpen(false);
                        }}
                      >
                        Đổi mật khẩu
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                        onClick={() => {
                          logout();
                          setMenuOpen(false);
                        }}
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setLoginOpen(true)}
                  className="bg-[#537B24] px-3 py-1 rounded text-white hover:bg-[#44651d]"
                >
                  Đăng nhập
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 z-40 h-full w-64
          bg-[#78AF38] text-white shadow-xl 
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-4 py-3 bg-[#537B24]">
          <img src="/logo.png" alt="logo" className="h-10" />
          <button onClick={() => setSidebarOpen(false)}>
            <IoClose size={28} />
          </button>
        </div>

        <nav className="mt-2">
          {[
            { label: "Trang chủ", link: "/" },
            { label: "Sản Phẩm", link: "/sanpham" },
            { label: "Khách Hàng", link: "/khachhang" },
            { label: "Đơn hàng", link: "/donhang" },
            { label: "Tạo Đơn Hàng", link: "/taodonhang" },
            { label: "Nhập Kho", link: "/nhapkho" },
          ].map((item, i) => (
            <Link
              key={i}
              to={item.link}
              className="block px-4 py-3 border-b hover:bg-[#537B24] transition"
              onClick={() => setSidebarOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Popups */}
      <LoginPopup isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
      <ChangePasswordPopup
        isOpen={changePassOpen}
        onClose={() => setChangePassOpen(false)}
      />
    </header>
  );
}
