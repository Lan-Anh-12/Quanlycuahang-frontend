
import api from "./api";

export interface Customer {
  maKH: string;      // Mã khách hàng, dùng làm path param
  tenKH: string;     // dùng FE state, sẽ map sang tenKH khi gửi
  namSinh: number;
  diaChi: string;
  sdt: string;
}

const API_URL = "http://localhost:8080/quanly/khachhang";

// Lấy tất cả khách hàng
export const getCustomers = async (): Promise<Customer[]> => {
  const res = await api.get(`${API_URL}/tatca`);
  return res.data;
};

// Tìm khách hàng theo tên hoặc SĐT
export const searchCustomers = async (tenKH: string): Promise<Customer[]> => {
  const res = await api.get(`${API_URL}/tim`, { params: { tenKH } });
  return res.data;
};

// Cập nhật khách hàng
export const updateCustomer = async (
  maKH: string,
  data: { tenKH: string; namSinh: number; diaChi: string; sdt: string }
): Promise<Customer> => {
  const res = await api.put(`${API_URL}/capnhat/${maKH}`, data);
  return res.data;
};

// tìm kiếm khách hàng theo tên
export const searchCustomersByName = async (tenKH: string): Promise<Customer[]> => {
  const res = await api.get(`${API_URL}/timkiem`, { params: { tenKH } });
  return res.data;
};
