import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import googleLogo from "../assets/googleLogo.png";

/**
 * Login.js - This component provides the login interface for users.
 *
 * Features:
 * - Allows users to log in using email and password with Firebase Authentication.
 * - Supports Google Sign-In for faster login via OAuth.
 * - Validates user input and displays error messages for incorrect credentials or unexpected errors.
 * - Redirects authenticated users to the dashboard automatically.
 * - Saves user profile information to Firestore after Google Sign-In.
 * - Includes a link to the signup page for new users.
 * - Fully responsive design for both mobile and desktop views.
 */
const Login = () => {
  const [email, setEmail] = useState(""); // State to hold the user's email input
  const [password, setPassword] = useState(""); // State to hold the user's password input
  const [error, setError] = useState(""); // State to display error messages
  const [user] = useAuthState(auth); // Hook to get the current authenticated user
  const navigate = useNavigate(); // Hook to navigate between routes

  /**
   * Maps error codes to user-friendly error messages.
   * code - The error code from Firebase.
   * string - The corresponding error message.
   */
  const getErrorMessage = (code) => {
    switch (code) {
      case "auth/invalid-credential":
        return "No user found or incorrect password. Please try again.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  };

  /**
   * Saves user information to Firestore after a successful login.
   * userId - The user's unique ID from Firebase.
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

  /**
   * Handles the Google Sign-In process using Firebase Authentication.
   */
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider(); // Create Google Auth provider instance
    try {
      const result = await signInWithPopup(auth, provider); // Sign in with Google popup
      const user = result.user;

      const nameParts = (user.displayName || "").split(" "); // Split user's display name
      const lastName = nameParts.pop(); // Extract last name
      const firstName = nameParts.join(" "); // Extract first name

      // Save user info to Firestore
      await saveUserInfo(user.uid, firstName || "", lastName || "", user.email);

      console.log("Google Sign-In Success:", { firstName, lastName });
      navigate("/dashboard"); // Navigate to dashboard on success
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
      setError("Failed to sign in with Google. Please try again."); // Display error message
    }
  };

  /**
   * Handles login with email and password using Firebase Authentication.
   * e - The form submission event.
   */
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      await signInWithEmailAndPassword(auth, email, password); // Login with email and password
      navigate("/dashboard"); // Navigate to dashboard on success
    } catch (error) {
      console.error("Error code:", error.code);
      setError(getErrorMessage(error.code)); // Display error message based on error code
    }
  };

  /**
   * Redirects the user to the dashboard if already logged in.
   */
  useEffect(() => {
    // If user is logged in, redirect to dashboard
    if (user) {
      navigate("/dashboard"); // Redirect to dashboard if user is logged in
    }
  }, [user, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white px-4 sm:px-0">
      <h2 className="text-4xl font-black mb-6 text-center">Login</h2>

      <form
        onSubmit={handleLogin}
        className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full h-10 p-3 mb-4 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full h-10 p-3 mb-4 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        />
        <button
          type="submit"
          className="w-full h-11 bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 rounded transition duration-200"
        >
          Login
        </button>
      </form>
      <h2 className="text-xl font-bold my-2 text-center">or</h2>
      <div className="bg-gray-900 rounded-lg shadow-lg w-full max-w-lg  p-6">
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center space-x-2 w-full h-11 bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 rounded transition duration-200"
        >
          <img src={googleLogo} alt="Google Logo" className="w-6 h-6" />
          <span>Sign in with Google</span>
        </button>
      </div>
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      <p className="mt-4 text-center">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="text-orange-400 hover:text-orange-500 transition duration-200"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;
