import React, { useState } from 'react';

const UserInputForm = () => {
  const [mentalState, setMentalState] = useState('');
  const [productivity, setProductivity] = useState('');
  const [nutrition, setNutrition] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false); // New state to track form submission

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      mentalState,
      productivity,
      nutrition,
    };

    try {
      const response = await fetch('http://localhost:5000/saveUserData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('Data successfully sent to the backend');
        setIsSubmitted(true); // Set the form as submitted
      } else {
        console.error('Error sending data');
      }
    } catch (error) {
      console.error('Error:', error);
    }

    // Optionally, reset form fields
    setMentalState('');
    setProductivity('');
    setNutrition('');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">User Input Form</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Mental State:</label>
            <input
              type="text"
              value={mentalState}
              onChange={(e) => setMentalState(e.target.value)}
              placeholder="Enter your mental state"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Daily RelaxiLog
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
