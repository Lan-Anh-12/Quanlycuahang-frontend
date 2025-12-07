import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProducts, deleteProduct, type Product } from "../services/productService";
import AddProductPopup from "../components/common/AddProductPopup";

type SortOption = "" | "priceAsc" | "priceDesc" | "nameAsc" | "nameDesc"; 

export default function ProductPage() {
  const navigate = useNavigate();
  const pageSize = 10; // Kích thước trang

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  // =========================
  // FETCH DATA
  // =========================
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const list = await getAllProducts();
      setAllProducts(list);
    } catch (err) {
      console.error("Lỗi fetch sản phẩm:", err);
      setAllProducts([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ==================================================================
  // LỌC, SẮP XẾP, PHÂN TRANG
  // ==================================================================
  const { productsOnPage, totalPages } = useMemo(() => {
    let filtered = [...allProducts];

    // 1. LỌC
    if (search.trim() !== "") {
      filtered = filtered.filter(
        (p) =>
          p.tenSP.toLowerCase().includes(search.toLowerCase()) ||
          p.phanLoai?.toLowerCase().includes(search.toLowerCase()) ||
          p.maSP.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 2. SẮP XẾP
    if (sort === "priceAsc") filtered.sort((a, b) => a.giaBan - b.giaBan);
    else if (sort === "priceDesc") filtered.sort((a, b) => b.giaBan - a.giaBan);
    else if (sort === "nameAsc") filtered.sort((a, b) => a.tenSP.localeCompare(b.tenSP));
    else if (sort === "nameDesc") filtered.sort((a, b) => b.tenSP.localeCompare(a.tenSP));


    // 3. PHÂN TRANG
    const total = filtered.length;
    const calculatedTotalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedProducts = filtered.slice(start, end);

    return { productsOnPage: paginatedProducts, totalPages: calculatedTotalPages || 1 };
  }, [allProducts, search, sort, page]);

  // Điều chỉnh trang nếu cần
  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(totalPages);
    else if (page === 0 && totalPages > 0) setPage(1);
    else if (page > 1 && productsOnPage.length === 0) setPage(page - 1);
  }, [page, totalPages, productsOnPage.length]);

  // Reset trang khi lọc hoặc sắp xếp thay đổi
  useEffect(() => {
    setPage(1);
  }, [search, sort]);


  // =========================
  // DELETE PRODUCT
  // =========================
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget.maSP); // gọi API từ productService.ts bằng maSP
      alert(`Đã xóa sản phẩm "${deleteTarget.tenSP}" thành công`);
      setDeleteTarget(null);
      fetchData(); // Tải lại dữ liệu sau khi xóa
    } catch (err) {
      console.error("Lỗi xóa sản phẩm:", err);
      alert("Không thể xóa sản phẩm!");
    }
  };

  // =========================
  // RENDER
  // =========================
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      <h2 className="text-3xl font-bold mb-6 text-[#537B24]">Quản Lý Sản Phẩm</h2>
      
      {/* TOP BAR (Tìm kiếm, Sắp xếp, Thêm mới) */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Tìm theo Mã/Tên/Phân loại..."
            className="border rounded px-4 py-2 w-80 shadow-sm focus:ring-[#A7D388] focus:border-[#A7D388]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          
          <select 
            className="border px-3 py-2 rounded shadow-sm focus:ring-[#A7D388] focus:border-[#A7D388]"
            value={sort} 
            onChange={(e) => setSort(e.target.value as SortOption)} 
          >
            <option value="">--- Sắp xếp ---</option>
            <option value="nameAsc">Tên (A-Z)</option>
            <option value="nameDesc">Tên (Z-A)</option>
            <option value="priceAsc">Giá tăng dần</option>
            <option value="priceDesc">Giá giảm dần</option>
          </select>
        </div>
        <button
          onClick={() => setShowPopup(true)}
          className="bg-[#537B24] text-white px-4 py-2 rounded font-semibold hover:bg-green-700 transition"
        >
          ➕ Thêm mới
        </button>
      </div>

      {/* Loading/Empty State */}
      {loading && <p className="text-center py-10 text-gray-500">Đang tải sản phẩm...</p>}
      {!loading && allProducts.length === 0 && <p className="text-center py-10 text-gray-500">Không có sản phẩm nào trong kho.</p>}

      {/* BẢNG DANH SÁCH SẢN PHẨM */}
      {!loading && productsOnPage.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#A7D388] text-[#537B24] font-semibold sticky top-0">
              <tr>
                <th className="p-3 w-20">Mã SP</th>
                <th className="p-3 w-4/12">Tên Sản Phẩm</th>
                <th className="p-3 w-1/12">Phân Loại</th>
                <th className="p-3 w-1/12">Giá Bán</th>
                <th className="p-3 w-1/12">Tồn Kho</th>
                <th className="p-3 text-center w-2/12">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {productsOnPage.map((p) => (
                <tr 
                  key={p.maSP} 
                  className="border-b last:border-b-0 hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-mono text-sm">{p.maSP}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <img 
                          src={p.url || 'placeholder.jpg'} 
                          alt={p.tenSP} 
                          className="w-10 h-10 object-cover rounded shadow"
                      />
                      <span>{p.tenSP}</span>
                    </div>
                  </td>
                  <td className="p-3 text-sm">{p.phanLoai || '---'}</td>
                  <td className="p-3 font-semibold text-green-700">
                    {p.giaBan.toLocaleString("vi-VN")} đ
                  </td>
                  <td className="p-3 font-mono text-center">{p.soLuongTon}</td>
                  <td className="p-3">
                    <div className="flex gap-2 justify-center">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600 transition shadow-md"
                        onClick={() => navigate(`/products/${p.maSP}`)}
                      >
                        Xem
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition shadow-md"
                        onClick={() => setDeleteTarget(p)}
                      >
                        Xoá
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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


      {/* Add Product Popup */}
      {showPopup && (
        <AddProductPopup
          onClose={() => setShowPopup(false)}
          onSuccess={() => {
            fetchData();
            alert("Thêm sản phẩm thành công!");
            setShowPopup(false);
          }}
        />
      )}

      {/* Delete confirmation (Sử dụng Tailwind classes) */}
      {deleteTarget && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
        >
          <div
            className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative"
          >
            <button
              onClick={() => setDeleteTarget(null)}
              className="absolute top-3 right-3 text-xl text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
            <h2 className="text-xl font-semibold mb-2">
              Xóa sản phẩm <span className="text-red-500">{deleteTarget.tenSP}</span>?
            </h2>
            <p className="text-gray-600 mb-6">Thao tác này không thể hoàn tác.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeleteTarget(null)} 
                className="px-4 py-2 border rounded hover:bg-gray-100 transition"
              >
                Huỷ
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}