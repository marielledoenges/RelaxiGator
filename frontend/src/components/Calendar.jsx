import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { auth } from "../firebase/firebase";

// response monitoring with bearer authentication referenced from:  https://dev.to/earthcomfy/build-authentication-using-firebase-react-express-28ig?comments_sort=oldest
const CalendarComponent = () => {
  const [dblogs, setdblogs] = useState([]);
  const [inputdatevar, setinputdatevar] = useState(new Date());
  const [calendarloghook, setcalendarloghook] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/dbuserdata`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setdblogs(data);
        } else {
          console.error("Error logged, check firebase DB if entry exists");
        }
      } catch (error) {
        console.error("Error logged, check firebase DB if entry exists", error);
      }
    };

    fetchLogs();
  }, []);

  const datehook = (date) => {
    setinputdatevar(date);
    const monthKey = `${date.getFullYear()}${date.getMonth() + 1}Log`;
    const dayKey = `Day${date.getDate()}`;

    const log = dblogs[monthKey]?.[dayKey] || null;
    setcalendarloghook(log);
  };

  return (
    <div className="flex justify-center items-start min-h-screen font-mono px-8 py-12 mt-[-2rem]">
      {/* Calendar Section */}
      <div className="p-6 rounded-xl shadow-lg w-full max-w-md bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 mr-8">
        <h2 className="text-2xl font-mono font-bold text-center text-gray-200 mb-4">
          Wellness Log Calendar
        </h2>
        <div className="flex justify-center">
          <Calendar
            onChange={datehook}
            value={inputdatevar}
            tileClassName={({ date }) => {
              const dbdate = `${
                date.getMonth() + 1
              }/${date.getDate()}/${date.getFullYear()}`;
              const monthKey = `${date.getFullYear()}${date.getMonth() + 1}Log`;
              const dayKey = `Day${date.getDate()}`;
              return dblogs[monthKey]?.[dayKey]
                ? "highlight-day bg-blue-600 text-white rounded-md"
                : "";
            }}
            className="rounded-md text-gray-900 bg-gray-200 shadow-inner p-2"
          />
        </div>
      </div>

      {/* Log Data Section */}
      <div className="p-4 rounded-xl shadow-lg w-full max-w-sm bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900">
        <h2 className="text-xl font-mono font-bold text-center text-gray-200 mb-3">
          Selected Day
        </h2>
        <p className="text-xs text-slate-400 text-center mb-3">
          {inputdatevar.toDateString()}
        </p>

        {calendarloghook ? (
          <div className="p-3 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 rounded-lg shadow-md">
            <p className="text-slate-100 text-xs">
              <strong className="text-slate-200">Mood:</strong> {calendarloghook.Mood}
            </p>
            <p className="text-slate-100 text-xs">
              <strong className="text-slate-200">Productivity:</strong>{" "}
              {calendarloghook.Productivity}{" "}
              {calendarloghook.Productivity === 1 ? "hour" : "hours"}
            </p>
            <p className="text-slate-100 text-xs">
              <strong className="text-slate-200">Total Calories:</strong>{" "}
              {calendarloghook.totalDailyCals || 0} cals
            </p>
            <p className="text-slate-100 text-xs">
              <strong className="text-slate-200">Journal Entry:</strong>{" "}
              {calendarloghook.JournalEntry || "N/A"}
            </p>
          </div>
        ) : (
          <div className="p-3 bg-gray-700 rounded-lg shadow-md">
            <p className="text-slate-300 text-center text-xs">
              No log data for this day.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarComponent;
