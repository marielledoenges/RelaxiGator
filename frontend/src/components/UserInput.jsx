import React, { useState, useEffect } from "react";
import { auth } from "../firebase/firebase";

const MOODS = [
  { emoji: "😄", label: "Happy" },
  { emoji: "😢", label: "Sad" },
  { emoji: "😔", label: "Depressed" },
  { emoji: "😌", label: "Calm" },
  { emoji: "😠", label: "Angry" },
];

const UserInputForm = () => {
  const [selectedMood, setSelectedMood] = useState("");
  const [productivity, setProductivity] = useState("");
  const [journalEntry, setJournalEntry] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errormsg, errorhook] = useState("");
  const [existingLog, setExistingLog] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const checkDailyLog = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/checkDailyLog`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const { logExists, data } = await response.json();
          if (logExists) {
            setExistingLog(data);
            setSelectedMood(data.Mood || "");
            setProductivity(data.Productivity || "");
            setJournalEntry(data.JournalEntry || "");
          }
        } else {
          errorhook("Failed to check daily log.");
        }
      } catch (error) {
        errorhook("An error occurred while checking the daily log.");
      }
    };

    checkDailyLog();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!selectedMood || !productivity) {
      errorhook("Mood and productivity needed");
      return;
    }
  
    const currentDate = new Date();
    const data = {
      Mood: selectedMood,
      Productivity: productivity,
      JournalEntry: journalEntry || "",
      FoodItems: existingLog?.FoodItems || [], 
      Submitted: true,
      SubmissionDate: `${
        currentDate.getMonth() + 1
      }/${currentDate.getDate()}/${currentDate.getFullYear()}`,
    };
  
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/dbdatasave`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
  
      if (response.ok) {
        setExistingLog(data); 
        setIsSubmitted(true);
        setIsEditing(false);
        const evaluateResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/goalevaluator`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (evaluateResponse.ok) {
          const { updatedGoals } = await evaluateResponse.json();
      
        } else {
      
        }
        setTimeout(() => {
          setIsSubmitted(false);

          
          
        }, 2000);
      } else {
        const errorResponse = await response.json();
        errorhook(errorResponse.error || "Failed to submit data.");
      }
    } catch (error) {
      errorhook("An error occurred while submitting the data.");
    }
  };
   

  const handleEdit = () => {
    setSelectedMood(existingLog?.Mood || "");
    setProductivity(existingLog?.Productivity || "");
    setJournalEntry(existingLog?.JournalEntry || "");
    setIsEditing(true);
    setIsSubmitted(false);
  };
  

  if (!isEditing && existingLog && !isSubmitted) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="p-6 rounded-xl shadow-lg w-full max-w-sm text-center bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 mt-[-2rem]">
          <h2 className="text-2xl font-mono font-bold text-gray-200 mb-4">
            Today's Wellness Log
          </h2>

          <div className="font-mono text-left text-slate-400 space-y-2">
            <p>
              <span className="font-semibold text-gray-200">Mood:</span>{" "}
              {existingLog.Mood || "N/A"}
            </p>
            <p>
              <span className="font-semibold text-gray-200">
                Productivity:
              </span>{" "}
              {existingLog.Productivity || "N/A"} hours
            </p>
            <p>
              <span className="font-semibold text-gray-200">
                Journal Entry:
              </span>{" "}
              {existingLog.JournalEntry || "N/A"}
            </p>
          </div>

          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white font-mono rounded-full shadow-md hover:bg-blue-700 transition"
            onClick={handleEdit}
          >
            Edit Log
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      {!isSubmitted ? (
        <div className="p-6 rounded-xl shadow-lg w-full max-w-sm bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 mt-[-2rem]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-mono font-bold text-center text-gray-200">
              {isEditing ? "Edit Your Wellness Log" : "Daily Wellness Log"}
            </h2>

            {errormsg && (
              <div className="text-red-500 text-center text-sm">
                {errormsg}
              </div>
            )}

            <div>
              <label className="block text-gray-400 font-mono font-semibold mb-2">
                How are you feeling today?
              </label>
              <div className="flex justify-between">
                {MOODS.map((mood) => (
                  <button
                    key={mood.label}
                    type="button"
                    onClick={() => setSelectedMood(mood.label)}
                    className={`text-3xl p-1 rounded-full transition-all duration-200 ${
                      selectedMood === mood.label
                        ? "bg-blue-500 text-white scale-110"
                        : "hover:bg-gray-600"
                    }`}
                  >
                    {mood.emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-400 font-mono font-semibold mb-2">
                Productivity (hours):
              </label>
              <input
                type="number"
                value={productivity}
                onChange={(e) => setProductivity(e.target.value)}
                placeholder="Enter productive hours"
                className="w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-900 text-gray-200 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 font-mono font-semibold mb-2">
                Journal Entry (Optional):
              </label>
              <textarea
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                placeholder="Write about your day..."
                className="w-full px-3 py-1 border rounded-lg h-20 resize-none focus:ring-2 focus:ring-blue-500 bg-gray-900 text-gray-200 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-mono py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {isEditing ? "Save Changes" : "Submit Daily Log"}
            </button>
          </form>
        </div>
      ) : (
        <div className="p-6 rounded-xl shadow-lg w-full max-w-sm text-center bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900">
          <h2 className="text-2xl font-mono font-bold text-pink-600 mb-3">
            Log Submitted!
          </h2>
          <p className="text-gray-300">Congratulations on tracking your wellness.</p>
        </div>
      )}
    </div>
  );
};

export default UserInputForm;
