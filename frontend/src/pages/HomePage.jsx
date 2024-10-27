import React from "react";
import Calendar from "../components/Calendar";
import UserInputForm from "../components/UserInput"; // Assuming this is the Journal component
import {Link} from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 animate-gradient-xy"
      style={{ backgroundSize: '400% 400%' }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="backdrop-blur-sm bg-white/10 rounded-lg shadow-xl p-8">
          
          <h1 className="text-4xl font-bold text-white text-center mb-8 tracking-wide">
            RELAXIGATOR
          </h1>
          <Link to="/nutrition">
            <button>Search Foods</button>
          </Link>
          {/* Calendar and Journal Components */}
          <UserInputForm /> 
          <Calendar />
          
        </div>
      </div>
    </div>
  );
};

export default HomePage;
