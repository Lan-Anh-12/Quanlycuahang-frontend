// src/services/dashboardService.ts
import api from "./api";

export interface WeeklyRevenueItem {
  day: string;
  revenue: number;
}

export interface CustomerRankingItem {
  rank: number;
  name: string;
  total_spent: number;
}

export interface LowStockProduct {
  name: string;
  stock: number;
}

export interface RevenueByCategoryItem {
  category: string;
  revenue_amount: number;
  revenue_percent: number;
  [key: string]: string | number;
}



// ============================
// DASHBOARD API CALLS
// ============================
export const getTotalCustomers = async (): Promise<number> => {
  const res = await api.get("/api/dashboard/kpis");
  return res.data; // BE trả thẳng tổng số khách
};

export const getWeeklyRevenue = async (): Promise<WeeklyRevenueItem[]> => {
  const res = await api.get("/api/dashboard/weekly-revenue");
  return res.data;
};

export const getTopCustomers = async (
  limit: number
): Promise<CustomerRankingItem[]> => {
  const res = await api.get(`/api/dashboard/top-customers?limit=${limit}`);
  return res.data;
};

export const getLowStockProducts = async (
  limit: number
): Promise<LowStockProduct[]> => {
  const res = await api.get(`/api/dashboard/low-stock?limit=${limit}`);
  return res.data;
};

export const getRevenueByCategory = async (): Promise<RevenueByCategoryItem[]> => {
  const res = await api.get("/api/dashboard/revenue-by-category");
  return res.data;
};

