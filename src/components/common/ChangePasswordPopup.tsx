// src/components/common/ChangePasswordPopup.tsx
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordPopup({ isOpen, onClose }: Props) {
  const { user } = useAuth();
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isOpen) return null;

  const handleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user?.maTK) {
      setError("Không tìm thấy thông tin user");
      return;
    }

    if (newPass !== confirm) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      await api.post(
        "/api/auth/change-password",
        {
          maTK: user.maTK,
          mkCu: oldPass,
          mkMoi: newPass,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setSuccess("Đổi mật khẩu thành công");
      setTimeout(() => onClose(), 1000);
    } catch (err: any) {
      setError(err.response?.data || "Không thể đổi mật khẩu");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-96 rounded-xl shadow-lg p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3">
          <IoClose size={26} />
        </button>
        <h2 className="text-2xl font-bold text-center text-[#537B24] mb-4">
          Đổi mật khẩu
        </h2>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-3">{success}</p>}
        <form onSubmit={handleChange} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Mật khẩu cũ"
            className="border rounded px-3 py-2"
            value={oldPass}
            onChange={(e) => setOldPass(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu mới"
            className="border rounded px-3 py-2"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Xác nhận mật khẩu"
            className="border rounded px-3 py-2"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-[#537B24] text-white rounded py-2 hover:bg-[#44651d]"
          >
            Xác nhận
          </button>
        </form>
      </div>
    </div>
  );
}
