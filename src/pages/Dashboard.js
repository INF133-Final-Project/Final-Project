import React, { useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for data fetch
  const navigate = useNavigate();

  const getUserData = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserName(`${userData.firstName} ${userData.lastName}`);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false); // End loading state once data is fetched
    }
  };

  useEffect(() => {
    if (auth.currentUser) {
      getUserData(auth.currentUser.uid);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen text-white">
        {userName && (
          <h2 className="text-3xl font-bold mb-6">Welcome, {userName}!</h2>
        )}
        <p className="text-lg">Email: {auth.currentUser?.email}</p>
        <button
          onClick={handleLogout}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded mt-6"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
