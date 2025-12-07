import React from "react";
import Header from "../components/common/Header";
// import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Nội dung trang */}
      <main className="flex-1 bg-gray-100 p-4">
        <Outlet />
      </main>

      {/* <Footer /> */}
    </div>
  );
};

export default AdminLayout;
