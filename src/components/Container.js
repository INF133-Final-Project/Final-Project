import React, { useState } from "react";
import Todo from "../pages/Todo";
import Note from "../pages/Note";
import Budget from "../pages/Budget";
import checklist from "../assets/checklist.png";
import profile from "../assets/profile.png";
import userLogout from "../assets/userLogout.png";
import ProfileModal from "./ProfileModal";

const Container = ({
  toggleSplit,
  handleLogout,
  userName,
  auth,
  fetchUserData,
}) => {
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
      <ProfileModal
        isOpen={isProfileModalOpen}
        userName={userName}
        email={auth.currentUser?.email}
        onClose={toggleProfileModal}
        onSave={fetchUserData}
      />
    </div>
  );
};

export default Container;
