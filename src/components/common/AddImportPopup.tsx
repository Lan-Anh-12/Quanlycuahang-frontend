import React, { useState, useEffect } from "react";
import { inventoryService, type NhapKho, type CTNhapKho, type Product } from "../../services/inventoryService";
import { useAuth } from "../../context/AuthContext";

interface Props {
  onClose: () => void;
  onAdded: () => void;
}

export default function AddImportPopup({ onClose, onAdded }: Props) {
  const { user, token } = useAuth();

  const [form, setForm] = useState<NhapKho>({
    maNK: "0",
    maNV: "",
    nhaCungCap: "",
    ngayNhap: new Date().toISOString().slice(0, 16),
    tongTien: 0,
    chiTiet: [],
  });

  const [details, setDetails] = useState<CTNhapKho[]>([]);
  const [productOptions, setProductOptions] = useState<Product[][]>([]); // mỗi dòng chi tiết có list tìm kiếm
  const [queryTexts, setQueryTexts] = useState<string[]>([]); // lưu text input tên sản phẩm

  useEffect(() => {
    if (user?.maNV) setForm((f) => ({ ...f, maNV: user.maNV }));
  }, [user?.maNV]);

  const addDetailRow = () => {
    setDetails((prev) => [
      ...prev,
      { maCTNK: "0", maNK: "0", maSP: "", tenSP: "", soLuong: 1, donGia: 0, thanhTien: 0 },
    ]);
    setProductOptions((prev) => [...prev, []]);
    setQueryTexts((prev) => [...prev, ""]);
  };

  const updateDetail = (index: number, field: keyof CTNhapKho, value: string | number) => {
    const updated = [...details];
    (updated[index] as any)[field] = value;

    if (field === "soLuong" || field === "donGia") {
      updated[index].thanhTien = Number(updated[index].soLuong) * Number(updated[index].donGia);
    }

    setDetails(updated);
    const total = updated.reduce((sum, d) => sum + d.thanhTien, 0);
    setForm({ ...form, tongTien: total, chiTiet: updated });
  };

  const handleProductSearch = async (query: string, index: number) => {
    setQueryTexts((prev) => prev.map((q, i) => (i === index ? query : q)));

    if (!query.trim()) {
      setProductOptions((prev) => prev.map((opt, i) => (i === index ? [] : opt)));
      return;
    }

    const results = await inventoryService.searchProductsByName(query.trim());
    setProductOptions((prev) => prev.map((opt, i) => (i === index ? results : opt)));
  };

  const selectProduct = (index: number, product: Product) => {
    const updated = [...details];
    updated[index].maSP = product.maSP;
    updated[index].tenSP = product.tenSP;
    updated[index].donGia = product.giaBan;
    updated[index].soLuong = 1;
    updated[index].thanhTien = product.giaBan;
    setDetails(updated);

    const total = updated.reduce((sum, d) => sum + d.thanhTien, 0);
    setForm({ ...form, chiTiet: updated, tongTien: total });

    // clear search results
    setProductOptions((prev) => prev.map((opt, i) => (i === index ? [] : opt)));
    setQueryTexts((prev) => prev.map((q, i) => (i === index ? product.tenSP : q)));
  };

  const save = async () => {
    if (!token) {
      alert("Vui lòng đăng nhập trước khi thực hiện thao tác");
      return;
    }

    // Validate: tất cả chi tiết phải chọn sản phẩm
    for (const d of details) {
      if (!d.maSP) {
        alert("Vui lòng chọn đầy đủ sản phẩm cho tất cả dòng chi tiết.");
        return;
      }
    }

    try {
      await inventoryService.taoDonNhapHang(form);
      alert("Thêm phiếu nhập thành công!");
      onAdded();
    } catch (err) {
      console.error("Lỗi thêm phiếu nhập:", err);
      alert("Thêm phiếu nhập thất bại. Kiểm tra console để biết chi tiết.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[600px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-[#537B24]">Thêm phiếu nhập</h2>

        {/* FORM NHẬP */}
        <div className="space-y-3">
          <div>
            <label className="font-semibold">Mã nhân viên</label>
            <input
              type="text"
              className="border w-full px-3 py-2 rounded"
              value={form.maNV}
              onChange={(e) => setForm({ ...form, maNV: e.target.value })}
            />
          </div>

          <div>
            <label className="font-semibold">Nhà cung cấp</label>
            <input
              type="text"
              className="border w-full px-3 py-2 rounded"
              value={form.nhaCungCap}
              onChange={(e) => setForm({ ...form, nhaCungCap: e.target.value })}
            />
          </div>

          <div>
            <label className="font-semibold">Ngày nhập</label>
            <input
              type="datetime-local"
              className="border w-full px-3 py-2 rounded"
              value={form.ngayNhap}
              onChange={(e) => setForm({ ...form, ngayNhap: e.target.value })}
            />
          </div>

          <div>
            <label className="font-semibold">Tổng tiền</label>
            <input
              disabled
              className="border w-full px-3 py-2 rounded bg-gray-100"
              value={form.tongTien.toLocaleString("vi-VN")}
            />
          </div>
        </div>

        {/* DETAILS */}
        <h3 className="text-lg font-semibold mt-4 mb-2">Danh sách chi tiết</h3>
        <button className="bg-sky-500 text-white px-3 py-1 rounded mb-2" onClick={addDetailRow}>
          + Thêm dòng
        </button>

        <div className="border rounded max-h-60 overflow-y-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Tên sản phẩm</th>
                <th className="p-2">SL</th>
                <th className="p-2">Đơn giá</th>
                <th className="p-2">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {details.map((d, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2 relative">
                    <input
                      type="text"
                      className="border px-2 py-1 rounded w-full"
                      value={queryTexts[index] || ""}
                      onChange={(e) => handleProductSearch(e.target.value, index)}
                    />
                    {productOptions[index]?.length > 0 && (
                      <ul className="absolute z-10 bg-white border rounded shadow w-full max-h-40 overflow-y-auto mt-1">
                        {productOptions[index].map((p) => (
                          <li
                            key={p.maSP}
                            className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                            onClick={() => selectProduct(index, p)}
                          >
                            {p.tenSP} - {p.giaBan.toLocaleString("vi-VN")} ₫
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      className="border px-2 py-1 rounded w-20"
                      value={d.soLuong}
                      onChange={(e) => updateDetail(index, "soLuong", Number(e.target.value))}
                      min={1}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      className="border px-2 py-1 rounded w-24"
                      value={d.donGia}
                      onChange={(e) => updateDetail(index, "donGia", Number(e.target.value))}
                    />
                  </td>
                  <td className="p-2 text-red-600">{d.thanhTien.toLocaleString("vi-VN")} ₫</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
            Hủy
          </button>
          <button className="px-4 py-2 bg-[#537B24] text-white rounded" onClick={save}>
            Thêm mới
          </button>
        </div>
      </div>
    </div>
  );
}
