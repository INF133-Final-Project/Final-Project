import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

/**
 * Saves user information (first name, last name, email) to Firestore.
 * userId - The user's unique Firebase ID.
 * firstName - The user's first name.
 * lastName - The user's last name.
 * email - The user's email address.
 */
const saveUserInfo = async (userId, firstName, lastName, email) => {
  try {
    await setDoc(doc(db, "users", userId), {
      firstName,
      lastName,
      email,
    });
    console.log("User information saved successfully.");
  } catch (error) {
    console.error("Error saving user information:", error);
  }
};

const SignUp = () => {
  const [firstName, setFirstName] = useState(""); // State for user's first name
  const [lastName, setLastName] = useState(""); // State for user's last name
  const [email, setEmail] = useState(""); // State for user's email
  const [emailConfirm, setEmailConfirm] = useState(""); // State for email confirmation
  const [password, setPassword] = useState(""); // State for user's password
  const [passwordConfirm, setPasswordConfirm] = useState(""); // State for password confirmation
  const [error, setError] = useState(""); // State to hold error messages
  const [user] = useAuthState(auth); // Hook to check the current authentication state
  const navigate = useNavigate(); // Hook to handle navigation between pages

  /**
   * Handles the sign-up process, validates inputs, and registers the user with Firebase Authentication.
   * e - The form submission event.
   */
  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validate email and password confirmation
    if (email !== emailConfirm) {
      setError("Emails do not match.");
      return;
    }
    if (password !== passwordConfirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Register user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save user information to Firestore
      await saveUserInfo(user.uid, firstName, lastName, email);

      // Redirect to login page after successful registration
      navigate("/login");
    } catch (error) {
      // Handle registration errors
      setError(getErrorMessage(error.code));
    }
  };

  /**
   * Maps Firebase error codes to user-friendly error messages.
   * code - The error code from Firebase.
   * strings - The corresponding error message.
   */
  const getErrorMessage = (code) => {
    switch (code) {
      case "auth/email-already-in-use":
        return "This email is already in use.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  };

  /**
   * Redirects the user to the dashboard if they are already logged in.
   */
  useEffect(() => {
    // If user is logged in, redirect to dashboard
    if (user) {
      navigate("/dashboard"); // Redirect to dashboard if user is logged in
    }
  }, [user, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white px-4 sm:px-0">
      <h2 className="text-4xl font-black mb-6">Sign Up</h2>
      <form
        onSubmit={handleSignUp}
        className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg"
      >
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
          className="w-full h-10 p-3 mb-4 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
          className="w-full h-10 p-3 mb-4 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full h-10 p-3 mb-4 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        />
        <input
          type="email"
          value={emailConfirm}
          onChange={(e) => setEmailConfirm(e.target.value)}
          placeholder="Confirm Email"
          className="w-full h-10 p-3 mb-4 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full h-10 p-3 mb-4 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        />
        <input
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          placeholder="Confirm Password"
          className="w-full h-10 p-3 mb-4 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        />
        <button
          type="submit"
          className="w-full h-11 bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 rounded"
        >
          Sign Up
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <p className="mt-4">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-orange-400 hover:text-orange-500 transition duration-200"
        >
          Log in
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
