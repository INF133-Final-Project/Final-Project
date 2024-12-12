import React, { useState, useEffect } from "react";
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
import { PlusIcon } from "@heroicons/react/24/outline";
import { collection, doc, addDoc, query, orderBy, onSnapshot, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import ErrorModal from "../components/ErrorModal";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Budget = () => {
  // State Variables
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditBudgetPopupOpen, setIsEditBudgetPopupOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionName, setTransactionName] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionCategory, setTransactionCategory] = useState("");
  const [weeklyBudget, setWeeklyBudget] = useState(0);
  const [newWeeklyBudget, setNewWeeklyBudget] = useState(weeklyBudget); // To store the new value
  const [chartType, setChartType] = useState("pie"); // 'pie' or 'bar'
  const [user] = useAuthState(auth);
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: "" });
  const [loading, setLoading] = useState(true);

   // Toggle Modal Functions
  const toggleAddTransactionPopup = () => setIsPopupOpen(!isPopupOpen);
  const toggleEditBudgetPopup = () => setIsEditBudgetPopupOpen(!isEditBudgetPopupOpen);

  // Error Modal Close Function
  const closeErrorModal = () => setErrorModal(false);
 
   // Handle updating the weekly budget
  const handleUpdateBudget = async () => {
  if (!isNaN(parseFloat(newWeeklyBudget)) && parseFloat(newWeeklyBudget) >= 0) {
    try {
      if (user) {
        // Reference to a document within the weeklyBudget collection
        const budgetDocRef = doc(db, "users", user.uid, "weeklyBudget", "currentBudget");
        await setDoc(budgetDocRef, { amount: parseFloat(newWeeklyBudget) }, { merge: true });
        console.log("Weekly budget updated successfully in Firestore.");
        setWeeklyBudget(parseFloat(newWeeklyBudget)); // Update the local state
        setIsEditBudgetPopupOpen(false); // Close the modal
      } else {
        setErrorModal({
          isOpen: true,
          message: "You must be signed in to update the budget.",
        });
      }
    } catch (error) {
      console.error("Error updating weekly budget:", error);
      setErrorModal({
        isOpen: true,
        message: "Failed to update the budget. Please try again.",
      });
    }
    } else {
      alert("Please enter a valid budget amount.");
    }
  };

  // Handle adding a new transaction
  const handleAddTransaction = async () => {
    try {
      if (!user) {
        setErrorModal({
          isOpen: true,
          message: "You must be signed in to add a transaction.",
        });
        return;
      }

      // Create transaction data object
      const transactionData = {
        name: transactionName,
        amount: parseFloat(transactionAmount),
        category: transactionCategory,
        date: new Date(),
      };

      // Validate transaction data
      if (!transactionData.amount || !transactionData.category || !transactionData.date) {
        console.error("Invalid transaction data:", transactionData);
        setErrorModal({
          isOpen: true,
          message: "All fields are required to add a transaction.",
        });
        return;
      }

      // Add transaction to Firestore
      await addDoc(collection(db, "users", user.uid, "transactions"), transactionData);
      console.log("Transaction added successfully:", transactionData);

      setIsPopupOpen(false);

    } catch (error) {
      console.error("Error adding transaction:", error);
      setErrorModal({
        isOpen: true,
        message: "Failed to add the transaction. Please try again.",
      });
    }
  };

  // Function to fetch transactions
  const fetchTransactions = () => {
    if (user) {
      const transactionsRef = collection(db, "users", user.uid, "transactions");
      const transactionsQuery = query(transactionsRef, orderBy("date", "desc"));
      const unsubscribe = onSnapshot(
        transactionsQuery,
        (snapshot) => {
          const updatedTransactions = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTransactions(updatedTransactions);
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching transactions: ", error);
          setLoading(false);
        }
      );

      // Cleanup subscription on component unmount
      return () => unsubscribe();
    }
  };
  
  // Function to fetch the weekly budget
  const fetchWeeklyBudget = async () => {
    try {
      if (user) {
        // Reference to a document within the weeklyBudget collection
        const budgetDocRef = doc(db, "users", user.uid, "weeklyBudget", "currentBudget");
        const budgetDoc = await getDoc(budgetDocRef);

        if (budgetDoc.exists()) {
          const budgetData = budgetDoc.data();
          setWeeklyBudget(budgetData.amount || 0); // Get the amount field
        } else {
          console.log("No weekly budget set in Firestore.");
        }
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching weekly budget:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWeeklyBudget();
      fetchTransactions();
    }
  }, [user]);

  // Calculate total expenses
  const totalExpenses = transactions.reduce((total, transaction) => total + transaction.amount, 0);
  const warningThreshold = weeklyBudget * 0.85; // 85% of the weekly budget
  const hasExceededBudget = totalExpenses > weeklyBudget;

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

  // If loading, show a loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div>
      {/* Main Container */}
      <div className="flex flex-col items-center justify-center rounded-lg bg-gray-400 mx-3 mt-5 text-white px-4" style={{ height: "calc(100vh - 4.5rem)" }}>
        
        {/* Budget Alerts */}
        {totalExpenses >= warningThreshold && totalExpenses <= weeklyBudget && (
          <div className="warning-message bg-yellow-100 text-yellow-800 p-2 rounded-md mt-4">
            Warning: Your expenses are nearing your weekly budget!
          </div>
        )}
        {hasExceededBudget && (
          <div className="exceeded-message bg-red-100 text-red-800 p-2 rounded-md mt-4">
            Alert: You have exceeded your weekly budget by ${ (totalExpenses - weeklyBudget).toFixed(2) }!
          </div>
        )}

        {/* Budget and Expenses */}
        <div className="w-full h-full mt-4 text-center">
          <div className="mb-2 space-y-2">
            <div className="flex justify-between gap-x-4">
              {/* Weekly Budget Section */}
              <div className="flex items-center w-1/2 bg-transparent border-2 border-white p-4 rounded-lg">
                <div className="w-full text-left">
                  <p className="text-md font-medium text-gray-700 whitespace-nowrap">WEEKLY BUDGET</p>
                  <div className="flex items-center">
                    <p className="font-bold text-4xl text-white">${weeklyBudget.toFixed(2)}</p>
                    <button onClick={toggleEditBudgetPopup} className="text-green-600 text-xl bg-transparent border-0 ml-2 mt-2">
                      <FaEdit />
                    </button>
                  </div>
                </div>
              </div>

              {/* Total Expenses Section */}
              <div className="flex justify-between items-center w-1/2 bg-transparent border-2 border-white p-4 rounded-lg">
                <div className="w-full text-left">
                  <p className="text-md font-medium text-gray-700 whitespace-nowrap">TOTAL EXPENSES</p>
                  <p className="font-bold text-4xl text-white">${totalExpenses.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
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
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chart Section with Toggle */}
        <div className="w-3/4 max-w-xl mb-2">
          <div className="flex justify-center mb-4">
            <div className="flex items-center bg-gray-200 rounded-full p-1">
              {/* Pie Chart Button */}
              <button
                onClick={() => setChartType("pie")}
                className={`px-4 py-2 rounded-full font-medium text-xs ${
                  chartType === "pie" ? "bg-green-600 text-white" : "bg-transparent text-gray-500"
                }`}
              >
                Pie Chart
              </button>
              {/* Bar Chart Button */}
              <button
                onClick={() => setChartType("bar")}
                className={`px-4 py-2 rounded-full font-medium text-xs ${
                  chartType === "bar" ? "bg-green-600 text-white" : "bg-transparent text-gray-500"
                }`}
              >
                Bar Chart
              </button>
            </div>
          </div>
          {chartType === "pie" ? (
            <Pie data={chartData} />
          ) : (
            <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  ticks: {
                    color: "white",  // Set x-axis tick labels to white
                  },
                  grid: {
                    color: "white",  // Set x-axis grid lines to a light white
                  },
                },
                y: {
                  ticks: {
                    color: "white",  // Set y-axis tick labels to white
                  },
                  grid: {
                    color: "white",  // Set y-axis grid lines to a light white
                  },
                },
              },
            }}
          />
          )}
        </div>

        {/* Transactions List */}
        <div className="w-full mt-8 mb-20">
          <ul className="bg-white text-black p-4 rounded-lg">
            {transactions.length === 0 ? (
              <p className="text-center">No transactions yet.</p>
            ) : (
              transactions.map((transaction, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center py-2 border-b last:border-b-0"
                >
                  <div className="mr-3">
                    <p className="font-bold break-words">{transaction.name}</p>
                    <p className="text-xs text-gray-600">
                      {transaction.date.toDate().toLocaleDateString()}                  
                    </p>
                  </div>
                  <span className="italic text-gray-600 mr-3">{transaction.category}</span>
                  <span>- ${transaction.amount.toFixed(2)}</span>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Add Transaction Button */}
        <button
          onClick={toggleAddTransactionPopup}
          className="fixed bottom-8 right-8 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-3 rounded-full shadow-lg transition duration-300"
        >
          <span className="inline md:hidden">
            <PlusIcon className="w-6 h-6" strokeWidth={3} />
          </span>
          <span className="hidden md:inline">+ Add Transaction</span>
        </button>
      </div>

      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
            <h2 className="text-2xl font-bold mb-4">New Transaction</h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Name</label>
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
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
      
      <ErrorModal
        isOpen={errorModal.isOpen}
        message={errorModal.message}
        closeErrorModal={closeErrorModal}
        isError={true}
      />
    </div>
  );
};

export default Budget;
