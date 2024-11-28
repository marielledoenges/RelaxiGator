import React, { useState, useEffect } from "react";
import { auth } from "../firebase/firebase";

const GOAL_CATEGORIES = [
  { label: "Work", color: "bg-purple-500 text-white" },
  { label: "Nutrition", color: "bg-pink-500 text-white" },
];

const GoalsPage = () => {
  const [goalText, setGoalText] = useState("");
  const [goalDate, setGoalDate] = useState("");
  const [category, setCategory] = useState("");
  const [goalValue, setGoalValue] = useState("");
  const [goals, setGoals] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/getGoals`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        setGoals(Object.values(data.goals || {}));
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    };
    fetchGoals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!goalText || !goalDate || !category) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    const goalData = {
      goalText,
      goalDate,
      category,
      goalValue: category !== "Regular" ? goalValue : null,
    };

    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/addGoal`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(goalData),
        }
      );

      if (response.ok) {
        setGoals((prevGoals) => [...prevGoals, goalData]);
        setGoalText("");
        setGoalDate("");
        setCategory("");
        setGoalValue("");
        setErrorMessage("");
      } else {
        const errorResponse = await response.json();
        setErrorMessage(errorResponse.error || "Failed to add goal.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while adding the goal.");
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen font-mono px-8 py-12">
      {/* Input Form */}
      <div className="p-6 rounded-xl shadow-lg w-full max-w-md bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 mr-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-mono font-bold text-center text-gray-200">
            Add a Goal
          </h2>
          {errorMessage && (
            <div className="text-red-500 text-center text-sm">{errorMessage}</div>
          )}
          <input
            type="text"
            value={goalText}
            onChange={(e) => setGoalText(e.target.value)}
            placeholder="Enter your goal"
            className="w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-900 text-gray-200 text-sm"
            required
          />
          <input
            type="date"
            value={goalDate}
            onChange={(e) => setGoalDate(e.target.value)}
            className="w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-900 text-gray-200 text-sm"
            required
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-900 text-gray-200 text-sm"
            required
          >
            <option value="">Select a Category</option>
            {GOAL_CATEGORIES.map((cat) => (
              <option key={cat.label} value={cat.label}>
                {cat.label}
              </option>
            ))}
          </select>
          {category && (
            <input
              type="number"
              value={goalValue}
              onChange={(e) => setGoalValue(e.target.value)}
              placeholder={`Enter ${category === "Nutrition" ? "calories" : "hours"}`}
              className="w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-900 text-gray-200 text-sm"
            />
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-mono py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add Goal
          </button>
        </form>
      </div>

      {/* Goals List */}
      <div className="p-6 rounded-xl shadow-lg w-full max-w-lg bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900">
        <h2 className="text-2xl font-mono font-bold text-center text-gray-200">
          Your Goals
        </h2>
        <div className="mt-4 space-y-4">
          {goals.length > 0 ? (
            goals.map((goal) => (
              <div
                key={goal.goalId}
                className={`p-4 rounded-lg shadow-md ${GOAL_CATEGORIES.find(
                  (cat) => cat.label === goal.category
                )?.color}`}
              >
                <p>
                  <strong>{goal.goalText}</strong>
                  {goal.goalValue && ` - ${goal.goalValue}`}
                </p>
                <p className="text-sm text-gray-200">Due: {goal.goalDate}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center">No goals added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;
