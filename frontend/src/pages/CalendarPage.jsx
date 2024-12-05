import React from "react";
import Calendar from "../components/Calendar";

const CalendarPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 animate-gradient-xy">
          <div className="container mx-auto px-4 py-8">
            <div className="p-8">
              <Calendar />
            </div>
          </div>
        </div>
      );
};

export default CalendarPage;