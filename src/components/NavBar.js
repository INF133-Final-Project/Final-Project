import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-gray-700 text-white fixed top-0 left-0 w-full z-10">
      <div className="flex items-center justify-between p-2 h-10">
        {/* Left - Hamburger Icon for Mobile */}
        <div className="sm:hidden flex items-center">
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
        </div>

        {/* Centered Links for Desktop, Hidden on Mobile */}
        <nav className="hidden sm:flex space-x-12 items-center mx-auto">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "text-purple-400 font-bold" : "hover:text-purple-400"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/todo"
            className={({ isActive }) =>
              isActive ? "text-purple-400 font-bold" : "hover:text-purple-400"
            }
          >
            Todo
          </NavLink>
          <NavLink
            to="/note"
            className={({ isActive }) =>
              isActive ? "text-purple-400 font-bold" : "hover:text-purple-400"
            }
          >
            Note
          </NavLink>
          <NavLink
            to="/budget"
            className={({ isActive }) =>
              isActive ? "text-purple-400 font-bold" : "hover:text-purple-400"
            }
          >
            Budget
          </NavLink>
        </nav>

        {/* Right - Profile Icon */}
        <NavLink
          to="/profile"
          className="flex items-center hover:text-purple-400 cursor-pointer"
        >
          <UserCircleIcon className="w-7 h-7" />
        </NavLink>
      </div>

      {/* Dropdown Menu for Mobile with Animation */}
      <div
        className={`transition-all duration-700 ease-in-out overflow-hidden ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } sm:hidden bg-gray-700 text-white flex flex-col items-center space-y-4`}
      >
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "text-purple-400 font-bold" : "hover:text-purple-400"
          }
          onClick={() => setIsOpen(false)}
        >
          Home
        </NavLink>
        <NavLink
          to="/todo"
          className={({ isActive }) =>
            isActive ? "text-purple-400 font-bold" : "hover:text-purple-400"
          }
          onClick={() => setIsOpen(false)}
        >
          Todo
        </NavLink>
        <NavLink
          to="/note"
          className={({ isActive }) =>
            isActive ? "text-purple-400 font-bold" : "hover:text-purple-400"
          }
          onClick={() => setIsOpen(false)}
        >
          Note
        </NavLink>
        <NavLink
          to="/budget"
          className={({ isActive }) =>
            isActive
              ? "text-purple-400 font-bold"
              : "hover:text-purple-400 pb-4"
          }
          onClick={() => setIsOpen(false)}
        >
          Budget
        </NavLink>
      </div>
    </header>
  );
};

export default NavBar;
