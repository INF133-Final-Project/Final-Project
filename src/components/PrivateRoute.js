import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";

const PrivateRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  // Show the spinner while loading
  if (loading) {
    console.log("loading from route");
    console.log(user);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If the user is logged in, render children; otherwise, redirect to the login page
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
