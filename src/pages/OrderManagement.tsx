import { useEffect, useState, useCallback, useMemo } from "react";
import {
  getAllOrders,
  getOrderDetails,
  type OrderRecord,
  type OrderDetail,
} from "../services/orderService";

import OrderDetailPopup from "../components/common/OrderDetailPopup";
import OrderEditPopup from "../components/common/OrderEditPopup";

// ====================================================================
// MOCK DATA (dùng khi API lỗi)
// ====================================================================
const MOCK_ORDERS: OrderRecord[] = [
  { maDH: "1", maKH: "101", maNV: "11", ngayLap: "2025-01-01", tongTien: 1500000 },
  { maDH: "2", maKH: "102", maNV: "12", ngayLap: "2025-01-05", tongTien: 2300000 },
  { maDH: "3", maKH: "103", maNV: "11", ngayLap: "2025-01-06", tongTien: 975000 },
];

const getMockDetails = (orderId: string): OrderDetail[] => {
  if (orderId === "1") {
    return [
      { maCTDH: "1", maDH: "1", maSP: "201", soLuong: 2, donGia: 250000, thanhTien: 500000 },
      { maCTDH: "2", maDH: "1", maSP: "202", soLuong: 1, donGia: 1000000, thanhTien: 1000000 },
    ];
  }
  return [
    { maCTDH: "99", maDH: orderId, maSP: "299", soLuong: 1, donGia: 100000, thanhTien: 100000 },
  ];
};

// ====================================================================
// COMPONENT CHÍNH
// ====================================================================
export default function OrderManagement() {
  const pageSize = 10;

  // STATES
  const [allOrders, setAllOrders] = useState<OrderRecord[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  const [detailTarget, setDetailTarget] = useState<OrderRecord | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);

  const [editTarget, setEditTarget] = useState<OrderRecord | null>(null);
  const [editDetails, setEditDetails] = useState<OrderDetail[]>([]);

  // ==================================================================
  // FETCH DATA
  // ==================================================================
  const fetchData = useCallback(async () => {
    try {
      const data = await getAllOrders();
      setAllOrders(data);
    } catch (error) {
      console.error("Lỗi tải dữ liệu API. Dùng dữ liệu Mock:", error);
      setAllOrders(MOCK_ORDERS);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ==================================================================
  // LỌC, SẮP XẾP, PHÂN TRANG
  // ==================================================================
  const { orders, totalPages } = useMemo(() => {
    let filtered = [...allOrders];

    if (search.trim() !== "") {
      filtered = filtered.filter(
        o =>
          o.maDH.includes(search) ||
          o.maKH.includes(search) ||
          o.maNV.includes(search)
      );
    }

    if (sort === "dateAsc") filtered.sort((a, b) => a.ngayLap.localeCompare(b.ngayLap));
    else if (sort === "dateDesc") filtered.sort((a, b) => b.ngayLap.localeCompare(a.ngayLap));

    const total = filtered.length;
    const calculatedTotalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedOrders = filtered.slice(start, end);

    return { orders: paginatedOrders, totalPages: calculatedTotalPages || 1 };
  }, [allOrders, search, sort, page]);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(totalPages);
    else if (page === 0 && totalPages > 0) setPage(1);
  }, [page, totalPages]);

  // ==================================================================
  // SỰ KIỆN
  // ==================================================================
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
    setPage(1);
  };

  const openDetailPopup = async (order: OrderRecord) => {
    setDetailTarget(order);
    setOrderDetails([]);

    try {
      const details = await getOrderDetails(order.maDH);
      setOrderDetails(details);
    } catch (err) {
      console.error("Lỗi lấy chi tiết đơn hàng API. Dùng chi tiết Mock:", err);
      setOrderDetails(getMockDetails(order.maDH));
    }
  };

  const openEditPopup = async (order: OrderRecord) => {
  setEditTarget(null);     // đảm bảo popup chưa mở
  setEditDetails([]);

  try {
    const details = await getOrderDetails(order.maDH);
    setEditDetails(details);
    setEditTarget(order);  // mở popup sau khi đã có data
  } catch (err) {
    console.error("Lỗi lấy chi tiết đơn hàng API. Dùng mock:", err);
    const mock = getMockDetails(order.maDH);
    setEditDetails(mock);
    setEditTarget(order);  // mở popup với dữ liệu mock
  }
};


  const closeDetailPopup = () => {
    setDetailTarget(null);
    setOrderDetails([]);
  };

  const handleEditSuccess = () => {
    setEditTarget(null);
    fetchData();
  };

  // ==================================================================
  // RENDER
  // ==================================================================
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Tìm theo Mã ĐH/KH/NV..."
            className="border rounded px-4 py-2 w-80 shadow-sm focus:ring-[#A7D388] focus:border-[#A7D388]"
            value={search}
            onChange={handleSearchChange}
          />
          <button
            onClick={() => setPage(1)}
            className="bg-[#537B24] text-white px-4 py-2 rounded font-semibold hover:bg-green-700 transition"
          >
            Tìm
          </button>

          <select
            className="border px-3 py-2 rounded shadow-sm focus:ring-[#A7D388] focus:border-[#A7D388]"
            value={sort}
            onChange={handleSortChange}
          >
            <option value="">--- Sắp xếp ---</option>
            <option value="dateAsc">Ngày lập (cũ nhất)</option>
            <option value="dateDesc">Ngày lập (mới nhất)</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#A7D388] text-[#537B24] font-semibold sticky top-0">
            <tr>
              <th className="p-3 w-20">Mã ĐH</th>
              <th className="p-3 w-20">Mã KH</th>
              <th className="p-3 w-20">Mã NV</th>
              <th className="p-3 w-40">Ngày lập</th>
              <th className="p-3 w-40">Tổng tiền</th>
              <th className="p-3 text-center w-64">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  Không tìm thấy đơn hàng nào.
                </td>
              </tr>
            ) : (
              orders.map(o => (
                <tr key={o.maDH} className="border-b last:border-b-0 hover:bg-gray-50 transition">
                  <td className="p-3 font-mono">{o.maDH}</td>
                  <td className="p-3">{o.maKH}</td>
                  <td className="p-3">{o.maNV}</td>
                  <td className="p-3">{o.ngayLap}</td>
                  <td className="p-3 font-semibold text-green-700">
                    {o.tongTien.toLocaleString("vi-VN")} đ
                  </td>

                  <td className="p-3">
                    <div className="flex gap-2 justify-center">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600 transition shadow-md"
                        onClick={() => openDetailPopup(o)}
                      >
                        Xem
                      </button>

                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-yellow-600 transition shadow-md"
                        onClick={() => openEditPopup(o)}
                      >
                        Sửa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`px-4 py-2 rounded-md border text-sm transition ${
              page === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            ← Trang Trước
          </button>

          <span className="text-gray-600 text-sm">
            Trang <b className="text-[#537B24]">{page}</b> / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className={`px-4 py-2 rounded-md border text-sm transition ${
              page === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            Trang Sau →
          </button>
        </div>
      )}

      {/* POPUPS */}
      {detailTarget && (
        <OrderDetailPopup
          data={{ record: detailTarget, detail: orderDetails }}
          onClose={closeDetailPopup}
        />
      )}

      {editTarget && (
        <OrderEditPopup
          order={editTarget}
          details={editDetails}
          onClose={() => setEditTarget(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}
