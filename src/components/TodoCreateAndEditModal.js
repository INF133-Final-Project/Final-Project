import React from "react";

const TodoCreateAndEditModal = ({
  isOpen,
  isAnimating,
  editIndex,
  newTodo,
  setNewTodo,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  priority,
  setPriority,
  closeModal,
  addOrEditTodo,
  deleteTodo,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-700">
      <div
        className={`bg-gray-300 p-6 rounded-lg shadow-lg sm:w-1/2 w-3/4 max-w-2xl sm:mx-0 mx-4 text-center transform transition-all duration-700 ${
          isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      >
        <h2 className="text-2xl font-semibold mb-4">
          {editIndex !== null ? "Edit Todo" : "Add New Todo"}
        </h2>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter Todo"
          className="w-full p-2 mb-4 rounded bg-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="Low">Low</option>
          <option value="Med">Med</option>
          <option value="High">High</option>
        </select>
        <div className="flex justify-end items-center space-x-2">
          {editIndex !== null && (
            <button
              onClick={deleteTodo}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-auto"
            >
              Delete
            </button>
          )}
          <div className="flex space-x-2">
            <button
              onClick={closeModal}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              onClick={addOrEditTodo}
              className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoCreateAndEditModal;
