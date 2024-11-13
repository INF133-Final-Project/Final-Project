import React from "react";

const ErrorModal = ({ isOpen, message, closeErrorModal }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-red-600 p-6 rounded-lg shadow-lg w-3/4 sm:w-1/2 text-center text-white">
        <h2 className="text-2xl font-semibold mb-4">Error</h2>
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
