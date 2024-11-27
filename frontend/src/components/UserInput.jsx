import React, { useState } from 'react';
import { auth } from '../firebase/firebase'
const MOODS = [
  { emoji: '😄', label: 'Happy' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😔', label: 'Depressed' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '😠', label: 'Angry' }
];

const UserInputForm = () => {
  const [selectedMood, setSelectedMood] = useState('');
  const [productivity, setProductivity] = useState('');
  const [foodItems, setFoodItems] = useState('');
  const [journalEntry, setJournalEntry] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const currentDate = new Date();
    const data = {
      mentalState: selectedMood,
      productivity,
      food_items: foodItems,
      submitted: true,
      submission_date: `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`,
    };
  
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/saveUserData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => setIsVisible(false), 4000);
      } else {
        const errorResponse = await response.json();
        setErrorMessage(errorResponse.error || "Failed to submit data.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while submitting the data.");
    }
  };
  
  if (!isVisible) return null;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6">
          <h2 className="text-3xl font-bold text-center text-gray-800">Daily Wellness Log</h2>

          {errorMessage && (
            <div className="text-red-500 text-center">{errorMessage}</div>
          )}

          <div>
            <label className="block text-gray-700 font-semibold mb-4">How are you feeling today?</label>
            <div className="flex justify-between">
              {MOODS.map((mood) => (
                <button
                  key={mood.label}
                  type="button"
                  onClick={() => setSelectedMood(mood.label)}
                  className={`text-4xl p-2 rounded-full transition-all duration-200 ${
                    selectedMood === mood.label 
                      ? 'bg-blue-500 text-white scale-110' 
                      : 'hover:bg-blue-100'
                  }`}
                >
                  {mood.emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Productivity (hours):</label>
            <input
              type="number"
              value={productivity}
              onChange={(e) => setProductivity(e.target.value)}
              placeholder="Enter productive hours"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Food Items:</label>
            <input
              type="text"
              value={foodItems}
              onChange={(e) => setFoodItems(e.target.value)}
              placeholder="Enter food items (comma-separated)"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Journal Entry (Optional):</label>
            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="Write about your day..."
              className="w-full px-4 py-2 border rounded-lg h-24 resize-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Submit Daily Log
          </button>
        </form>
      ) : (
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
          <h2 className="text-3xl font-bold text-green-600 mb-4">Log Submitted!</h2>
          <p className="text-gray-700">Thank you for tracking your wellness.</p>
        </div>
      )}
    </div>
  );
};

export default UserInputForm;