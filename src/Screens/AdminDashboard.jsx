import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import AdminNavbar from "../Components/Navbar/AdminNavbar";
import AdminSidebar from "../Components/Sidebar/AdminSidebar";
import { lazy, Suspense } from "react";
const DashboardHome = lazy(() => import("./DashboardHome"));
const BranchManagement = lazy(() => import("./BranchManagement"));
const ProductManagement = lazy(() => import("./ProductManagement"));
const InventoryManagement = lazy(() => import("./InventoryManagement"));
const EmployeeList = lazy(() => import("./EmployeeList"));
const OffersManagement = lazy(() => import("./OffersManagement"));

const AdminDashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="dashboard-container bg-gray-900 min-h-screen text-white">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <AdminSidebar />
        <main className="flex-1">
          <Suspense fallback={<div className="py-10 text-center text-gray-400">Loading…</div>}>
            <Routes>
              <Route path="" element={<DashboardHome />} />
              <Route path="branches" element={<BranchManagement />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="inventory" element={<InventoryManagement />} />
              <Route path="employees" element={<EmployeeList />} />
              <Route path="discounts" element={<OffersManagement />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
