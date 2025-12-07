// src/services/inventoryService.ts
import api from "./api";

// =======================
// Typing frontend
// =======================
export interface CTNhapKho {
  maCTNK: string;
  maNK: string;
  maSP: string;
  tenSP?: string;
  soLuong: number;
  donGia: number;
  thanhTien: number;
}

export interface NhapKho {
  maNK: string;
  maNV: string;
  nhaCungCap: string;
  ngayNhap: string; // ISO string
  tongTien: number;
  chiTiet: CTNhapKho[];
}

// ==== Backend request/response typing ====
export interface CTNhapKhoRequest {
  maSP: string;
  soLuong: number;
  donGia: number;
}

export interface NhapKhoRequest {
  maNV: string;
  nhaCungCap: string;
  ngayNhap: string;
  chiTiet: CTNhapKhoRequest[];
}

export interface CTNhapKhoResponse {
  maCTNK: string;
  maSP: string;
  tenSP: string;
  soLuong: number;
  donGia: number;
  thanhTien: number;
}

export interface NhapKhoResponse {
  maNK: string;
  maNV: string;
  nhaCungCap: string;
  ngayNhap: string;
  tongTien: number;
  chiTiet: CTNhapKhoResponse[];
}

// ==== Product typing ====
export interface Product {
  maSP: string;
  tenSP: string;
  phanLoai?: string;
  giaBan: number;
  moTa?: string;
  soLuongTon?: number;
  url?: string;
}

// =======================
// Service API
// =======================
export const inventoryService = {
  // --- Import / Nhập kho ---
  layTatCaDonNhapHang: async (): Promise<NhapKhoResponse[]> => {
    const res = await api.get("/quanly/khohang/donnhaphang/tatca");
    return res.data;
  },

  taoDonNhapHang: async (req: NhapKhoRequest | NhapKho): Promise<NhapKhoResponse> => {
    const res = await api.post("/quanly/khohang/donnhaphang/tao", req);
    return res.data;
  },

  layChiTietDonNhap: async (maNK: string): Promise<CTNhapKhoResponse[]> => {
    const res = await api.get(`/quanly/khohang/donnhaphang/${maNK}`);
    return res.data.chiTiet || [];
  },

  layDonNhapHang: async (maNK: string): Promise<NhapKhoResponse> => {
    const res = await api.get(`/quanly/khohang/donnhaphang/${maNK}`);
    return res.data;
  },

  updateNhapKho: async (maNK: string, req: NhapKhoRequest | NhapKhoResponse) => {
    const res = await api.put(`/quanly/khohang/donnhaphang/${maNK}`, req);
    return res.data;
  },

  xoaChiTietNhapKho: async (maCTNK: string) => {
    const res = await api.delete(`/quanly/khohang/donnhaphang/chitiet/${maCTNK}`);
    return res.data;
  },

  // --- Product ---
  getAllProducts: async (): Promise<Product[]> => {
    const res = await api.get("/quanly/khohang/sanpham/conban");
    return res.data;
  },

  getProductById: async (maSP: string): Promise<Product> => {
    const all = await inventoryService.getAllProducts();
    const item = all.find((p) => p.maSP === maSP);
    if (!item) throw new Error("Sản phẩm không tồn tại");
    return item;
  },

  searchProductsByName: async (tenSP: string): Promise<Product[]> => {
    try {
      const res = await api.get("/quanly/khohang/sanpham/tim", { params: { tenSP } });
      return res.data;
    } catch (error) {
      console.error("Lỗi tìm sản phẩm:", error);
      return [];
    }
  },

  createProduct: async (data: Partial<Product>): Promise<Product> => {
    const res = await api.post("/quanly/khohang/taosp", data);
    return res.data;
  },

  updateProduct: async (maSP: string, data: Partial<Product>): Promise<Product> => {
    const res = await api.put(`/quanly/khohang/suasp/${maSP}`, data);
    return res.data;
  },

  deleteProduct: async (maSP: string): Promise<void> => {
    await api.delete(`/quanly/khohang/sanpham/xoa/${maSP}`);
  },
};

export default inventoryService;
