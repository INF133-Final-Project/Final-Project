import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebaseConfig";

const PrivateRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  // Show the spinner while loading
  if (loading) return <div className="spinner"></div>;

  // If the user is logged in, render children; otherwise, redirect to the login page
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
