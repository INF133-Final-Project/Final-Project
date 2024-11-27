import React, { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import ErrorModal from "./ErrorModal";

const ProfileModal = ({ isOpen, userName, email, onClose, onSave }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: "" });

  useEffect(() => {
    if (isOpen) {
      setOpenProfile(true);
      setTimeout(() => setIsAnimating(true), 10);
      const nameParts = userName.split(" ");
      setFirstName(nameParts.slice(0, -1).join(" ") || "");
      setLastName(nameParts.slice(-1).join(" ") || "");
    } else {
      setIsAnimating(false);
      setTimeout(() => setOpenProfile(false), 700);
    }
  }, [isOpen, userName]);

  if (!openProfile) return null;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const closeErrorModal = () => {
    setErrorModal(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    const nameParts = userName.split(" ");
    setFirstName(nameParts.slice(0, -1).join(" ") || "");
    setLastName(nameParts.slice(-1).join(" ") || "");
  };

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      setErrorModal({
        isOpen: true,
        message: "First Name and Last Name cannot be empty!",
        isError: true,
      });
      return;
    }
    const nameParts = userName.split(" ");
    if (
      firstName.trim() === nameParts.slice(0, -1).join(" ") &&
      lastName.trim() === nameParts.slice(-1).join(" ")
    ) {
      setErrorModal({
        isOpen: true,
        message: "New name cannot be the same as the current name!",
        isError: true,
      });
      return;
    }

    setIsSaving(true);
    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, {
        firstName,
        lastName,
      });
      setErrorModal({
        isOpen: true,
        message: "Name updated successfully!",
        isError: false,
      });
      setIsEditing(false);
      onSave();
    } catch (error) {
      console.error("Error updating name:", error);
      setErrorModal({
        isOpen: true,
        message: "Failed to update name. Please try again.",
        isError: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black flex items-center justify-center z-50 transform transition-opacity duration-700 ${
        isAnimating ? "bg-opacity-50 opacity-100" : "bg-opacity-0 opacity-0"
      }`}
    >
      <div
        className={`bg-gray-300 rounded-lg shadow-lg w-3/4 sm:w-1/2 max-w-2xl p-6 transform transition-all duration-700 ${
          isAnimating
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-full"
        }`}
      >
        <h2 className="text-3xl font-bold mb-4 text-center">Profile</h2>
        <div className="text-center">
          <div className="mb-4">
            <strong>Email:</strong> {email}
          </div>
          <div className="mb-4">
            <strong>Name:</strong>{" "}
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex justify-center items-center space-x-2">
                  <label className="block text-gray-700 mb-1">
                    First Name:{" "}
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="p-1 border rounded  focus:outline-none focus:ring focus:ring-blue-300"
                  />
                </div>
                <div className="flex justify-center items-center space-x-2">
                  <label className="block text-gray-700 mb-1">
                    Last Name:{" "}
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="p-1 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                  />
                </div>
              </div>
            ) : (
              <span
                onClick={handleEdit}
                className="cursor-pointer  hover:text-blue-700"
              >
                {userName}
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-end mt-6 space-x-3">
          {isEditing && (
            <>
              <button
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition duration-300"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded text-white ${
                  isSaving
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } transition duration-300`}
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </>
          )}
          {!isEditing && (
            <button
              className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition duration-300"
              onClick={() => {
                onClose();
                handleCancelEdit();
              }}
            >
              Close
            </button>
          )}
        </div>
      </div>
      <ErrorModal
        isOpen={errorModal.isOpen}
        message={errorModal.message}
        closeErrorModal={closeErrorModal}
        isError={errorModal.isError}
      />
    </div>
  );
};

export default ProfileModal;
