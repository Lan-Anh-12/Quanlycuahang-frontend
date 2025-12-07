import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import EditProductPopup from "../components/common/EditProductPopup";
import { getAllProducts,type Product } from "../services/productService";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;
        const all = await getAllProducts();
        const item = all.find(p => p.maSP === id);
        if (item) setProduct(item);
      } catch (err) {
        console.error("Lỗi lấy sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <p className="p-6 text-gray-500">Đang tải dữ liệu sản phẩm...</p>;
  if (!product) return <p className="p-6 text-red-500">Không tìm thấy sản phẩm!</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Chi tiết sản phẩm #{product.maSP}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl overflow-hidden shadow-lg">
          <img
            src={product.url || "/placeholder.png"}
            alt={product.tenSP}
            className="w-full h-[350px] object-cover"
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg space-y-4 text-gray-700">
          <p><strong>Tên sản phẩm:</strong> {product.tenSP}</p>
          <p><strong>Phân loại:</strong> {product.phanLoai || "Chưa phân loại"}</p>
          <p><strong>Giá bán:</strong> {product.giaBan?.toLocaleString()}₫</p>
          <p><strong>Số lượng tồn:</strong> {product.soLuongTon}</p>
          <p><strong>Mô tả:</strong> {product.moTa || "Không có mô tả"}</p>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => setShowPopup(true)}
          className="px-6 py-2 bg-green-700 text-white font-semibold rounded-lg shadow hover:bg-green-800 transition-colors"
        >
          Sửa sản phẩm
        </button>
      </div>

      {showPopup && product && (
        <EditProductPopup
          product={product}
          onClose={() => setShowPopup(false)}
          onSave={(updated) => {
            setProduct(updated);
            setShowPopup(false);
            alert("Cập nhật sản phẩm thành công!");
          }}
        />
      )}
    </div>
  );
}
