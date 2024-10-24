import "./App.css";
import { useState, useEffect } from 'react';
import UserInputForm from './components/UserInput';
import Calendar from "./components/Calendar";

function App() {

  return (<div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 animate-gradient-xy"
  style={{
    backgroundSize: '400% 400%',
  }}
>
  <div className="container mx-auto px-4 py-8">
    <div className="backdrop-blur-sm bg-white/10 rounded-lg shadow-xl p-8">
      <h1 className="text-4xl font-bold text-white text-center mb-8 tracking-wide">
        RELAXIGATOR
      </h1>
      <UserInputForm />
      <Calendar />
    </div>
  </div>
</div>
);
}

export default App;
