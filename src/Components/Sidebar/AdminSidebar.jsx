import React from "react";
import { NavLink } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StorefrontIcon from "@mui/icons-material/Storefront";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
// Toggle removed; sidebar expands on hover.

const items = [
  { label: "Dashboard", to: "/admin-dashboard", icon: DashboardIcon },
  { label: "Branch Management", to: "/admin-dashboard/branches", icon: StorefrontIcon },
  { label: "Product Management", to: "/admin-dashboard/products", icon: Inventory2Icon },
  { label: "Inventory Management", to: "/admin-dashboard/inventory", icon: Inventory2Icon },
  { label: "Employee List", to: "/admin-dashboard/employees", icon: PeopleAltIcon },
  { label: "Discounts", to: "/admin-dashboard/discounts", icon: LocalOfferIcon },
];

const AdminSidebar = () => {
  // Always collapsed; expand on hover.
  return (
    <aside className="group w-16 hover:w-64 transition-[width] duration-200 shrink-0">
      <div className="bg-gray-900/70 border border-white/10 rounded-xl p-3 sticky top-4 relative">
        <nav className="flex flex-col gap-2">
          {items.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              title={label}
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 rounded-lg font-medium transition-colors duration-200 justify-center px-0 group-hover:px-4 group-hover:justify-start ` +
                (isActive ? "bg-blue-600 text-white shadow" : "bg-gray-800 text-blue-300 hover:bg-blue-700/40 hover:text-white")
              }
              end={to === "/admin-dashboard"}
            >
              <Icon fontSize="small" />
              <span className="hidden group-hover:inline">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;
