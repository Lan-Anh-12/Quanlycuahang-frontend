import React, { useState, useEffect } from "react";
import inventoryService, { type NhapKhoResponse, type CTNhapKhoResponse } from "../../services/inventoryService";
import { useAuth } from "../../context/AuthContext";

interface Props {
  record: NhapKhoResponse;
  onClose: () => void;
  onSave: (updated: any) => void;
}

export default function EditImportPopup({ record, onClose, onSave }: Props) {
  const [form, setForm] = useState<any>({});
  const [details, setDetails] = useState<CTNhapKhoResponse[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (record) {
      setForm({
        MaNK: record.maNK,
        MaNV: record.maNV || user?.maNV || "",
        NhaCungCap: record.nhaCungCap,
        NgayNhap: record.ngayNhap,
        TongTien: record.tongTien,
      });
      setDetails(record.chiTiet || []);
    }
  }, [record]);

  const updateQuantity = (index: number, value: number) => {
    const updated = [...details];
    updated[index].soLuong = value;
    // update thanhTien locally
    const dg = updated[index].donGia || 0;
    updated[index].thanhTien = (dg as any) * value;
    setDetails(updated);

    // recalc total
    const newTotal = updated.reduce((s, d) => s + (Number(d.thanhTien) || 0), 0);
    setForm({ ...form, TongTien: newTotal });
  };

  const handleSave = async () => {
    try {
      const payload = {
        maNV: form.MaNV,
        nhaCungCap: form.NhaCungCap,
        ngayNhap: form.NgayNhap,
        chiTiet: details.map(d => ({ maSP: d.maSP, soLuong: d.soLuong, donGia: d.donGia })),
      } as any;

      await inventoryService.updateNhapKho(String(form.MaNK), payload);
      onSave(form);
    } catch (err) {
      console.error("Lỗi update:", err);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[700px] max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4 text-[#537B24]">Sửa phiếu nhập (chỉ chỉnh SL)</h3>

        <div className="space-y-3">
          <div>
            <label className="font-semibold">Mã nhân viên</label>
            <input
              type="text"
              value={form.MaNV || ""}
              className="w-full border rounded px-3 py-2"
              onChange={(e) => setForm({ ...form, MaNV: e.target.value })}
            />
          </div>

          <div>
            <label className="font-semibold">Nhà cung cấp</label>
            <input
              type="text"
              value={form.NhaCungCap || ""}
              className="w-full border rounded px-3 py-2"
              onChange={(e) => setForm({ ...form, NhaCungCap: e.target.value })}
            />
          </div>

          <div>
            <label className="font-semibold">Ngày nhập</label>
            <input
              type="datetime-local"
              value={(form.NgayNhap || "").slice(0, 16)}
              className="w-full border rounded px-3 py-2"
              onChange={(e) => setForm({ ...form, NgayNhap: e.target.value })}
            />
          </div>

          <div>
            <label className="font-semibold">Tổng tiền</label>
            <input
              value={(form.TongTien || 0).toLocaleString("vi-VN")}
              className="w-full border rounded px-3 py-2 bg-gray-100"
              disabled
            />
          </div>
        </div>

        {/* Chi tiết sản phẩm (chỉ sửa số lượng) */}
        <h4 className="text-lg font-semibold mt-5 mb-2">Chi tiết sản phẩm</h4>

        <div className="border rounded max-h-64 overflow-y-auto">
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
              {details.map((d, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{d.maSP}</td>
                  <td className="p-2">{d.tenSP}</td>
                  <td className="p-2">
                    <input
                      type="number"
                      className="border px-2 py-1 rounded w-20"
                      value={d.soLuong}
                      onChange={(e) => updateQuantity(index, Number(e.target.value))}
                      min={0}
                    />
                  </td>
                  <td className="p-2">{(d.donGia || 0).toLocaleString("vi-VN")} ₫</td>
                  <td className="p-2 text-red-600">{(d.thanhTien || 0).toLocaleString("vi-VN")} ₫</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>Hủy</button>
          <button className="px-4 py-2 bg-[#537B24] text-white rounded hover:bg-[#45691D]" onClick={handleSave}>
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}
