import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

// Function to save user information to Firestore
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

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

      // // Set displayName in Firebase Authentication
      // await updateProfile(user, { displayName: `${firstName} ${lastName}` });

      // Save user information to Firestore
      await saveUserInfo(user.uid, firstName, lastName, email);

      // Navigate to the dashboard after successful sign-up
      navigate("/login");
    } catch (error) {
      setError(getErrorMessage(error.code));
    }
  };

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

  useEffect(() => {
    // If user is logged in, redirect to dashboard
    if (user) {
      navigate("/dashboard");
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
