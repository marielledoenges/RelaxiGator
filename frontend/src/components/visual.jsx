import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// structures referenced from: https://www.chartjs.org/docs/latest/configuration/
const GoalVis = () => {

  const DATA = {
    labels: ["Calories (Goal: 6000)", "Productivity (Goal: 100)"],
    datasets: [
      {
        label: "Today's Progress",
        data: [
          Math.min(5770 / 6000, 1) * 100, 
          Math.min(30 / 100, 1) * 100, 
        ],
        backgroundColor: ["#FF6384", "#36A2EB"],
        borderColor: ["#FF6384", "#36A2EB"],
        borderWidth: 2,
      },
    ],
  };

  const OPTIONS = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.raw.toFixed(2)}% of the goal achieved`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
        },
      },
    },
  };

  return (
    // USE SIMILAR STYLING as rest of app with gradient, color needs to be updated
    <div className="flex items-center justify-center">
    <div className="p-6 rounded-xl shadow-lg bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 w-[500px]">
      <h2 className="text-2xl font-mono font-bold text-center text-gray-200">
        Yesterday's Goals Progress
      </h2>
      <div className="mt-4 mx-auto w-[400px] h-[300px]">
        <Bar data={DATA} options={OPTIONS} />
      </div>
    </div>
  </div>
  );
};

export default GoalVis;
