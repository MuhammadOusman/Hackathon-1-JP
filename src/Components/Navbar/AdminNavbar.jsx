import React from "react";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-lg rounded-b-xl">
      <div className="flex items-center gap-3">
        <img src="/logo.svg" alt="FranchiseMS" className="w-8 h-8 rounded-lg" />
        <div className="text-2xl font-extrabold tracking-wide">Admin Panel</div>
      </div>
      <button
        onClick={handleLogout}
        aria-label="Logout"
        title="Logout"
        className="p-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
      >
        <LogoutIcon fontSize="medium" />
      </button>
    </nav>
  );
};

export default AdminNavbar;
