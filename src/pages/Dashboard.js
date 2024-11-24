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

const Dashboard = () => {
  const [userName, setUserName] = useState(null);
  const [split, setSplit] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const toggleProfileModal = () => {
    setIsProfileModalOpen((prev) => !prev);
  };

  const fetchUserData = async () => {
    if (auth.currentUser) {
      try {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(`${userData.firstName} ${userData.lastName}`);
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const toggleSplit = () => setSplit((prevSplit) => !prevSplit);

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

  const SidebarIcon = ({ src, alt, onClick }) => (
    <img
      src={src}
      alt={alt}
      className="h-7 w-7 cursor-pointer object-contain hover:scale-125 transition-transform duration-300"
      onClick={onClick}
    />
  );

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
              className="bg-gray-400 my-5 mx-3 rounded-lg overflow-hidden"
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
              className="bg-gray-400 my-5 ml-3 rounded-lg overflow-hidden flex-grow"
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
