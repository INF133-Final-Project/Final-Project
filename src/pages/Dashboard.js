import React, { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Split from "react-split";
import Overview from "./Overview";
import Container from "../components/Container";
import checklist from "../assets/checklist.png";
import profile from "../assets/profile.png";
import userLogout from "../assets/userLogout.png";
import ProfileModal from "../components/ProfileModal";

/**
 * Dashboard.js - This component serves as the main dashboard for the application.
 *
 * Features:
 * - Fetches and displays user data (name and email) from Firestore.
 * - Provides a split view toggle for simultaneous task management and overview display.
 * - Includes a sidebar for navigation (checklist, profile, and logout).
 * - Manages authentication state and handles user logout.
 * - Renders a profile modal for viewing and editing user details.
 * - Responsive design for both desktop and mobile layouts.
 * - Utilizes React Split for split view layout and manages dynamic component rendering.
 */
const Dashboard = () => {
  const [userName, setUserName] = useState(null); // Stores the user's full name
  const [split, setSplit] = useState(false); // Tracks whether split view is enabled
  const [loading, setLoading] = useState(true); // Tracks whether user data is being fetched
  const navigate = useNavigate(); // Hook for navigation
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // Tracks profile modal visibility

  /**
   * Toggles the visibility of the profile modal.
   */
  const toggleProfileModal = () => {
    setIsProfileModalOpen((prev) => !prev);
  };

  /**
   * Fetches user data (first and last name) from Firestore.
   */
  const fetchUserData = async () => {
    if (auth.currentUser) {
      try {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(`${userData.firstName} ${userData.lastName}`); // Combine first and last name
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false); // Stop loading state
      }
    }
  };

  /**
   * Fetch user data on component mount.
   */
  useEffect(() => {
    fetchUserData();
  }, []);

  /**
   * Toggles split view mode.
   */
  const toggleSplit = () => setSplit((prevSplit) => !prevSplit);

  /**
   * Logs the user out and navigates to the login page.
   */
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed", error); // Log any errors during logout
    }
  };

  /**
   * Renders a loading spinner while data is being fetched.
   */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  /**
   * Sidebar icon component for rendering individual icons in the sidebar.
   */
  const SidebarIcon = ({ src, alt, onClick }) => (
    <img
      src={src}
      alt={alt}
      className="h-7 w-7 cursor-pointer object-contain hover:scale-125 transition-transform duration-300"
      onClick={onClick}
    />
  );

  /**
   * Sidebar component for desktop view.
   */
  const Sidebar = () => (
    <div
      className="w-10 flex flex-col items-center pt-5 space-y-3"
      style={{ height: "calc(100vh - 2.5rem)" }}
    >
      <SidebarIcon src={checklist} alt="checklist" onClick={toggleSplit} />
      <SidebarIcon src={profile} alt="profile" onClick={toggleProfileModal} />
      <SidebarIcon src={userLogout} alt="userLogout" onClick={handleLogout} />
    </div>
  );

  return (
    <>
      <div className="hidden md:grid overflow-hidden h-screen">
        {split ? (
          <Split
            sizes={[40, 60]}
            minSize={[500, 500]}
            gutterSize={10}
            direction="horizontal"
            className="split"
          >
            <div
              className="flex flex-col items-center justify-center bg-gray-400 my-5 mx-3 rounded-lg"
              style={{ height: "calc(100vh - 2.5rem)" }}
            >
              <Overview isSplit={split} />
            </div>
            <div>
              <Container
                toggleSplit={toggleSplit}
                handleLogout={handleLogout}
                userName={userName}
                auth={auth}
                fetchUserData={fetchUserData}
              />
            </div>
          </Split>
        ) : (
          <div className="flex">
            <div
              className="flex flex-col items-center justify-center bg-gray-400 my-5 ml-3 rounded-lg flex-grow"
              style={{ height: "calc(100vh - 2.5rem)" }}
            >
              <Overview />
            </div>
            <Sidebar />
          </div>
        )}
        ;
      </div>
      <div className="md:hidden h-screen">
        <Container
          toggleSplit={toggleSplit}
          handleLogout={handleLogout}
          userName={userName}
          auth={auth}
          fetchUserData={fetchUserData}
        />
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        userName={userName}
        email={auth.currentUser?.email}
        onClose={toggleProfileModal}
        onSave={fetchUserData}
      />
    </>
  );
};

export default Dashboard;
