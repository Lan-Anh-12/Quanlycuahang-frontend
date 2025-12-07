import React from "react";
import type { NhapKhoResponse, CTNhapKhoResponse } from "../services/inventoryService";

interface Props {
  data?: {
    record: NhapKhoResponse;
    detail: CTNhapKhoResponse[];
  };
  onClose: () => void;
}

export default function ImportDetailPopup({ data, onClose }: Props) {
  // Nếu không có data hoặc detail, khởi tạo mặc định là mảng rỗng
  const detail = data?.detail ?? [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[520px] max-h-[85vh] overflow-y-auto">

        <h4 className="text-lg font-semibold mb-2 text-[#537B24]">
          Danh sách sản phẩm
        </h4>

        <div className="border rounded max-h-60 overflow-y-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Mã SP</th>
                <th className="p-2">Tên SP</th>
                <th className="p-2">SL</th>
                <th className="p-2">Đơn giá</th>
                <th className="p-2">Thành tiền</th>
              </tr>
            </thead>

            <tbody>
              {detail.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-gray-500">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                detail.map((d) => (
                  <tr key={d.maCTNK} className="border-b">
                    <td className="p-2">{d.maSP}</td>
                    <td className="p-2">{d.tenSP}</td>
                    <td className="p-2">{d.soLuong}</td>
                    <td className="p-2">{d.donGia.toLocaleString("vi-VN")} ₫</td>
                    <td className="p-2 text-red-600 font-semibold">
                      {d.thanhTien.toLocaleString("vi-VN")} ₫
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
