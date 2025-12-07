import React, { useState, useEffect } from "react";
import type { OrderRecord, OrderDetail } from "../../services/orderService";
import { updateOrder, type UpdateOrderRequest } from "../../services/orderService";

interface Props {
  order: OrderRecord;
  details: OrderDetail[];
  onClose: () => void;
  onSuccess: () => void;
}

const OrderEditPopup: React.FC<Props> = ({ order, details, onClose, onSuccess }) => {
  const [chiTiet, setChiTiet] = useState<OrderDetail[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setChiTiet(details);  // cập nhật chi tiết khi prop details thay đổi
  }, [details]);

  const handleQtyChange = (index: number, value: number) => {
    if (value < 0) value = 0;
    setChiTiet(prev =>
      prev.map((item, i) => (i === index ? { ...item, soLuong: value } : item))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: UpdateOrderRequest = {
        maDH: order.maDH,
        chiTiet: chiTiet.map(d => ({ maSP: d.maSP, soLuong: d.soLuong })),
      };
      await updateOrder(payload);
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      alert("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  // Nếu chiTiet chưa có dữ liệu, hiển thị loading
  if (chiTiet.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
        <div className="bg-white p-5 rounded-lg shadow-lg">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-5 rounded-lg w-[500px] shadow-lg">
        <h2 className="text-lg font-semibold mb-3 text-[#537B24]">
          Sửa số lượng đơn hàng #{order.maDH}
        </h2>

        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
          {chiTiet.map((item, idx) => (
            <div key={item.maSP} className="mb-3 flex gap-2 items-center">
              <span className="w-1/2">{item.maSP}</span>
              <input
                type="number"
                className="border rounded p-1 w-1/2"
                value={item.soLuong}
                onChange={e => handleQtyChange(idx, Number(e.target.value))}
                min={0}
              />
            </div>
          ))}

          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="px-3 py-2 bg-gray-300 rounded" onClick={onClose} disabled={saving}>
              Hủy
            </button>
            <button type="submit" className="px-3 py-2 bg-[#537B24] text-white rounded hover:bg-[#44651d]" disabled={saving}>
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderEditPopup;
