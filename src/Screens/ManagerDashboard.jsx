import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../Store/ProductSlice";
import ManagerNavbar from "../Components/Navbar/ManagerNavbar";
import ManagerSidebar from "../Components/Sidebar/ManagerSidebar";
import { lazy, Suspense } from "react";
const ManagerDashboardHome = lazy(() => import("./ManagerDashboardHome"));
const ManagerProducts = lazy(() => import("./ManagerProducts"));
const ManagerInventory = lazy(() => import("./ManagerInventory"));
const ManagerEmployees = lazy(() => import("./ManagerEmployees"));
const ManagerReviews = lazy(() => import("./ManagerReviews"));
import { Routes, Route } from "react-router-dom";

const ManagerDashboard = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);
  return (
    <div className="dashboard-container bg-gray-900 min-h-screen text-white">
      <ManagerNavbar />
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <ManagerSidebar />
        <main className="flex-1">
          <Suspense fallback={<div className="py-10 text-center text-gray-400">Loading…</div>}>
            <Routes>
              <Route path="" element={<ManagerDashboardHome />} />
              <Route path="products" element={<ManagerProducts />} />
              <Route path="inventory" element={<ManagerInventory />} />
              <Route path="employees" element={<ManagerEmployees />} />
              <Route path="reviews" element={<ManagerReviews />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default ManagerDashboard;
