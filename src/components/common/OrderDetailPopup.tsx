
import type { OrderRecord, OrderDetail } from "../../services/orderService";

interface Props {
  data: {
    record: OrderRecord;
    detail: OrderDetail[];
  };
  onClose: () => void;
}

export default function OrderDetailPopup({ data, onClose }: Props) {
  if (!data) return null;

  const { record, detail } = data;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[520px] max-h-[85vh] overflow-y-auto">
        {/* TITLE */}
        <h4 className="text-lg font-semibold mb-4 text-[#537B24]">
          Danh sách sản phẩm - Đơn hàng #{record.maDH}
        </h4>

        {/* DETAIL TABLE */}
        <div className="border rounded max-h-60 overflow-y-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Mã SP</th>
                <th className="p-2">Số lượng</th>
                <th className="p-2">Đơn giá</th>
                <th className="p-2">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {detail.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-3 text-center text-gray-500">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                detail.map((d) => (
                  <tr key={d.maCTDH} className="border-b">
                    <td className="p-2">{d.maSP}</td>
                    <td className="p-2">{d.soLuong}</td>
                    <td className="p-2">{d.donGia.toLocaleString("vi-VN")} ₫</td>
                    <td className="p-2">{d.thanhTien.toLocaleString("vi-VN")} ₫</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* CLOSE BUTTON */}
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
