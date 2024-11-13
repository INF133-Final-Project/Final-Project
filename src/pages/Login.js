import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

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

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error code:", error.code);
      setError(getErrorMessage(error.code));
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
      <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
      <form
        onSubmit={handleLogin}
        className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded transition duration-200"
        >
          Login
        </button>
      </form>
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      <p className="mt-4 text-center">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="text-purple-400 hover:text-white transition duration-200"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;
