// types.ts
export interface WeeklyRevenueItem {
  day: string;
  revenue: number;
  [key: string]: any;
}

export interface CustomerRankingItem {
  rank?: number; // rank tính ở FE
  name: string;
  total_spent: number;
  [key: string]: any;
}

export interface LowStockProduct {
  name: string;
  stock: number;
  [key: string]: any;
}

export interface RevenueByCategoryItem {
  category: string;
  revenue_percent: number;
  revenue_amount: number;
  [key: string]: any;
}

export interface KPIs {
  totalEmployees: number;
  totalCustomers: number;
}
export interface DashboardData {
  kpis: KPIs;
  topCustomers: CustomerRankingItem[];
  weeklyRevenue: WeeklyRevenueItem[];
  lowStockProducts: LowStockProduct[];
  revenueByCategory: RevenueByCategoryItem[];
}