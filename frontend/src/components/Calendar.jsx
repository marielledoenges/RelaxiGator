import React, { useState } from 'react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [noteInput, setNoteInput] = useState('');
  const [notes, setNotes] = useState({});

  // Get days in month
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Generate calendar days
  const generateDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-4"></div>);
    }

    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`;
      const hasNote = notes[dateKey];
      
      days.push(
        <div
          key={day}
          onClick={() => handleDayClick(day)}
          className={`p-4 border cursor-pointer hover:bg-gray-100 relative ${
            hasNote ? 'bg-blue-50' : ''
          }`}
        >
          <span className="font-medium">{day}</span>
          {hasNote && (
            <div className="mt-1 text-xs text-gray-600 overflow-hidden text-ellipsis">
              {notes[dateKey]}
            </div>
          )}
        </div>
      );
    }
    return days;
  };

  // Handle day click
  const handleDayClick = (day) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    setIsDialogOpen(true);
  };

  // Handle note submission
  const handleSubmitNote = () => {
    if (selectedDate && noteInput.trim()) {
      const dateKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
      setNotes(prev => ({
        ...prev,
        [dateKey]: noteInput
      }));
      setNoteInput('');
      setIsDialogOpen(false);
    }
  };

  // Navigate months
  const navigateMonth = (direction) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + direction, 1));
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            className="px-4 py-2 border rounded hover:bg-gray-100"
            onClick={() => navigateMonth(-1)}
          >
            ←
          </button>
          <h2 className="text-xl font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            className="px-4 py-2 border rounded hover:bg-gray-100"
            onClick={() => navigateMonth(1)}
          >
            →
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Week days */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-4 text-center font-semibold text-gray-600">
              {day}
            </div>
          ))}
          {/* Calendar days */}
          {generateDays()}
        </div>

        {/* Modal Dialog */}
        {isDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">
                Add Note for {selectedDate?.toLocaleDateString()}
              </h3>
              <input
                type="text"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Enter your note..."
                className="w-full p-2 border rounded mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={handleSubmitNote}
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;