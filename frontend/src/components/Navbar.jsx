import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = ({ onLogout }) => {
    return (
        <div
            className="fixed top-0 left-0 w-full h-12 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 font-mono text-white shadow-lg z-50
                flex items-center justify-center"
        >
            <div className="absolute left-4 text-2xl font-bold tracking-[.38em]">
                RELAXIGATOR
            </div>

            <div className="flex space-x-8">
                <Link to="/home" className="hover:bg-gray-700 px-4 py-2 rounded">
                    Home
                </Link>
                <Link to="/nutrition" className="hover:bg-gray-700 px-4 py-2 rounded">
                    Nutrition
                </Link>
                <Link to="/calendar" className="hover:bg-gray-700 px-4 py-2 rounded">
                    Calendar
                </Link>
                <Link to="/goals" className="hover:bg-gray-700 px-4 py-2 rounded">
                    Goals
                </Link>
                <button onClick={onLogout} className="hover:bg-gray-700 px-4 py-2 rounded">
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default NavBar;
