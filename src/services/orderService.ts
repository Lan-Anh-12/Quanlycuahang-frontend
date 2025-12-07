// src/services/orderService.ts
import api from "./api";

// ============================
// INTERFACES (Giữ nguyên)
// ============================

// Ghi chú: FE dùng để hiển thị đơn hàng và chi tiết
export interface OrderRecord {
  maDH: string;
  maKH: string;
  maNV: string;
  ngayLap: string;
  tongTien: number;
}

export interface OrderDetail {
  maCTDH: string;
  maDH: string;
  maSP: string;
  soLuong: number;
  donGia: number;
  thanhTien: number;
}

export interface ChiTietDonHangResponse {
  maCTDH: string;
  maSP: string;
  soLuong: number;
  donGia: number;
  thanhTien: number;
}

export interface DonHangResponse {
  maDH: string;
  maKH: string;
  maNV: string;
  ngayLap: string;
  tongTien: number;
  chiTiet: ChiTietDonHangResponse[];
}

// ============================
// CREATE / UPDATE REQUEST (Giữ nguyên)
// ============================

export interface CreateOrderRequest {
  maNV: string;
  maKH?: string;       // Nếu khách cũ
  tenKH?: string;      // Chỉ dùng khi tạo khách mới
  namSinh?: number;    // Chỉ dùng khi tạo khách mới
  diaChi?: string;     // Chỉ dùng khi tạo khách mới
  sdt?:string;       // Chỉ dùng khi tạo khách mới
  chiTietDonHangs: {
    maSP: string;
    soLuong: number;
  }[];
}

export interface UpdateOrderRequest {
  maDH: string;
  chiTiet: {
    maSP: string;
    soLuong: number;
  }[];
}

export interface OrderDetailForm {
  MaSP: string;
  TenSP: string;   // chỉ hiển thị
  SoLuong: number;
  DonGia: number;  // chỉ hiển thị
  ThanhTien: number; // chỉ hiển thị
}

// ============================
// LẤY TẤT CẢ ĐƠN HÀNG
// GET /tatca
// ============================

export const getAllOrders = async (): Promise<OrderRecord[]> => {
  try {
    // SỬA: Dùng đường dẫn tương đối
    const res = await api.get("/api/quanly/donhang/tatca");
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy tất cả đơn hàng:", error);
    return [];
  }
};

// ============================
// LẤY CHI TIẾT ĐƠN HÀNG
// GET /chitiet/{maDH}
// ============================

export const getOrderDetails = async (maDH: string): Promise<OrderDetail[]> => {
  try {
    // SỬA: Dùng đường dẫn tương đối
    const res = await api.get(`/api/quanly/donhang/chitiet/${maDH}`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
    return [];
  }
};

// ============================
// TÌM KIẾM ĐƠN HÀNG
// GET /tim?keyword=xxx
// ============================

export const searchOrders = async (keyword: string): Promise<OrderRecord[]> => {
  try {
    // SỬA: Dùng đường dẫn tương đối
    const res = await api.get("/api/quanly/donhang/tim", { params: { keyword } });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm đơn hàng:", error);
    return [];
  }
};

// ============================
// CẬP NHẬT ĐƠN HÀNG
// PUT /capnhat
// ============================

export const updateOrder = async (data: UpdateOrderRequest): Promise<OrderRecord | null> => {
  try {
    // SỬA: Dùng đường dẫn tương đối
    const res = await api.put("/api/quanly/donhang/capnhat", data);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật đơn hàng:", error);
    return null;
  }
};

// ============================
// THÊM ĐƠN HÀNG VÀ CHI TIẾT
// POST /tao
// ============================

export const addOrderWithDetails = async (
  data: CreateOrderRequest
): Promise<DonHangResponse> => {
  try {
    // SỬA: Dùng đường dẫn tương đối
    const res = await api.post("/api/quanly/donhang/tao", data);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi thêm đơn hàng:", error);
    throw error;
  }
};
