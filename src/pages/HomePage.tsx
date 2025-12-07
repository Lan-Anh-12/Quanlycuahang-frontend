import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  getTotalCustomers,
  getWeeklyRevenue,
  getTopCustomers,
  getLowStockProducts,
  getRevenueByCategory,
  type WeeklyRevenueItem,
  type CustomerRankingItem,
  type LowStockProduct,
  type RevenueByCategoryItem,
} from "../services/dashboardService";

const LIGHT_GREEN_BG = "bg-green-100/50";
const LIGHT_BLUE_BG = "bg-blue-100/50";

// ==========================
// Stat Card
// ==========================
interface StatCardProps {
  title: string;
  value: string | number;
  color: string;
  to: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color, to }) => (
  <Link
    to={to}
    className={`p-6 rounded-xl shadow-lg block transition duration-300 hover:shadow-xl hover:translate-y-[-2px] ${color} text-center`}
  >
    <p className="text-lg font-semibold text-gray-700">{title}</p>
    <h3 className="text-5xl font-extrabold mt-3 text-gray-900">{value}</h3>
  </Link>
);

// ==========================
// Revenue Bar Chart
// ==========================
const RevenueBarChart: React.FC<{ data: WeeklyRevenueItem[] }> = ({ data }) => {
  const formatCurrency = (value: number) => `${(value / 1_000_000).toFixed(0)}M`;
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
        <XAxis dataKey="day" axisLine={false} tickLine={false} className="text-sm" />
        <YAxis
          tickFormatter={formatCurrency}
          axisLine={false}
          tickLine={false}
          className="text-sm"
        />
        <Tooltip
          contentStyle={{ background: "rgba(255,255,255,0.9)", borderRadius: 6 }}
          formatter={(value: number) => [`${value.toLocaleString("vi-VN")} VNĐ`, "Doanh thu"]}
        />
        <Bar dataKey="revenue" fill="#4CAF50" barSize={35} radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

// ==========================
// Revenue Pie Chart
// ==========================
const CategoryPieChart: React.FC<{ data: RevenueByCategoryItem[] }> = ({ data }) => {
  const COLORS = ["#1976D2", "#4CAF50", "#FFC107", "#FF5722", "#9C27B0"];
  const renderCustomLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index,
  }: any) => {
    if (percent * 100 < 5) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);
    return (
      <text
        x={x}
        y={y}
        fill={COLORS[index % COLORS.length]}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-sm font-semibold"
      >
        {`${data[index].category} (${data[index].revenue_percent}%)`} 
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="revenue_percent"
          nameKey="category"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          labelLine={false}
          label={renderCustomLabel}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="#fff" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number, _name, props: any) => [
            `${value}% (${props.payload.revenue_amount.toLocaleString("vi-VN")} VNĐ)`,
            props.payload.category,
          ]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

// ==========================
// Customer ranking table
// ==========================
const CustomerRankingTable: React.FC<{ data: CustomerRankingItem[] }> = ({ data }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium">Hạng</th>
          <th className="px-6 py-3 text-left text-xs font-medium">Tên Khách hàng</th>
          <th className="px-6 py-3 text-right text-xs font-medium">Tổng chi tiêu</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-100">
        {data.map((c) => (
          <tr
            key={c.rank}
            className={`${c.rank <= 3 ? "bg-yellow-50/50" : "hover:bg-gray-50"} transition`}
          >
            <td className="px-6 py-3 font-semibold">{c.rank}</td>
            <td className="px-6 py-3">{c.name}</td>
            <td className="px-6 py-3 text-right font-semibold">
              {c.total_spent.toLocaleString("vi-VN")} VNĐ
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ==========================
// Low stock table
// ==========================
const LowStockTable: React.FC<{ data: LowStockProduct[] }> = ({ data }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium">Tên Sản phẩm</th>
          <th className="px-6 py-3 text-right text-xs font-medium">Tồn kho</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-100">
        {data.map((p, i) => (
          <tr
            key={i}
            className={`${p.stock <= 10 ? "bg-red-50/50" : "hover:bg-gray-50"} transition`}
          >
            <td className="px-6 py-3 font-medium">{p.name}</td>
            <td
              className={`px-6 py-3 text-right font-bold ${
                p.stock <= 10 ? "text-red-700" : "text-gray-700"
              }`}
            >
              {p.stock}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ==========================
// MAIN DASHBOARD COMPONENT
// ==========================
export default function Dashboard() {
  const [totalCustomers, setTotalCustomers] = useState<number | string>("...");
  const [weeklyProfit, setWeeklyProfit] = useState<number | string>("...");
  const [weeklyRevenue, setWeeklyRevenue] = useState<WeeklyRevenueItem[]>([]);
  const [topCustomers, setTopCustomers] = useState<CustomerRankingItem[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [revenueByCategory, setRevenueByCategory] = useState<RevenueByCategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);

      try {
        const total = await getTotalCustomers();
        setTotalCustomers(total);
      } catch (error) {
        console.error("Lỗi khi tải Tổng Khách hàng:", error);
        setTotalCustomers("N/A");
      }

      try {
        const weekData = await getWeeklyRevenue();
        setWeeklyRevenue(weekData);
      } catch (error) {
        console.error("Lỗi khi tải Doanh thu theo tuần:", error);
      }

      try {
        const topData = await getTopCustomers(5);
        setTopCustomers(topData);
      } catch (error) {
        console.error("Lỗi khi tải Top Khách hàng:", error);
      }

      try {
        const lowData = await getLowStockProducts(5);
        setLowStockProducts(lowData);
      } catch (error) {
        console.error("Lỗi khi tải Sản phẩm tồn kho thấp:", error);
      }

      try {
        const catData = await getRevenueByCategory();
        setRevenueByCategory(catData);
      } catch (error) {
        console.error("Lỗi khi tải Doanh thu theo Phân loại:", error);
      }

      setLoading(false);
    };

    loadDashboardData();
  }, []);

  if (loading)
    return (
      <div className="p-10 text-center text-xl font-medium">Đang tải dữ liệu…</div>
    );

  return (
    <div className="p-6 md:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Tổng quan hoạt động</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatCard
          title="Tổng số Khách hàng"
          value={totalCustomers}
          color={LIGHT_GREEN_BG}
          to="/khachhang"
        />
      </div>

      {/* Revenue + Top customers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-6">📈 Doanh thu 7 ngày gần nhất</h2>
          {weeklyRevenue.length > 0 ? (
            <RevenueBarChart data={weeklyRevenue} />
          ) : (
            <p className="text-center py-10 text-gray-500">Không có dữ liệu doanh thu</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-6">🏆 Top 5 Khách hàng</h2>
          {topCustomers.length > 0 ? (
            <CustomerRankingTable data={topCustomers} />
          ) : (
            <p className="text-center py-5 text-gray-500">Không có dữ liệu khách hàng</p>
          )}
        </div>
      </div>

      {/* Low stock + Category revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-6">⚠️ Sản phẩm sắp hết hàng</h2>
          {lowStockProducts.length > 0 ? (
            <LowStockTable data={lowStockProducts} />
          ) : (
            <p className="text-center py-5 text-gray-500">Không có sản phẩm tồn kho thấp</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-6">📊 Doanh thu theo phân loại</h2>
          {revenueByCategory.length > 0 ? (
            <CategoryPieChart data={revenueByCategory} />
          ) : (
            <p className="text-center py-10 text-gray-500">Không có dữ liệu phân loại</p>
          )}
        </div>
      </div>
    </div>
  );
}
