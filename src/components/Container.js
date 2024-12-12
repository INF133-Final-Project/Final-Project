import React, { useState } from "react";
import Todo from "../pages/Todo";
import Note from "../pages/Note";
import Budget from "../pages/Budget";
import checklist from "../assets/checklist.png";
import profile from "../assets/profile.png";
import userLogout from "../assets/userLogout.png";
import ProfileModal from "./ProfileModal";
import Overview from "../pages/Overview";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

/**
 * Container.js - This component serves as the main layout container for the application.
 *
 * Features:
 * - Manages navigation between different pages (Dashboard, Tasks, Note, Budget).
 * - Supports both desktop and mobile views with responsive navigation menus.
 * - Integrates a profile modal for viewing and editing user details.
 * - Provides options to toggle a split view and handle user logout.
 * - Dynamically updates the current page label and navigation state.
 */
const Container = ({
  toggleSplit,
  handleLogout,
  userName,
  auth,
  fetchUserData,
}) => {
  const [nav, setNav] = useState(1); // Tracks current navigation tab
  const [isOpen, setIsOpen] = useState(false); // Manages mobile navigation menu visibility
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // Controls profile modal visibility
  const [currentPage, setCurrentPage] = useState("Tasks"); // Tracks current page label

  // Handle navigation and update the current page
  const handleNav = (navNumber) => {
    const pageLabels = ["Dashboard", "Tasks", "Note", "Budget"];
    setNav(navNumber);
    setCurrentPage(pageLabels[navNumber]); // Update the current page label
    setIsOpen(false);
  };

  // Toggle profile modal visibility
  const toggleProfileModal = () => {
    setIsProfileModalOpen((prev) => !prev);
  };

  // Define navigation items for the header
  const navItems = [
    { id: 1, label: "Tasks" },
    { id: 2, label: "Note" },
    { id: 3, label: "Budget" },
  ];

  // Component for individual navigation items
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
      {/* Desktop Header */}
      <header className="hidden md:flex space-x-12 justify-center items-center mx-auto bg-gray-800 text-white sticky top-5 w-full z-10 h-8">
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
      {/* Mobile Header */}
      <header className="flex px-5 justify-between items-end bg-gray-800 text-white sticky top-0 w-full z-10 h-10 md:hidden">
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
        <div className="flex items-center space-x-2">
          <span className="text-md font-bold">{currentPage}</span>{" "}
          {/* Current page name */}
        </div>
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
        } bg-gray-800 text-white flex flex-col items-center space-y-4 md:hidden`}
      >
        <div className="w-full border-b border-gray-600 text-center py-2"></div>
        <NavItem label="Dashboard" navNumber={0} />
        <NavItem label="Tasks" navNumber={1} />
        <NavItem label="Note" navNumber={2} />
        <NavItem label="Budget" navNumber={3} />
      </div>

      <div className="flex-1 overflow-y-auto -mt-2 md:mt-0">
        {nav === 0 && (
          <div
            className="flex flex-col items-center justify-center rounded-lg bg-gray-400 mx-3 mt-5"
            style={{ height: "calc(100vh - 4.5rem)" }}
          >
            <Overview userName={userName} auth={auth} />
          </div>
        )}
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
