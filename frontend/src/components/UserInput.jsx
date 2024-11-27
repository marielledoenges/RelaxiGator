  import React, { useState, useEffect } from 'react';
  import { auth } from '../firebase/firebase';

  const MOODS = [
    { emoji: '😄', label: 'Happy' },
    { emoji: '😢', label: 'Sad' },
    { emoji: '😔', label: 'Depressed' },
    { emoji: '😌', label: 'Calm' },
    { emoji: '😠', label: 'Angry' },
  ];

  const UserInputForm = () => {
    const [selectedMood, setSelectedMood] = useState('');
    const [productivity, setProductivity] = useState('');
    const [foodItems, setFoodItems] = useState('');
    const [journalEntry, setJournalEntry] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [existingLog, setExistingLog] = useState(null); // Holds today's log if it exists

    useEffect(() => {
      const checkDailyLog = async () => {
        try {
          const token = await auth.currentUser.getIdToken();
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/checkDailyLog`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const { logExists, data } = await response.json();
            if (logExists) {
              setExistingLog(data); // If log exists, store it
            }
          } else {
            setErrorMessage("Failed to check daily log.");
          }
        } catch (error) {
          console.error("Error checking daily log:", error);
          setErrorMessage("An error occurred while checking the daily log.");
        }
      };

      checkDailyLog();
    }, []);

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
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          setIsSubmitted(true);
        } else {
          const errorResponse = await response.json();
          setErrorMessage(errorResponse.error || 'Failed to submit data.');
        }
      } catch (error) {
        setErrorMessage('An error occurred while submitting the data.');
      }
    };

    if (existingLog) {
      return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-500 to-pink-500">
          <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-lg text-center">
            <h2 className="text-4xl font-bold text-purple-700 mb-6">Today's Wellness Log</h2>
            
            <div className="flex flex-col items-start space-y-4">
              <p className="text-lg text-gray-800">
                <span className="font-semibold text-purple-600">Mood: </span>
                <span className="text-2xl">{existingLog.Mood}</span>
              </p>
              <p className="text-lg text-gray-800">
                <span className="font-semibold text-purple-600">Productivity: </span>
                {existingLog.Productivity} hours
              </p>
              <p className="text-lg text-gray-800">
                <span className="font-semibold text-purple-600">Food Items: </span>
                {existingLog.FoodItems.join(', ')}
              </p>
              <p className="text-lg text-gray-800">
                <span className="font-semibold text-purple-600">Journal Entry: </span>
                {existingLog.JournalEntry || 'N/A'}
              </p>
            </div>
    
            <button
              className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition duration-300"
              onClick={() => console.log('Edit Log button pressed!')}
            >
              Edit Log
            </button>
          </div>
        </div>
      );
    }
    

    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6">
            <h2 className="text-3xl font-bold text-center text-gray-800">Daily Wellness Log</h2>

            {errorMessage && <div className="text-red-500 text-center">{errorMessage}</div>}

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
            <h2 className="text-3xl font-bold text-pink-600 mb-4">Log Submitted!</h2>
            <p className="text-gray-700">Thank you for tracking your wellness.</p>
          </div>
        )}
      </div>
    );
  };

  export default UserInputForm;
