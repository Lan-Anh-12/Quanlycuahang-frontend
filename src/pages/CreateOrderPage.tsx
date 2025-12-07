// src/pages/CreateOrderPage.tsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  addOrderWithDetails,
  type CreateOrderRequest,
  type OrderDetailForm,
} from "../services/orderService";
import { searchProductsByName, type Product } from "../services/productService";
import { searchCustomersByName, type Customer } from "../services/customerService";

interface OrderForm {
  maKH?: string;
  tenKH: string;
  namSinh?: number | string;
  diaChi?: string;
  sdt?: string;
  tongTien: number;
}

export default function CreateOrderPage() {
  const { user } = useAuth();
  const [order, setOrder] = useState<OrderForm>({ tenKH: "", tongTien: 0 });
  const [details, setDetails] = useState<OrderDetailForm[]>([]);
  const [customerOptions, setCustomerOptions] = useState<Customer[]>([]);
  const [productOptions, setProductOptions] = useState<Product[][]>([]);

  // Thêm dòng sản phẩm mới
  const addDetailRow = () => {
    setDetails([
      ...details,
      { MaSP: "", TenSP: "", SoLuong: 1, DonGia: 0, ThanhTien: 0 },
    ]);
    setProductOptions([...productOptions, []]);
  };

  // Tìm kiếm khách hàng
  const handleSearchCustomers = async (keyword: string) => {
    if (!keyword) return;
    const res = await searchCustomersByName(keyword);
    setCustomerOptions(res);
  };

  // Tìm kiếm sản phẩm cho dòng index
  const handleSearchProducts = async (index: number, keyword: string) => {
    if (!keyword) return;
    const res = await searchProductsByName(keyword);
    const clone = [...productOptions];
    clone[index] = res || [];
    setProductOptions(clone);
  };

  // Cập nhật chi tiết
  const updateDetail = (
    index: number,
    field: keyof OrderDetailForm,
    value: string | number
  ) => {
    const updated = [...details];

    if (field === "TenSP" && typeof value === "string") {
      updated[index].TenSP = value;
      const selected = Array.isArray(productOptions[index])
        ? productOptions[index].find((p) => p.tenSP === value)
        : undefined;
      if (selected) {
        updated[index].MaSP = selected.maSP;
        updated[index].DonGia = selected.giaBan;
      } else {
        updated[index].MaSP = "";
        updated[index].DonGia = 0;
      }
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }

    updated[index].ThanhTien = updated[index].SoLuong * updated[index].DonGia;
    setDetails(updated);

    const total = updated.reduce((sum, d) => sum + d.ThanhTien, 0);
    setOrder({ ...order, tongTien: total });
  };

  // Lưu đơn hàng
  const saveOrder = async () => {
    if (!user) {
      alert("Bạn cần đăng nhập!");
      return;
    }

    try {
      const chiTietDonHangs = details.map((d) => ({
        maSP: d.MaSP,
        soLuong: Number(d.SoLuong) || 1,
      }));

      const requestBody: CreateOrderRequest = {
        maNV: user.maNV,
        maKH: order.maKH,
        tenKH: !order.maKH ? order.tenKH : undefined,
        namSinh: !order.maKH && order.namSinh ? Number(order.namSinh) : undefined,
        diaChi: !order.maKH ? order.diaChi : undefined,
        sdt: !order.maKH ? order.sdt : undefined,
        chiTietDonHangs,
      };

      const createdOrder = await addOrderWithDetails(requestBody);

      alert("Tạo đơn hàng thành công!");
      console.log("Đơn hàng vừa tạo:", createdOrder);

      // Reset form
      setOrder({ tenKH: "", tongTien: 0 });
      setDetails([]);
      setProductOptions([]);
      setCustomerOptions([]);
    } catch (err: any) {
      console.error("Lỗi khi tạo đơn hàng:", err);
      alert(err.response?.data?.message || "Lỗi khi tạo đơn hàng!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-4xl shadow-lg">
        <h2 className="text-2xl font-bold text-[#537B24] mb-4">
          Tạo đơn hàng mới
        </h2>

        {/* Thông tin khách hàng */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="font-semibold">Tên khách hàng</label>
            <input
              type="text"
              className="border w-full px-3 py-2 rounded"
              value={order.tenKH}
              onChange={(e) => {
                const val = e.target.value;
                setOrder({ ...order, tenKH: val, maKH: undefined });
                const selected = customerOptions.find((c) => c.tenKH === val);
                if (selected) {
                  setOrder({
                    maKH: selected.maKH,
                    tenKH: selected.tenKH,
                    namSinh: selected.namSinh,
                    diaChi: selected.diaChi,
                    sdt: selected.sdt,
                    tongTien: order.tongTien,
                  });
                } else {
                  handleSearchCustomers(val);
                }
              }}
              list="customer-options"
            />
            <datalist id="customer-options">
              {customerOptions.map((c) => (
                <option key={c.maKH} value={c.tenKH} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="font-semibold">Năm sinh</label>
            <input
              type="number"
              className="border w-full px-3 py-2 rounded"
              value={order.namSinh || ""}
              onChange={(e) => setOrder({ ...order, namSinh: e.target.value })}
              disabled={!!order.maKH}
            />
          </div>

          <div>
            <label className="font-semibold">SĐT</label>
            <input
              type="text"
              className="border w-full px-3 py-2 rounded"
              value={order.sdt || ""}
              onChange={(e) => setOrder({ ...order, sdt: e.target.value })}
              disabled={!!order.maKH}
            />
          </div>

          <div className="col-span-2">
            <label className="font-semibold">Địa chỉ</label>
            <input
              type="text"
              className="border w-full px-3 py-2 rounded"
              value={order.diaChi || ""}
              onChange={(e) => setOrder({ ...order, diaChi: e.target.value })}
              disabled={!!order.maKH}
            />
          </div>
        </div>

        {/* Chi tiết đơn hàng */}
        <h3 className="text-lg font-semibold mb-2">Chi tiết đơn hàng</h3>
        <button
          className="bg-sky-500 text-white px-3 py-1 rounded mb-2"
          onClick={addDetailRow}
        >
          + Thêm sản phẩm
        </button>

        <div className="border rounded max-h-80 overflow-y-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Tên SP</th>
                <th className="p-2">Mã SP</th>
                <th className="p-2">SL</th>
                <th className="p-2">Đơn giá</th>
                <th className="p-2">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {details.map((d, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-2">
                    <input
                      type="text"
                      className="border px-2 py-1 rounded w-40"
                      value={d.TenSP}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateDetail(idx, "TenSP", val);
                        handleSearchProducts(idx, val);
                      }}
                      list={`product-options-${idx}`}
                    />
                    <datalist id={`product-options-${idx}`}>
                      {Array.isArray(productOptions[idx]) &&
                        productOptions[idx].map((p) => (
                          <option key={p.maSP} value={p.tenSP} />
                        ))}
                    </datalist>
                  </td>

                  <td className="p-2">{d.MaSP}</td>

                  <td className="p-2">
                    <input
                      type="number"
                      className="border px-2 py-1 rounded w-20"
                      value={d.SoLuong}
                      onChange={(e) =>
                        updateDetail(idx, "SoLuong", Number(e.target.value))
                      }
                    />
                  </td>

                  <td className="p-2">{d.DonGia.toLocaleString("vi-VN")} ₫</td>

                  <td className="p-2 text-red-600">
                    {d.ThanhTien.toLocaleString("vi-VN")} ₫
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-6">
          <div>
            <span className="font-semibold">Tổng tiền: </span>
            <span className="text-red-600 text-lg">
              {order.tongTien.toLocaleString("vi-VN")} ₫
            </span>
          </div>

          <button
            className="px-4 py-2 bg-[#537B24] text-white rounded"
            onClick={saveOrder}
          >
            Tạo đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
}
