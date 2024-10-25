import React, { useState } from 'react';

// Shared context for goals and reminders
export const GoalsContext = React.createContext(null);

// Calendar Component
const Calendar = ({ onAddReminder }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [noteInput, setNoteInput] = useState('');
  const [notes, setNotes] = useState({});
  const { goals, reminders } = React.useContext(GoalsContext);

  // Get days in month
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Get first day of month
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Generate calendar days
  const generateDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-4"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`;
      const hasNote = notes[dateKey];
      const hasReminders = reminders[dateKey]?.length > 0;
      
      days.push(
        <div
          key={day}
          onClick={() => handleDayClick(day)}
          className={`p-4 border cursor-pointer hover:bg-gray-100 relative 
            ${hasNote ? 'bg-blue-50' : ''} 
            ${hasReminders ? 'border-purple-500 border-2' : ''}`}
        >
          <span className="font-medium">{day}</span>
          {hasReminders && (
            <div className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full"></div>
          )}
          {hasNote && (
            <div className="mt-1 text-xs text-gray-600 overflow-hidden text-ellipsis">
              {notes[dateKey]}
            </div>
          )}
          {hasReminders && (
            <div className="mt-1 text-xs text-purple-600">
              {reminders[dateKey].length} reminder(s)
            </div>
          )}
        </div>
      );
    }
    return days;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <button
          className="px-4 py-2 border rounded hover:bg-gray-100"
          onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
        >
          ←
        </button>
        <h2 className="text-xl font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button
          className="px-4 py-2 border rounded hover:bg-gray-100"
          onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-4 text-center font-semibold text-gray-600">
            {day}
          </div>
        ))}
        {generateDays()}
      </div>
    </div>
  );
};

// Goals Component
const GoalsBoard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    reminderDates: []
  });
  
  const { goals, setGoals, reminders, setReminders } = React.useContext(GoalsContext);

  const addGoal = () => {
    if (newGoal.title && newGoal.dueDate) {
      const goalId = Date.now();
      setGoals([...goals, { ...newGoal, id: goalId }]);
      
      // Add reminders to the calendar
      newGoal.reminderDates.forEach(date => {
        const dateKey = date.split('T')[0];
        setReminders(prev => ({
          ...prev,
          [dateKey]: [...(prev[dateKey] || []), {
            goalId,
            title: newGoal.title,
            type: 'reminder'
          }]
        }));
      });

      setNewGoal({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        reminderDates: []
      });
      setIsModalOpen(false);
    }
  };

  const addReminder = (date) => {
    setNewGoal(prev => ({
      ...prev,
      reminderDates: [...prev.reminderDates, date]
    }));
    setShowCalendar(false);
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(goal => goal.id !== id));
    // Clean up associated reminders
    const newReminders = { ...reminders };
    Object.keys(newReminders).forEach(date => {
      newReminders[date] = newReminders[date].filter(r => r.goalId !== id);
      if (newReminders[date].length === 0) delete newReminders[date];
    });
    setReminders(newReminders);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-gradient-to-br from-rose-400 to-red-500';
      case 'medium': return 'bg-gradient-to-br from-amber-300 to-orange-500';
      case 'low': return 'bg-gradient-to-br from-green-300 to-emerald-500';
      default: return 'bg-gradient-to-br from-blue-300 to-blue-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">My Goals</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg 
                     hover:from-purple-600 hover:to-indigo-700 transform hover:scale-105 transition-all"
          >
            + Add New Goal
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map(goal => (
            <div
              key={goal.id}
              className={`rounded-lg p-6 text-white shadow-xl ${getPriorityColor(goal.priority)}`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{goal.title}</h3>
                <button onClick={() => deleteGoal(goal.id)}>×</button>
              </div>
              <p className="text-white/90 mb-4">{goal.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm bg-black/20 px-3 py-1 rounded-full">
                  Due: {new Date(goal.dueDate).toLocaleDateString()}
                </span>
                {goal.reminderDates.length > 0 && (
                  <span className="text-sm bg-black/20 px-3 py-1 rounded-full">
                    {goal.reminderDates.length} reminder(s)
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Goal Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add New Goal</h2>
                <button onClick={() => setIsModalOpen(false)}>×</button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newGoal.dueDate}
                    onChange={(e) => setNewGoal({...newGoal, dueDate: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newGoal.priority}
                    onChange={(e) => setNewGoal({...newGoal, priority: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reminders</label>
                  <button
                    onClick={() => setShowCalendar(true)}
                    className="w-full p-2 border rounded-lg text-left text-gray-600 hover:bg-gray-50"
                  >
                    Add Reminder Dates ({newGoal.reminderDates.length} set)
                  </button>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addGoal}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 
                             text-white rounded-lg hover:from-purple-600 hover:to-indigo-700"
                  >
                    Add Goal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calendar Modal for Setting Reminders */}
        {showCalendar && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Set Reminder Date</h2>
                <button onClick={() => setShowCalendar(false)}>×</button>
              </div>
              <Calendar onAddReminder={addReminder} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main App Component with Context Provider
const GoalsApp = () => {
  const [goals, setGoals] = useState([]);
  const [reminders, setReminders] = useState({});

  return (
    <GoalsContext.Provider value={{ goals, setGoals, reminders, setReminders }}>
      <GoalsBoard />
    </GoalsContext.Provider>
  );
};

export default GoalsApp;