// mockData.ts

// --- 1. Dữ liệu KPIs Tổng quan ---
export const totalEmployees = 4;
export const totalCustomers = 40;

// --- 2. Dữ liệu Doanh thu Cả tuần (Biểu đồ Cột) ---
export interface WeeklyRevenueItem {
  day: string;
  revenue: number;
  [key: string]: any; // ✅ Thêm Index Signature
}
export const weeklyRevenueData: WeeklyRevenueItem[] = [
  { day: "Thứ Hai", revenue: 15000000 },
  { day: "Thứ Ba", revenue: 20000000 },
  { day: "Thứ Tư", revenue: 18000000 },
  { day: "Thứ Năm", revenue: 22000000 },
  { day: "Thứ Sáu", revenue: 25000000 },
  { day: "Thứ Bảy", revenue: 30000000 },
  { day: "Chủ Nhật", revenue: 19000000 },
];

// --- 3. Dữ liệu Top 5 Khách hàng (Bảng xếp hạng) ---
export interface CustomerRankingItem {
  rank: number;
  name: string;
  total_spent: number;
  [key: string]: any; // ✅ Thêm Index Signature
}
export const topCustomersData: CustomerRankingItem[] = [
  { rank: 1, name: "Nguyễn Văn A", total_spent: 50000000 },
  { rank: 2, name: "Trần Thị B", total_spent: 35000000 },
  { rank: 3, name: "Lê Văn C", total_spent: 28000000 },
  { rank: 4, name: "Phạm Văn D", total_spent: 22000000 },
  { rank: 5, name: "Hoàng Thị E", total_spent: 19000000 },
];

// --- 4. Dữ liệu 5 Sản phẩm sắp hết hàng (Bảng cảnh báo) ---
export interface LowStockProduct {
  name: string;
  stock: number;
  [key: string]: any; // ✅ Thêm Index Signature
}
export const lowStockProductsData: LowStockProduct[] = [
  { name: "Áo Thun Đen", stock: 10 },
  { name: "Giày Da Trắng", stock: 12 },
  { name: "Quần Jeans Slimfit", stock: 20 },
  { name: "Túi Xách Nữ", stock: 15 },
  { name: "Đồng Hồ Cơ", stock: 5 },
];

// --- 5. Dữ liệu Phân bổ Doanh thu theo Phân loại (Biểu đồ Tròn) ---
export interface RevenueByCategoryItem {
  category: string;
  revenue_percent: number;
  revenue_amount: number;
  [key: string]: any; // ✅ Thêm Index Signature
}
export const revenueByCategoryData: RevenueByCategoryItem[] = [
  { category: "Thời Trang", revenue_percent: 30, revenue_amount: 150000000 },
  { category: "Điện Tử", revenue_percent: 55, revenue_amount: 275000000 },
  { category: "Gia Dụng", revenue_percent: 15, revenue_amount: 75000000 },
];
