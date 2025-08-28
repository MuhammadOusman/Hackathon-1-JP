import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";

const linkBase =
  "px-3 py-2 rounded-md text-sm font-medium transition-colors";
const linkActive = "bg-blue-600 text-white";
const linkInactive = "text-gray-200 hover:text-white hover:bg-blue-500/20";

const UserNavbar = () => {
  const navigate = useNavigate();
  const onLogout = () => { localStorage.clear(); navigate('/login'); };

  let displayName = 'User';
  try {
    const raw = localStorage.getItem('user');
    if (raw) {
      const u = JSON.parse(raw);
      displayName = u?.name || u?.fullName || u?.displayName || u?.email || 'User';
    }
  } catch {}

  return (
    <nav className="bg-gray-900/80 backdrop-blur text-white px-6 py-4 shadow-md border-b border-white/10">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="FranchiseMS" className="w-8 h-8 rounded-lg" />
          <span className="text-xl font-bold text-white">Welcome</span>
          <span className="text-xl font-extrabold text-blue-400 truncate max-w-[40vw]" title={displayName}>{displayName}</span>
          <span className="text-xl" aria-hidden>👋</span>
        </div>
        <div className="flex items-center gap-2">
          <NavLink
            to="/user-dashboard/catalog"
            className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
            end
          >
            Catalog
          </NavLink>
          <NavLink
            to="/user-dashboard/order"
            className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
          >
            Order
          </NavLink>
          <NavLink
            to="/user-dashboard/review"
            className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
          >
            Review
          </NavLink>
        </div>
        <button
          onClick={onLogout}
          aria-label="Logout"
          title="Logout"
          className="p-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
        >
          <LogoutIcon fontSize="medium" />
        </button>
      </div>
    </nav>
  );
};

export default UserNavbar;
