import api from "./api";

export interface Customer {
  maKH: string;      // Mã khách hàng, dùng làm path param
  tenKH: string;     // dùng FE state, sẽ map sang tenKH khi gửi
  namSinh: number;
  diaChi: string;
  sdt: string;
}

// ĐÃ XÓA: const API_URL = "http://localhost:8080/quanly/khachhang";

// Lấy tất cả khách hàng
export const getCustomers = async (): Promise<Customer[]> => {
  // SỬA: Dùng đường dẫn tương đối
  const res = await api.get("/quanly/khachhang/tatca");
  return res.data;
};

// Tìm khách hàng theo tên hoặc SĐT
export const searchCustomers = async (tenKH: string): Promise<Customer[]> => {
  // SỬA: Dùng đường dẫn tương đối
  const res = await api.get("/quanly/khachhang/tim", { params: { tenKH } });
  return res.data;
};

// Cập nhật khách hàng
export const updateCustomer = async (
  maKH: string,
  data: { tenKH: string; namSinh: number; diaChi: string; sdt: string }
): Promise<Customer> => {
  // SỬA: Dùng đường dẫn tương đối
  const res = await api.put(`/quanly/khachhang/capnhat/${maKH}`, data);
  return res.data;
};

// tìm kiếm khách hàng theo tên
export const searchCustomersByName = async (tenKH: string): Promise<Customer[]> => {
  // SỬA: Dùng đường dẫn tương đối
  const res = await api.get("/quanly/khachhang/timkiem", { params: { tenKH } });
  return res.data;
};
