import React, { useState } from "react";
import { updateCustomer } from "../../services/customerService";
import type { Customer } from "../../services/customerService";

interface EditCustomerPopupProps {
  customer: Customer;
  onClose: () => void;
  onSuccess: () => void;
}

const EditCustomerPopup: React.FC<EditCustomerPopupProps> = ({
  customer,
  onClose,
  onSuccess,
}) => {
  const [tenKH, setHoTen] = useState(customer.tenKH);
  const [namSinh, setNamSinh] = useState(customer.namSinh);
  const [diaChi, setDiaChi] = useState(customer.diaChi);
  const [sdt, setSdt] = useState(customer.sdt);

  const handleSave = async () => {
    try {
      await updateCustomer(customer.maKH, {
        tenKH: tenKH, // map đúng với BE
        namSinh,
        diaChi,
        sdt,
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Lỗi khi cập nhật khách hàng:", error);
      alert("Cập nhật thất bại!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg w-[400px] shadow-lg">
        <h2 className="text-lg font-semibold mb-3">Sửa khách hàng</h2>

        {/* Họ tên */}
        <label className="block mb-2 font-medium">Họ tên</label>
        <input
          className="w-full border p-2 rounded mb-3"
          value={tenKH}
          onChange={(e) => setHoTen(e.target.value)}
        />

        {/* Năm sinh */}
        <label className="block mb-2 font-medium">Năm sinh</label>
        <input
          type="number"
          className="w-full border p-2 rounded mb-3"
          value={namSinh}
          onChange={(e) => setNamSinh(Number(e.target.value))}
        />

        {/* Địa chỉ */}
        <label className="block mb-2 font-medium">Địa chỉ</label>
        <input
          className="w-full border p-2 rounded mb-3"
          value={diaChi}
          onChange={(e) => setDiaChi(e.target.value)}
        />

        {/* SĐT */}
        <label className="block mb-2 font-medium">Số điện thoại</label>
        <input
          className="w-full border p-2 rounded mb-4"
          value={sdt}
          onChange={(e) => setSdt(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="px-3 py-2 bg-[#537B24] text-white rounded hover:bg-[#44651d]"
            onClick={handleSave}
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCustomerPopup;
