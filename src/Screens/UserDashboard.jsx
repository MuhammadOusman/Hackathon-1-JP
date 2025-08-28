import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import UserNavbar from "../Components/Navbar/UserNavbar";
import UserCatalog from "./UserCatalog";
import UserOrder from "./UserOrder";
import UserReview from "./UserReview";

const UserDashboard = () => {
  return (
    <div className="dashboard-container bg-gray-900 min-h-screen text-white">
      <UserNavbar />
      <div className="max-w-5xl mx-auto py-8">
        <Routes>
          <Route index element={<Navigate to="catalog" replace />} />
          <Route path="catalog" element={<UserCatalog />} />
          <Route path="order" element={<UserOrder />} />
          <Route path="review" element={<UserReview />} />
        </Routes>
      </div>
    </div>
  );
};

export default UserDashboard;
