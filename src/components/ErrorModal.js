import React from "react";

const ErrorModal = ({ isOpen, message, closeErrorModal, isError }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`bg-gray-300 border-4  p-6 rounded-lg shadow-lg sm:w-2/5 w-1/2 max-w-md text-center ${
          isError ? " text-red-600 border-red-800" : "text-black border-black"
        }`}
      >
        <h2 className="text-2xl font-semibold mb-4">
          {isError ? "Error" : "Success"}
        </h2>
        <p>{message}</p>
        <button
          onClick={closeErrorModal}
          className="mt-4 bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
