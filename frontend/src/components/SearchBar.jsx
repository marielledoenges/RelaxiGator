import React, { useState, useEffect } from "react";
import { auth } from "../firebase/firebase";

const SearchBar = ({ setSelectedFood }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const apiKey = process.env.REACT_APP_SPOONACULAR_API_KEY;

  const fetchResults = async (searchQuery) => {
    if (!searchQuery) return;
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(
        `https://api.spoonacular.com/food/ingredients/autocomplete?query=${searchQuery}&number=5&apiKey=${apiKey}`
      );
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError("Failed to fetch search results.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFoodDetails = async (food) => {
    setIsLoading(true);
    setError("");
    try {
      const searchResponse = await fetch(
        `https://api.spoonacular.com/food/ingredients/search?query=${food.name}&apiKey=${apiKey}`
      );
      const searchData = await searchResponse.json();
      const foodId = searchData.results[0]?.id;

      if (!foodId) {
        throw new Error("Food ID not found.");
      }

      const nutritionResponse = await fetch(
        `https://api.spoonacular.com/recipes/${foodId}/nutritionWidget.json?apiKey=${apiKey}`
      );
      const nutritionData = await nutritionResponse.json();

      const cleanUnits = (value) =>
        value?.replace(/[^\d]/g, "") || "N/A"; // Clean units and fallback to "N/A"

      const foodDetails = {
        name: food.name,
        calories: cleanUnits(nutritionData.calories),
        carbs: cleanUnits(nutritionData.carbs),
        fat: cleanUnits(nutritionData.fat),
        protein: cleanUnits(nutritionData.protein),
        addToDailyLog: async () => {
          try {
            const token = await auth.currentUser.getIdToken();
            const currentDate = new Date();
            const submissionDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;

            const response = await fetch(
              `${process.env.REACT_APP_BACKEND_URL}/addFoodToDailyLog`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  foodItem: {
                    Food: foodDetails.name,
                    Calories: foodDetails.calories,
                    Protein: foodDetails.protein,
                  },
                  submission_date: submissionDate,
                }),
              }
            );

            if (!response.ok) {
              throw new Error("Failed to add food to daily log.");
            }
            alert(`${foodDetails.name} added to your daily log!`);
          } catch (err) {
            alert("Error adding food to daily log.");
          }
        },
      };

      setSelectedFood(foodDetails);
    } catch (err) {
      setError("Failed to fetch food details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      fetchResults(query);
    }, 300);
    return () => clearTimeout(debounceFetch);
  }, [query]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for food..."
        className="w-full px-3 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {isLoading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-2">
        {results.map((item) => (
          <li
            key={item.id}
            onClick={() => fetchFoodDetails(item)}
            className="cursor-pointer p-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition"
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
