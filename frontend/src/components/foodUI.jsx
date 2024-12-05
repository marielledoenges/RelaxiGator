import React, { useState, useEffect } from "react";
import { auth } from "../firebase/firebase";

const FoodUI = () => {
  const [foodLogs, setFoodLogs] = useState([]);
  const [loading, setLoading] = useState(true); // To handle loading state
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchFoodLog = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/dbfoodinfo`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result.logExists) {
            setFoodLogs(result.data);
          } else {
            setFoodLogs([]);
          }
        } else {
          setErrorMessage("Failed to fetch food logs. Please try again later.");
        }
      } catch (error) {
        console.error("Error fetching daily food log:", error);
        setErrorMessage("An error occurred while fetching the food log.");
      } finally {
        setLoading(false); // Ensure loading is disabled after fetch
      }
    };

    fetchFoodLog();
  }, []);

  return (
    <div className="p-6 rounded-xl shadow-lg w-full max-w-lg bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 mx-auto mt-8">
      <h2 className="text-2xl font-mono font-bold text-center text-gray-200 mb-4">
        Daily Food Log
      </h2>
      {loading ? (
        <div className="text-center text-gray-300">Loading...</div>
      ) : errorMessage ? (
        <div className="text-red-500 text-center text-sm">{errorMessage}</div>
      ) : foodLogs.length > 0 ? (
        <div className="space-y-4">
          {foodLogs.map((log, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-gray-700 shadow-md flex justify-between items-center"
            >
              <div>
                <p className="text-white font-mono text-lg">{log.Food}</p>
                <p className="text-sm text-gray-300">
                  Calories: {log.Calories}
                </p>
                {log.Protein && (
                  <p className="text-sm text-gray-300">
                    Protein: {log.Protein}g
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center">No food logs found for today.</p>
      )}
    </div>
  );
};

export default FoodUI;
