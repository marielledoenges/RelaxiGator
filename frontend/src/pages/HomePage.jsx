import React from "react";
import Userlogform from "../components/Userlogform";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="p-8">
          
          <Userlogform />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
