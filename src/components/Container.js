import React, { useState } from "react";
import Todo from "../pages/Todo";
import Note from "../pages/Note";
import Budget from "../pages/Budget";
import checklist from "../assets/checklist.png";
import profile from "../assets/profile.png";
import userLogout from "../assets/userLogout.png";

const Container = ({ toggleSplit, handleLogout, userName, auth }) => {
  const [nav, setNav] = useState(1);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleNav = (navNumber) => {
    setNav(navNumber);
  };

  const toggleProfileModal = () => {
    setIsProfileModalOpen((prev) => !prev);
  };

  const navItems = [
    { id: 1, label: "Tasks" },
    { id: 2, label: "Note" },
    { id: 3, label: "Budget" },
  ];

  return (
    <div className="relative">
      <header className="flex space-x-12 justify-center items-center mx-auto bg-gray-800 text-white sticky top-5 w-full z-10 h-8">
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`relative h-full flex items-center justify-center cursor-pointer ${
              nav === item.id
                ? "font-bold text-white"
                : "hover:scale-110 transition-transform duration-300"
            }`}
            onClick={() => handleNav(item.id)}
          >
            {nav === item.id && (
              <span className="absolute inset-y-0 -left-5 -right-5 bg-gray-400 rounded-t-lg -z-10"></span>
            )}
            {item.label}
          </div>
        ))}
        <div className="flex space-x-3 border-l-2 border-gray-500 pl-7">
          <img
            src={checklist}
            alt="checklist"
            className="h-6 w-6 cursor-pointer object-contain hover:scale-110 transition-transform duration-300"
            onClick={toggleSplit}
          />
          <img
            src={profile}
            alt="profile"
            className="h-6 w-6 cursor-pointer object-contain hover:scale-110 transition-transform duration-300"
            onClick={toggleProfileModal}
          />
          <img
            src={userLogout}
            alt="userLogout"
            className="h-6 w-6 cursor-pointer object-contain hover:scale-110 transition-transform duration-300"
            onClick={handleLogout}
          />
        </div>
      </header>
      <div className="flex-1 overflow-y-auto">
        {nav === 1 && <Todo />}
        {nav === 2 && <Note />}
        {nav === 3 && <Budget />}
      </div>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-3/4 sm:w-1/2 max-w-2xl p-6">
            <h2 className="text-3xl font-bold mb-4 text-center">Profile</h2>
            <div className="text-center">
              <p className="mb-2">
                <strong>Name:</strong> {userName}
              </p>
              <p className="mb-2">
                <strong>Email:</strong> {auth.currentUser?.email}
              </p>
            </div>
            <div className="flex justify-end mt-6">
              <button
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition duration-300"
                onClick={toggleProfileModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Container;
