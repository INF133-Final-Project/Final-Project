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
import { FaEdit } from "react-icons/fa";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Budget = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditBudgetPopupOpen, setIsEditBudgetPopupOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionName, setTransactionName] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionCategory, setTransactionCategory] = useState("");
  const [weeklyBudget, setWeeklyBudget] = useState(0);
  const [newWeeklyBudget, setNewWeeklyBudget] = useState(weeklyBudget); // To store the new value
  const [budgetInput, setBudgetInput] = useState("");
  const [chartType, setChartType] = useState("pie"); // 'pie' or 'bar'

   // Toggle modal for adding transaction
   const toggleAddTransactionPopup = () => setIsPopupOpen(!isPopupOpen);

   // Toggle modal for editing weekly budget
   const toggleEditBudgetPopup = () => setIsEditBudgetPopupOpen(!isEditBudgetPopupOpen);
 
   // Handle updating the weekly budget
   const handleUpdateBudget = () => {
     if (!isNaN(parseFloat(newWeeklyBudget)) && parseFloat(newWeeklyBudget) >= 0) {
       setWeeklyBudget(parseFloat(newWeeklyBudget)); // Update the budget
       setIsEditBudgetPopupOpen(false); // Close the modal
     } else {
       alert("Please enter a valid budget amount.");
     }
   };
 

  // Handle adding a new transaction
  const handleAddTransaction = () => {
    if (transactionName && transactionAmount && transactionCategory) {
      const newTransaction = {
        name: transactionName,
        amount: parseFloat(transactionAmount),
        category: transactionCategory,
        date: new Date(),
      };
      setTransactions([newTransaction, ...transactions]); // Add new transaction to the top of the list
      // Reset form fields
      setTransactionName("");
      setTransactionAmount("");
      setTransactionCategory("");
      toggleAddTransactionPopup();
    } else {
      alert("Please fill out all fields before adding a transaction.");
    }
  };

  // Update the weekly budget
  const updateWeeklyBudget = () => {
    if (!isNaN(parseFloat(budgetInput)) && parseFloat(budgetInput) >= 0) {
      setWeeklyBudget(parseFloat(budgetInput));
      setBudgetInput("");
    } else {
      alert("Please enter a valid budget amount.");
    }
  };

  // Calculate total expenses
  const totalExpenses = transactions.reduce((total, transaction) => total + transaction.amount, 0);

  // Calculate remaining budget
  const remainingBudget = weeklyBudget - totalExpenses;

  // Prepare chart data
  const transactionCategories = [...new Set(transactions.map((t) => t.category))];
  const chartData = {
    labels: transactionCategories,
    datasets: [
      {
        label: "Spending by Category",
        data: transactionCategories.map((category) =>
          transactions
            .filter((t) => t.category === category)
            .reduce((sum, t) => sum + t.amount, 0)
        ),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
      },
    ],
  };

  return (
    <div>
      <div
        className="flex flex-col items-center justify-center rounded-lg bg-gray-400 mx-3 mt-5 text-white px-4"
        style={{ height: "calc(100vh - 4.5rem)" }}
      >
        {/* Weekly Budget Section */}
        <div className="w-1/2 mb-6 text-center">
          <div className="mb-4 space-y-2">
            <div className="flex justify-between space-x-10">
              {/* Current Budget */}
               {/* Weekly Budget Section with Edit Icon */}
          <div className="flex justify-between items-center">
            <div className="w-1/2 text-left">
              <p className="text-md font-medium text-gray-700 whitespace-nowrap">WEEKLY BUDGET</p>
              <p className="font-bold text-4xl text-white">
                ${weeklyBudget.toFixed(2)}
              </p>
            </div>
            <button
              onClick={toggleEditBudgetPopup}
              className="relative text-blue-700 text-xl bg-transparent border-0"
              style={{ top: "18px", right: "15px" }}
            >
              <FaEdit />
            </button>
          </div>

          {/* Modal for Editing Weekly Budget */}
          {isEditBudgetPopupOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
                <h2 className="text-2xl font-bold mb-4">Edit Weekly Budget</h2>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">New Weekly Budget ($)</label>
                  <input
                    type="number"
                    value={newWeeklyBudget}
                    onChange={(e) => setNewWeeklyBudget(e.target.value)}
                    className="w-full p-2 border rounded text-black"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={toggleEditBudgetPopup}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateBudget}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          )}
              {/* Total Expenses */}
              <div className="w-1/2 text-left">
                <p className="text-md font-medium text-gray-700 whitespace-nowrap">TOTAL EXPENSES</p>
                <p className="font-bold text-4xl text-white">${totalExpenses.toFixed(2)}</p>
              </div>
            </div>
             {/* Remaining Budget */}
            {/* <div>
              <p className="text-lg font-medium text-gray-700">REMAINING</p>
              <p
                className={`font-bold text-4xl ${
                  remainingBudget < 0 ? "text-red-500" : "text-green-500"
                }`}
              >
                ${remainingBudget.toFixed(2)}
              </p>
            </div> */}
          </div>
          {/* <div className="flex justify-center items-center">
            <input
              type="number"
              placeholder="Set Weekly Budget"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              className="p-2 border rounded mr-2 text-black"
            />
            <button
              onClick={updateWeeklyBudget}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Update
            </button>
          </div> */}
        </div>



        {/* Chart Section with Toggle */}
        <div className="w-1/2 mb-6">
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setChartType("pie")}
              className={`px-4 py-2 mr-2 rounded font-bold ${
                chartType === "pie" ? "bg-blue-700 text-white" : "bg-blue-500 text-gray-200"
              }`}
            >
              Pie Chart
            </button>
            <button
              onClick={() => setChartType("bar")}
              className={`px-4 py-2 rounded font-bold ${
                chartType === "bar" ? "bg-blue-700 text-white" : "bg-blue-500 text-gray-200"
              }`}
            >
              Bar Chart
            </button>
          </div>
          {chartType === "pie" ? <Pie data={chartData} /> : <Bar data={chartData} />}
        </div>

        {/* Transactions List */}
        <div className="w-1/2 mb-6">
          {/* Total Expenses */}
          {/* <div className="text-lg font-bold text-center mb-4">
            Total Expenses: ${totalExpenses.toFixed(2)}
          </div> */}
          <ul className="bg-white text-black p-4 rounded-lg">
            {transactions.length === 0 ? (
              <p className="text-center">No transactions yet.</p>
            ) : (
              transactions.map((transaction, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center py-2 border-b last:border-b-0"
                >
                  <div>
                    <p className="font-bold">{transaction.name}</p>
                    <p className="text-sm text-gray-600">
                      {transaction.date.toLocaleDateString()} 
                    </p>
                  </div>
                  <span>${transaction.amount.toFixed(2)}</span>
                  <span className="italic text-gray-600">{transaction.category}</span>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Add Transaction Button */}
        <button
          onClick={toggleAddTransactionPopup}
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
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Transaction Name</label>
              <input
                type="text"
                value={transactionName}
                onChange={(e) => setTransactionName(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Amount ($)</label>
              <input
                type="number"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Category</label>
              <input
                type="text"
                value={transactionCategory}
                onChange={(e) => setTransactionCategory(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={toggleAddTransactionPopup}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTransaction}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget;
