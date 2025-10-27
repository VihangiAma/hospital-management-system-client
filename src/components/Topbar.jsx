import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/api";

const Topbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout(navigate);
    }
  };

  return (
    <div className="fixed top-0 left-64 right-0 h-16 bg-white shadow flex items-center justify-between px-6 z-10">
      <h2 className="text-xl font-semibold">Admin Dashboard</h2>
      
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Topbar;
