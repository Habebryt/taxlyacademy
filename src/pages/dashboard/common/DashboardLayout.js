import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import WelcomeHeader from './WelcomeHeader';
import '../../../../src/styles/Dashboard.css'; // Create this new CSS file

// --- NEW: Import the useFirebase hook and Firestore functions ---
import { useFirebase } from '../../../context/FirebaseContext';
import { doc, getDoc } from "firebase/firestore";

/**
 * The main layout component for all dashboard pages.
 * It provides a consistent structure with a sidebar and a content area.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The specific page content to be rendered inside the layout.
 */
const DashboardLayout = ({ children }) => {
  // --- Get the currently authenticated user from our Firebase context ---
  const { auth, db } = useFirebase();
  const currentUser = auth?.currentUser;

  // --- NEW: State to hold the user's full profile data and a dynamic greeting ---
  const [userProfile, setUserProfile] = useState(null);
  const [greeting, setGreeting] = useState('Welcome back');
  const [welcomeMessage, setWelcomeMessage] = useState("Let's continue making progress on your goals today.");

  useEffect(() => {
    // --- Determine the time of day for a dynamic greeting ---
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };
    setGreeting(getGreeting());

    // --- Fetch the user's profile from the 'users' collection ---
    const fetchUserProfile = async () => {
      if (db && currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const profileData = docSnap.data();
          setUserProfile(profileData);

          // --- NEW: Set dynamic welcome message based on user role ---
          switch (profileData.role) {
            case 'trainer':
              setWelcomeMessage("Let's empower some students today. Here's an overview of your courses and activity.");
              break;
            case 'support':
              setWelcomeMessage("Here are the latest inquiries and support tickets that need your attention.");
              break;
            default: // 'student' and any other case
              setWelcomeMessage("Let's continue making progress on your learning goals today.");
              break;
          }
        }
      }
    };

    fetchUserProfile();
  }, [currentUser, db]);

  // --- Determine the user's name with a better fallback system ---
  const userName = userProfile?.fullName || currentUser?.displayName || currentUser?.email || "User"; 

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main-content">
        {/* Pass the dynamic greeting and welcome message to the header */}
        <WelcomeHeader greeting={greeting} userName={userName} message={welcomeMessage} />
        <div className="dashboard-page-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
