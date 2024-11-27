import React from "react";
import Calendar from "../components/Calendar";
import UserInputForm from "../components/UserInput"; // Assuming this is the Journal component
import {Link} from 'react-router-dom';
import GoalsPage from "../components/Goals";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="p-8">
          {/* <Link to="/nutrition">
            <button>Search Foods</button>
          </Link> */}
          {/* Calendar and Journal Components */}
          <UserInputForm /> 
          {/* <Calendar /> */}
          
        </div>
      </div>
    </div>
  );
};

export default HomePage;
