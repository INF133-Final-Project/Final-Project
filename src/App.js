import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NavBar from "./components/NavBar";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Todo from "./pages/Todo";
import Note from "./pages/Note";
import Budget from "./pages/Budget";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebaseConfig";

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
      {user && <NavBar />}
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
        <Route
          path="/todo"
          element={
            <PrivateRoute>
              <Todo />
            </PrivateRoute>
          }
        />
        <Route
          path="/note"
          element={
            <PrivateRoute>
              <Note />
            </PrivateRoute>
          }
        />
        <Route
          path="/budget"
          element={
            <PrivateRoute>
              <Budget />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
