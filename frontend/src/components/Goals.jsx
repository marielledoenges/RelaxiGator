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
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getGoals`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/addGoal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(goalData),
      });

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
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-purple-100 to-pink-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg space-y-6"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center">Add a Goal</h2>
        {errorMessage && <div className="text-red-500 text-center">{errorMessage}</div>}
        <input
          type="text"
          value={goalText}
          onChange={(e) => setGoalText(e.target.value)}
          placeholder="Enter your goal"
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
        <input
          type="date"
          value={goalDate}
          onChange={(e) => setGoalDate(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        >
          <option value="">Select a Category</option>
          {GOAL_CATEGORIES.map((cat) => (
            <option key={cat.label} value={cat.label}>
              {cat.label}
            </option>
          ))}
        </select>
        {category !== "Regular" && (
          <input
            type="number"
            value={goalValue}
            onChange={(e) => setGoalValue(e.target.value)}
            placeholder={`Enter ${category === "Nutrition" ? "calories" : "hours"}`}
            className="w-full px-4 py-2 border rounded-lg"
          />
        )}
        <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700">
          Add Goal
        </button>
      </form>

      <div className="w-full max-w-lg mt-8 space-y-4">
        {goals.map((goal) => (
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
        ))}
      </div>
    </div>
  );
};

export default GoalsPage;
