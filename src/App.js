import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebaseConfig";

/**
 * App.js - This file serves as the main entry point for the application's routing and authentication flow.
 *
 * Features:
 * - Uses React Router for managing navigation across pages (SignUp, Login, Dashboard).
 * - Implements a loading spinner to handle Firebase authentication state initialization.
 * - Redirects authenticated users to the dashboard and unauthenticated users to the login page.
 * - Secures the dashboard route with a `PrivateRoute` component, ensuring only authenticated access.
 * - Simplifies routing with conditional rendering based on user authentication state.
 */
function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={user ? "/dashboard" : "/login"} />}
        />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
