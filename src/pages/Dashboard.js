import React, { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Split from "react-split";
import Overview from "./Overview";
import Container from "../components/Container";
import MobileContainer from "../components/MobileContainer";
import checklist from "../assets/checklist.png";
import profile from "../assets/profile.png";
import userLogout from "../assets/userLogout.png";

const Dashboard = () => {
  const [userName, setUserName] = useState(null);
  const [split, setSplit] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const toggleProfileModal = () => {
    setIsProfileModalOpen((prev) => !prev);
  };

  useEffect(() => {
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

  // return split ? (
  //   <Split
  //     sizes={[40, 60]}
  //     minSize={[500, 500]}
  //     gutterSize={10}
  //     direction="horizontal"
  //     className="split"
  //   >
  //     <div
  //       className="bg-gray-500 m-5 rounded-lg overflow-hidden"
  //       style={{ height: "calc(100vh - 2.5rem)" }}
  //     >
  //       <Overview userName={userName} auth={auth} />
  //     </div>
  //     <div>
  //       <Container toggleSplit={toggleSplit} handleLogout={handleLogout} />
  //     </div>
  //   </Split>
  // ) : (
  //   <div className="flex overflow-hidden">
  //     <div
  //       className="bg-gray-500 my-5 ml-5 rounded-lg flex-grow"
  //       style={{ height: "calc(100vh - 2.5rem)" }}
  //     >
  //       <Overview userName={userName} auth={auth} />
  //     </div>
  //     <Sidebar />
  //   </div>
  // );

  return (
    <>
      <div className="hidden sm:grid overflow-hidden h-screen">
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
              <Overview userName={userName} auth={auth} isSplit={split} />
            </div>
            <div>
              <Container
                toggleSplit={toggleSplit}
                handleLogout={handleLogout}
                userName={userName}
                auth={auth}
              />
            </div>
          </Split>
        ) : (
          <div className="flex">
            <div
              className="bg-gray-400 my-5 ml-3 rounded-lg overflow-hidden flex-grow"
              style={{ height: "calc(100vh - 2.5rem)" }}
            >
              <Overview userName={userName} auth={auth} />
            </div>
            <Sidebar />
          </div>
        )}
        ;
      </div>
      <div className="sm:hidden h-screen">
        <MobileContainer
          toggleSplit={toggleSplit}
          handleLogout={handleLogout}
          userName={userName}
          auth={auth}
        />
      </div>
      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-3/4 sm:w-1/2 max-w-2xl p-6">
            <h2 className="text-3xl font-bold mb-4 text-center">Profile</h2>
            <div className="text-center">
              <p className="mb-2">
                <strong>Name:</strong> {userName}
              </p>
              <p className="mb-2">
                <strong>Email:</strong> {auth.currentUser?.email}
              </p>
            </div>
            <div className="flex justify-end mt-6">
              <button
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition duration-300"
                onClick={toggleProfileModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
