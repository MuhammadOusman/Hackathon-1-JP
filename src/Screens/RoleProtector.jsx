import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// Usage: <RoleProtector role="admin" />
const RoleProtector = ({ role }) => {
  const userRole = localStorage.getItem("role");
  if (userRole !== role) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default RoleProtector;
