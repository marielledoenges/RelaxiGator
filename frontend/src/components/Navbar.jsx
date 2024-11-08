import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = ({ onLogout }) => {
  return (
    <div
      className="fixed top-0 left-0 w-full h-12 bg-gray-800 text-white shadow-lg z-50
                 flex items-center justify-center space-x-8"
    >
      <Link to="/home" className="hover:bg-gray-700 px-4 py-2 rounded">
        Home
      </Link>
      <Link to="/nutrition" className="hover:bg-gray-700 px-4 py-2 rounded">
        Nutrition
      </Link>
      <Link to="/calendar" className="hover:bg-gray-700 px-4 py-2 rounded">
        Calendar
      </Link>
      <button onClick={onLogout} className="hover:bg-gray-700 px-4 py-2 rounded">
        Log Out
      </button>
    </div>
  );
};

export default NavBar;
