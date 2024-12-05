import React from "react";
import UserInputForm from "../components/UserInput"; // Assuming this is the Journal component
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="p-8">
          {/* Journal/Input Form Component */}
          <UserInputForm />

          {/* Add GoalTracker Component */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-white mb-4">Goal Progress</h2>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
