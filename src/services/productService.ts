// src/services/productService.ts (Hoặc tên file tương ứng)
import api from "./api";

// ĐÃ XÓA: const API_URL = "http://localhost:8080/quanly/khohang";

// ==== Interface ====
export interface Product {
  maSP: string;
  tenSP: string;
  phanLoai: string;
  giaBan: number;
  moTa: string;
  soLuongTon: number;
  url: string;
}

export interface ProductRequest {
  tenSP: string;
  phanLoai: string;
  giaBan: number;
  moTa: string;
  soLuong: number;
  url: string;
}

// ==== API ====

// Lấy tất cả sản phẩm còn bán
export const getAllProducts = async (): Promise<Product[]> => {
  // SỬA: Dùng đường dẫn tương đối (Giả sử Backend có tiền tố /api/quanly/khohang)
  const res = await api.get<Product[]>("/api/quanly/khohang/sanpham/conban");
  return res.data;
};

// Thêm sản phẩm mới
export const createProduct = async (data: ProductRequest): Promise<Product> => {
  // SỬA: Dùng đường dẫn tương đối
  const res = await api.post<Product>("/api/quanly/khohang/taosp", data);
  return res.data;
};

// Cập nhật sản phẩm
export const updateProduct = async (maSP: string, data: ProductRequest): Promise<Product> => {
  // SỬA: Dùng đường dẫn tương đối
  const res = await api.put<Product>(`/api/quanly/khohang/suasp/${maSP}`, data);
  return res.data;
};


export const getProductById = async (maSP: string): Promise<Product> => {
  
    const all = await getAllProducts();
    const item = all.find(p => p.maSP === maSP);
    if (!item) throw new Error("Sản phẩm không tồn tại");
    return item;
};

// tìm kiếm sản phẩm theo tên
export const searchProductsByName = async (name: string): Promise<Product[]> => {
  try {
    // SỬA: Dùng đường dẫn tương đối
    const res = await api.get<Product[]>("/api/quanly/khohang/sanpham/tim", {
      params: { tenSP: name }
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi tìm sản phẩm:", error);
    return [];
  }
};

// xóa sản phẩm
export const deleteProduct = async (maSP: string): Promise<void> => {
  // SỬA: Dùng đường dẫn tương đối
  await api.delete(`/api/quanly/khohang/sanpham/xoa/${maSP}`);
};
