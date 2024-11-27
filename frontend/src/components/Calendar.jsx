import React, { useState, useEffect } from "react";
import Calendar from "react-calendar"; // install react-calendar
import "react-calendar/dist/Calendar.css"; // import calendar styles
import { auth } from "../firebase/firebase"; // firebase authentication

const CalendarComponent = () => {
  const [userLogs, setUserLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [logData, setLogData] = useState(null);

  useEffect(() => {
    // Fetch user logs from the backend when the component mounts
    const fetchLogs = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/getUserLogsForYear?year=2024`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setUserLogs(data);
        } else {
          console.error("Failed to fetch user logs.");
        }
      } catch (error) {
        console.error("Error fetching user logs:", error);
      }
    };

    fetchLogs();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

    // Find log data for the selected date
    const log = userLogs.find((log) => log.date === formattedDate);
    if (log) {
      setLogData(log.log);
    } else {
      setLogData(null); // No log data for the selected day
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-pink-300 to-purple-400">
      <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Wellness Log Calendar
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Calendar Section */}
          <div className="flex justify-center">
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              tileClassName={({ date, view }) => {
                // Add a custom class if there's a log for that date
                const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
                if (userLogs.some((log) => log.date === formattedDate)) {
                  return "highlight-day"; // Highlight days with logs
                }
                return "";
              }}
            />
          </div>

          {/* Log Data Section */}
          <div className="flex flex-col justify-center">
            <h3 className="text-3xl font-semibold text-gray-700">Selected Day</h3>
            <p className="text-lg text-gray-600 mb-6">{selectedDate.toDateString()}</p>

            {logData ? (
              <div className="p-6 bg-purple-100 rounded-lg">
                <h4 className="font-semibold text-purple-700 text-xl mb-4">Log Data</h4>
                <p>
                  <strong>Mood:</strong> {logData.Mood}
                </p>
                <p>
                  <strong>Productivity:</strong> {logData.Productivity} hours
                </p>
                <p>
                  <strong>Food Items:</strong> {logData.FoodItems.join(", ")}
                </p>
                <p>
                  <strong>Journal Entry:</strong> {logData.JournalEntry || "N/A"}
                </p>
              </div>
            ) : (
              <div className="p-6 bg-gray-200 rounded-lg">
                <p className="text-gray-500">No log data for this day. Empty.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarComponent;
