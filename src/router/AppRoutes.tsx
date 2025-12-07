import { Routes, Route } from "react-router-dom";

// Layouts
import AdminLayout from "../layouts/AdminLayout";

// Pages
import HomePage from "../pages/HomePage";
import ProductPage from "../pages/ProductPage";
import ProductDetail from "../pages/ProductDetail";
import CustomerManagement from "../pages/CustomerManagement";
import CreateOrderPage from "../pages/CreateOrderPage";
import OrderManagement from "../pages/OrderManagement";
import ImportManagement from "../pages/ImportPage";
// import CartPage from "../pages/CartPage";
// import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Layout người dùng */}
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<HomePage />} />
        <Route path="sanpham" element={<ProductPage />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/khachhang" element={<CustomerManagement />} />
        <Route path="/taodonhang" element={<CreateOrderPage />} />
        <Route path="/donhang" element={<OrderManagement />} />
        <Route path="/nhapkho" element={<ImportManagement />} />
      </Route>

      {/* 404 */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
};

export default AppRoutes;
