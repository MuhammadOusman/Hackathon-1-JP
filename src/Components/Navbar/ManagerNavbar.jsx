import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LogoutIcon from "@mui/icons-material/Logout";

const ManagerNavbar = () => {
  const navigate = useNavigate();
  const { branches } = useSelector((s) => s.branchReducer);
  const manager = useSelector((s) => s.userReducer?.currentManager);
  const branch = branches?.find((b) => String(b.managerId) === String(manager?.managerId));
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-lg rounded-b-xl">
      <div className="flex items-center gap-3">
        <img src="/logo.svg" alt="FranchiseMS" className="w-8 h-8 rounded-lg" />
        <div className="text-2xl font-extrabold tracking-wide">
          Branch Manager{branch?.name ? <span className="ml-3 text-blue-400">{branch.name}</span> : null}
        </div>
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

export default ManagerNavbar;
