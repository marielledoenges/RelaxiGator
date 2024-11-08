import React, { useState } from "react";
import { Link } from "react-router-dom";

const NavBar = ({ onLogout }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`fixed right-0 top-0 h-screen bg-gray-800 text-white shadow-lg z-50
        flex flex-col items-center transition-all duration-300 ease-in-out
        ${isExpanded ? "w-36" : "w-12"}`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 focus:outline-none"
      >
        {isExpanded ? "-" : "+"}
      </button>

      {/* Expanded Menu */}
      {isExpanded && (
        <div className="mt-4 flex flex-col space-y-4 text-lg">
          <Link
            to="/home"
            className="hover:bg-gray-700 px-4 py-2 rounded"
          >
            Home
          </Link>
          <Link
            to="/nutrition"
            className="hover:bg-gray-700 px-4 py-2 rounded"
          >
            Nutrition
          </Link>
          <button
            onClick={onLogout}
            className="hover:bg-gray-700 px-4 py-2 rounded"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default NavBar;
