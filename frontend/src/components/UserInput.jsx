import React, { useState } from 'react';
import { auth } from '../firebase/firebase'; // Ensure this is correctly pointing to your Firebase configuration

const UserInputForm = () => {
  const [mentalState, setMentalState] = useState('');
  const [productivity, setProductivity] = useState('');
  const [nutrition, setNutrition] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = {
      mentalState,
      productivity,
      nutrition,
    };
  
    console.log("Data being sent to backend:", data);
  
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/saveUserData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data), // Ensure data is being stringified
      });
  
      if (response.ok) {
        console.log("Data submitted successfully");
        setIsSubmitted(true);
        setTimeout(() => setIsVisible(false), 4000);
      } else {
        const errorResponse = await response.json();
        console.error("Backend error response:", errorResponse);
        setErrorMessage(errorResponse.error || "Failed to submit data.");
      }
    } catch (error) {
      console.error("Error submitting data:", error.message);
      setErrorMessage("An error occurred while submitting the data.");
    }
  };
  
  

  if (!isVisible) return null;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Daily User Log</h2>

          {errorMessage && (
            <div className="mb-4 text-red-500 text-center">{errorMessage}</div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Mental State:</label>
            <input
              type="text"
              value={mentalState}
              onChange={(e) => setMentalState(e.target.value)}
              placeholder="Enter your mental state"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Productivity (hours):</label>
            <input
              type="number"
              value={productivity}
              onChange={(e) => setProductivity(e.target.value)}
              placeholder="Enter productivity in hours"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Nutrition (calories):</label>
            <input
              type="number"
              value={nutrition}
              onChange={(e) => setNutrition(e.target.value)}
              placeholder="Enter nutrition in calories"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Submit
          </button>
        </form>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Data submitted successfully!</h2>
          <p className="text-gray-700">Thank you for submitting your daily log.</p>
        </div>
      )}
    </div>
  );
};

export default UserInputForm;
