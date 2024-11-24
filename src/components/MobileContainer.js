import React, { useState } from "react";
import Todo from "../pages/Todo";
import Note from "../pages/Note";
import Budget from "../pages/Budget";
import Overview from "../pages/Overview";
import profile from "../assets/profile.png";
import userLogout from "../assets/userLogout.png";
import ProfileModal from "./ProfileModal";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const MobileContainer = ({ handleLogout, auth, userName, fetchUserData }) => {
  const [nav, setNav] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const toggleProfileModal = () => {
    setIsProfileModalOpen((prev) => !prev);
  };

  const handleNav = (navNumber) => {
    setNav(navNumber);
    setIsOpen(false);
  };

  const NavItem = ({ label, navNumber }) => (
    <div
      onClick={() => handleNav(navNumber)}
      className="font-bold hover:text-orange-400 cursor-pointer"
    >
      {label}
    </div>
  );

  return (
    <div className="relative">
      {/* Header */}
      <header className="flex px-5 justify-between items-end bg-gray-800 text-white sticky top-0 w-full z-10 h-10">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white focus:outline-none"
        >
          {isOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
        <div className="flex space-x-3">
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

      {/* Navigation Menu */}
      <div
        className={`transition-all duration-700 ease-in-out overflow-hidden ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } bg-gray-800 text-white flex flex-col items-center space-y-4`}
      >
        <NavItem label="Dashboard" navNumber={1} />
        <NavItem label="Tasks" navNumber={2} />
        <NavItem label="Note" navNumber={3} />
        <NavItem label="Budget" navNumber={4} />
      </div>

      {/* Main Content */}
      <div className="-mt-2 flex-1 overflow-y-auto">
        {nav === 1 && (
          <div
            className="flex flex-col items-center justify-center rounded-lg bg-gray-400 mx-3 mt-5"
            style={{ height: "calc(100vh - 4.5rem)" }}
          >
            <Overview userName={userName} auth={auth} />
          </div>
        )}
        {nav === 2 && <Todo />}
        {nav === 3 && <Note />}
        {nav === 4 && <Budget />}
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

export default MobileContainer;
