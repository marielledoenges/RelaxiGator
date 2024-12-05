import React from "react";
import Nutrition from "../components/Nutrition";

const NutritionPage = () => {
  return (
      <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 animate-gradient-xy"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="p-8">
            <Nutrition />
          </div>
        </div>
      </div>
    );
};

export default NutritionPage;