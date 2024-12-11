import React, { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import ErrorModal from "./ErrorModal";

const ProfileModal = ({ isOpen, userName, email, onClose, onSave }) => {
  const [isAnimating, setIsAnimating] = useState(false); // Controls animation state for modal
  const [openProfile, setOpenProfile] = useState(false); // Tracks modal visibility
  const [isEditing, setIsEditing] = useState(false); // Tracks edit mode
  const [firstName, setFirstName] = useState(""); // Stores first name input
  const [lastName, setLastName] = useState(""); // Stores last name input
  const [isSaving, setIsSaving] = useState(false); // Tracks saving state
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: "" }); // Manages error modal state

  /*
   * Handles the modal's open/close state and initializes name fields.
   * Runs whenever `isOpen` or `userName` changes.
   */
  useEffect(() => {
    if (isOpen) {
      setOpenProfile(true); // Open modal
      setTimeout(() => setIsAnimating(true), 10); // Start animation
      const nameParts = userName.split(" "); // Split name into parts
      setFirstName(nameParts.slice(0, -1).join(" ") || ""); // Extract first name
      setLastName(nameParts.slice(-1).join(" ") || ""); // Extract last name
    } else {
      setIsAnimating(false); // Stop animation
      setTimeout(() => setOpenProfile(false), 700); // Close modal after animation
    }
  }, [isOpen, userName]);

  if (!openProfile) return null; // Do not render modal if it's closed

  /**
   * Enables edit mode.
   */
  const handleEdit = () => {
    setIsEditing(true); // Enable edit mode
  };

  /**
   * Closes the error modal.
   */
  const closeErrorModal = () => {
    setErrorModal(false); // Close error modal
  };

  /**
   * Cancels edit mode and restores the original name values.
   */
  const handleCancelEdit = () => {
    setIsEditing(false); // Exit edit mode
    const nameParts = userName.split(" ");
    setFirstName(nameParts.slice(0, -1).join(" ") || ""); // Reset first name
    setLastName(nameParts.slice(-1).join(" ") || ""); // Reset last name
  };

  /**
   * Saves the updated name to Firestore.
   * Validates the input before saving and shows appropriate error messages if necessary.
   */
  const handleSave = async () => {
    // Validate input
    if (!firstName.trim() || !lastName.trim()) {
      setErrorModal({
        isOpen: true,
        message: "First Name and Last Name cannot be empty!",
        isError: true,
      });
      return;
    }

    // Check if the new name is the same as the current name
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

    setIsSaving(true); // Start saving state
    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid); // Reference to user's Firestore document
      await updateDoc(userDocRef, {
        firstName,
        lastName,
      }); // Update name in Firestore
      setErrorModal({
        isOpen: true,
        message: "Name updated successfully!",
        isError: false,
      });
      setIsEditing(false); // Exit edit mode
      onSave(); // Refresh parent data
    } catch (error) {
      console.error("Error updating name:", error);
      setErrorModal({
        isOpen: true,
        message: "Failed to update name. Please try again.",
        isError: true,
      });
    } finally {
      setIsSaving(false); // Stop saving state
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
