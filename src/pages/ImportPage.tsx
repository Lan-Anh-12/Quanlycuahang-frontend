import { useEffect, useState } from "react";
import inventoryService, {
  type NhapKhoResponse,
} from "../services/inventoryService";

import ViewImportPopup from "../pages/ImportDetailPopup";
import EditImportPopup from "../components/common/EditImportPopup";
import AddImportPopup from "../components/common/AddImportPopup";
import LoginPopup from "../components/common/LoginPopup";
import { useAuth } from "../context/AuthContext";

export interface ImportRecord {
  MaNK: string;
  MaNV: string;
  NhaCungCap: string;
  NgayNhap: string;
  TongTien: number;
}

export default function ImportPage() {
  const { token } = useAuth();
  const [allImports, setAllImports] = useState<ImportRecord[]>([]);
  const [imports, setImports] = useState<ImportRecord[]>([]);
  const [showLogin, setShowLogin] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  const [viewTarget, setViewTarget] = useState<any | null>(null);
  const [editTarget, setEditTarget] = useState<any | null>(null);
  const [showAddPopup, setShowAddPopup] = useState(false);

  // ============================
  // FETCH API
  // ============================
  const fetchData = async () => {
    if (!token) {
      setAllImports([]);
      return;
    }
    const apiData: NhapKhoResponse[] = await inventoryService.layTatCaDonNhapHang();
    const converted: ImportRecord[] = apiData.map((i) => ({
      MaNK: String(i.maNK),
      MaNV: i.maNV,
      NhaCungCap: i.nhaCungCap,
      NgayNhap: i.ngayNhap,
      TongTien: i.tongTien,
    }));
    setAllImports(converted);
  };

  useEffect(() => {
    if (!token) {
      setShowLogin(true);
      return;
    }
    setShowLogin(false);
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // ============================
  // FILTER - SORT - PAGINATE
  // ============================
  useEffect(() => {
    let filtered = [...allImports];

    // filter
    if (search.trim() !== "") {
      filtered = filtered.filter(
        (i) =>
          i.MaNK.includes(search) ||
          i.MaNV.includes(search) ||
          i.NhaCungCap.toLowerCase().includes(search.toLowerCase())
      );
    }

    // sort
    if (sort === "dateDesc") {
      filtered.sort(
        (a, b) =>
          new Date(b.NgayNhap).getTime() - new Date(a.NgayNhap).getTime()
      );
    }
    if (sort === "dateAsc") {
      filtered.sort(
        (a, b) =>
          new Date(a.NgayNhap).getTime() - new Date(b.NgayNhap).getTime()
      );
    }

    // pagination
    const total = filtered.length;
    setTotalPages(Math.max(1, Math.ceil(total / pageSize)));
    const start = (page - 1) * pageSize;
    setImports(filtered.slice(start, start + pageSize));
  }, [allImports, search, sort, page]);

  // ============================
  // ACTIONS
  // ============================
  const handleView = async (MaNK: string) => {
  if (!token) {
    setShowLogin(true);
    return;
  }

  try {
    const resp = await inventoryService.layDonNhapHang(MaNK);

    // Chuẩn hóa dữ liệu cho popup
    const viewData = {
      record: resp,             // toàn bộ thông tin đơn
      detail: resp.chiTiet ?? [], // chi tiết nếu có, hoặc [] nếu undefined
    };

    setViewTarget(viewData);
  } catch (error) {
    console.error("Lỗi khi fetch đơn nhập:", error);
  }
};


  const handleSaveEdit = async (updated: ImportRecord) => {
    await inventoryService.updateNhapKho(updated.MaNK, {
      maNK: updated.MaNK,
      maNV: updated.MaNV,
      nhaCungCap: updated.NhaCungCap,
      ngayNhap: updated.NgayNhap,
      tongTien: updated.TongTien,
      chiTiet: [], // chi tiết xử lý riêng
    } as any);
    fetchData();
    setEditTarget(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Tìm Mã NK / Mã NV / Nhà cung cấp..."
            className="border rounded px-4 py-2 w-80"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // reset page khi tìm kiếm
            }}
          />
          <select
            className="border rounded px-3 py-2"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1); // reset page khi sort
            }}
          >
            <option value="">Sắp xếp</option>
            <option value="dateDesc">Ngày nhập: Mới → Cũ</option>
            <option value="dateAsc">Ngày nhập: Cũ → Mới</option>
          </select>
        </div>

        {!token ? (
          <button
            className="bg-[#537B24] text-white px-4 py-2 rounded-lg shadow hover:bg-[#45691D]"
            onClick={() => setShowLogin(true)}
          >
            Đăng nhập để quản lý
          </button>
        ) : (
          <button
            className="bg-[#537B24] text-white px-4 py-2 rounded-lg shadow hover:bg-[#45691D]"
            onClick={() => setShowAddPopup(true)}
          >
            + Thêm mới
          </button>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-md">
        <table className="w-full text-left">
          <thead className="bg-[#A7D388] text-[#537B24] font-semibold">
            <tr>
              <th className="p-3">Mã NK</th>
              <th className="p-3">Mã NV</th>
              <th className="p-3">Nhà cung cấp</th>
              <th className="p-3">Ngày nhập</th>
              <th className="p-3">Tổng tiền</th>
              <th className="p-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {imports.map((i) => (
              <tr key={i.MaNK} className="border-b hover:bg-gray-100">
                <td className="p-3">{i.MaNK}</td>
                <td className="p-3">{i.MaNV}</td>
                <td className="p-3">{i.NhaCungCap}</td>
                <td className="p-3">
                  {new Date(i.NgayNhap).toLocaleString("vi-VN")}
                </td>
                <td className="p-3">{i.TongTien.toLocaleString("vi-VN")}</td>
                <td className="p-3 flex justify-center gap-3">
                  <button
                    className="bg-sky-500 text-white px-3 py-1 rounded-lg"
                    onClick={() => handleView(i.MaNK)}
                  >
                    Xem
                  </button>
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg"
                    onClick={async () => {
                      if (!token) {
                        setShowLogin(true);
                        return;
                      }
                      const full = await inventoryService.layDonNhapHang(i.MaNK);
                      setEditTarget(full);
                    }}
                  >
                    Sửa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center mt-4 gap-3">
        <button
          className="px-3 py-1 border rounded"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>
        <span className="px-2 py-1">
          {page} / {totalPages}
        </span>
        <button
          className="px-3 py-1 border rounded"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {/* POPUPS */}
      {viewTarget && (
        <ViewImportPopup
          data={viewTarget}
          onClose={() => setViewTarget(null)}
        />
      )}
      {editTarget && (
        <EditImportPopup
          record={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={handleSaveEdit}
        />
      )}
      {showAddPopup && (
        <AddImportPopup
          onClose={() => setShowAddPopup(false)}
          onAdded={() => {
            setShowAddPopup(false);
            setPage(1); // reset page sau khi thêm mới
            fetchData();
          }}
        />
      )}
      {showLogin && (
        <LoginPopup isOpen={showLogin} onClose={() => setShowLogin(false)} />
      )}
    </div>
  );
}
