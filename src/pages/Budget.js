import React, { useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Budget = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Sample empty data for Pie and Bar charts
  const chartData = {
    labels: [],
    datasets: [
      {
        label: "Empty Data",
        data: [],
        backgroundColor: [],
      },
    ],
  };

  // Toggle popup visibility
  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  return (
    <div>
      <div
        className="flex flex-col items-center justify-center rounded-lg bg-gray-400 mx-3 mt-5 text-white px-4"
        style={{ height: "calc(100vh - 4.5rem)" }}
      >
        <p className="text-4xl font-black mt-8 mb-5">Budget</p>

        {/* Pie Chart */}
        <div className="w-1/2 mb-6">
          <h2 className="text-2xl font-bold text-center mb-4">Spending Patterns</h2>
          <Pie data={chartData} />
        </div>

        {/* Bar Chart */}
        <div className="w-1/2 mb-6">
          <h2 className="text-2xl font-bold text-center mb-4">Weekly Expenses</h2>
          <Bar data={chartData} />
        </div>

        {/* Button to trigger popup */}
        <button
          onClick={togglePopup}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Transaction
        </button>
      </div>

      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
            <h2 className="text-2xl font-bold mb-4">Add a New Transaction</h2>
            <p className="mb-4">This is a placeholder for the popup content.</p>
            <button
              onClick={togglePopup}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget;
