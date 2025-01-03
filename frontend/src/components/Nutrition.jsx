import React, { useState } from "react";
import SearchBar from "./SearchBar";
import { auth } from "../firebase/firebase";
import FoodUI from "./foodUI";
const Nutrition = () => {
  const [selectedFood, setSelectedFood] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errormsg, errorhook] = useState("");

  // response monitoring with bearer authentication referenced from:  https://dev.to/earthcomfy/build-authentication-using-firebase-react-express-28ig?comments_sort=oldest (line 24)
  const handleAddToDailyLog = async () => {
    if (!selectedFood) return;

    const { name: Food, calories: Calories, protein: Protein } = selectedFood;

    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/dbaddfood`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ Food, Calories, Protein }),
        }
      );

      if (response.ok) {
        setSuccessMessage(`${Food} added to your daily log!`);
        setTimeout(() => setSuccessMessage(""), 3000); 
      } else {
        const errorResponse = await response.json();
        errorhook(errorResponse.error || "Failed to add food to daily log.");
        setTimeout(() => errorhook(""), 3000); 
      }
    } catch (error) {
      console.error("Error adding food to daily log:", error);
      errorhook("An error occurred. Please try again.");
      setTimeout(() => errorhook(""), 3000); 
    }
  };

  return (
    <div> 
    <div className="flex justify-center items-center mt-40 px-8 py-12 space-x-12">
      
      <div className="w-1/3 font-mono bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold text-gray-200 mb-4 text-center">
          Search for Food
        </h2>
        <SearchBar setSelectedFood={setSelectedFood} />
      </div>

     
      {selectedFood && (
        <div className="w-1/3 font-mono bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold text-gray-200 mb-4 text-center">
            {selectedFood.name}
          </h2>
          <p className="text-gray-200">
            <strong>Calories:</strong>{" "}
            <span className="text-slate-400">{selectedFood.calories !== "N/A" ? `${selectedFood.calories}` : "N/A"}</span>
          </p>
          <p className="text-gray-200">
            <strong>Carbs:</strong>{" "}
            <span className="text-slate-400">{selectedFood.carbs !== "N/A" ? `${selectedFood.carbs}g` : "N/A"}</span>
          </p>
          <p className="text-gray-200">
            <strong>Fat:</strong>{" "}
            <span className="text-slate-400">{selectedFood.fat !== "N/A" ? `${selectedFood.fat}g` : "N/A"}</span>
          </p>
          <p className="text-gray-200">
            <strong>Protein:</strong>{" "}
            <span className="text-slate-400">{selectedFood.protein !== "N/A" ? `${selectedFood.protein}g` : "N/A"}</span>
          </p>
          <button
            onClick={handleAddToDailyLog}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Add to Daily Log
          </button>
          {successMessage && (
            <p className="mt-4 text-green-500 text-center">{successMessage}</p>
          )}
          {errormsg && (
            <p className="mt-4 text-red-500 text-center">{errormsg}</p>
          )}
        </div>
      )}
     
    </div>
    <div className="mt-32 ">
            <FoodUI />
          </div>
    </div>
  );
};

export default Nutrition;
