import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
    HouseDoor, 
    Mortarboard, 
    Briefcase, 
    Person, 
    BoxArrowLeft,
    Book,
    Easel,
    Headset,
    Building
} from 'react-bootstrap-icons';
import '../../../../src/styles/Dashboard.css';

// --- NEW: Import Firebase services ---
import { useFirebase } from '../../../context/FirebaseContext';
import { doc, getDoc } from "firebase/firestore";

const Sidebar = () => {
  const { auth, db } = useFirebase();
  const navigate = useNavigate();

  // --- NEW: State to hold the user's role ---
  const [userRole, setUserRole] = useState(null);

  // --- NEW: This effect fetches the user's role from Firestore ---
  useEffect(() => {
    // --- FIX: Check if auth is initialized before using it ---
    if (!auth) {
      return; // Do nothing if auth is not ready yet
    }

    const fetchUserRole = async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          // Set the role from the user's profile in the database
          setUserRole(docSnap.data().role);
        } else {
          // If no profile exists, default to student
          setUserRole('student');
        }
      }
    };

    // We use onAuthStateChanged to ensure we run this check *after*
    // Firebase has confirmed the user is logged in.
    const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
            fetchUserRole(user);
        } else {
            setUserRole(null); // No user logged in
        }
    });

    return () => unsubscribe(); // Cleanup the listener
  }, [auth, db]); // This effect now correctly depends on `auth`

  // --- NEW: Logout Functionality ---
  const handleLogout = async () => {
    try {
        await auth.signOut();
        navigate('/login'); // Redirect to login page after logout
    } catch (error) {
        console.error("Error signing out:", error);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="navbar-brand fw-bold text-primary">
          Taxly <span className="text-dark">Academy</span>
        </Link>
      </div>
      <nav className="sidebar-nav">

        {/* --- Student Menu --- */}
        {userRole === 'student' && (
            <>
                <p className="sidebar-heading">Student Menu</p>
                <ul className="list-unstyled">
                    <li>
                        <NavLink to="/dashboard/my-courses" className="sidebar-link">
                            <Mortarboard className="me-2" /> My Courses
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard/job-applications" className="sidebar-link">
                            <Briefcase className="me-2" /> Job Applications
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard/profile" className="sidebar-link">
                            <Person className="me-2" /> My Profile
                        </NavLink>
                    </li>
                </ul>
            </>
        )}

        {/* --- Trainer Menu --- */}
        {userRole === 'trainer' && (
            <>
                <p className="sidebar-heading">Trainer Menu</p>
                <ul className="list-unstyled">
                    <li>
                        <NavLink to="/dashboard/trainer" className="sidebar-link">
                            <HouseDoor className="me-2" /> Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard/my-courses-trainer" className="sidebar-link">
                            <Book className="me-2" /> My Courses
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard/create-course" className="sidebar-link">
                            <Easel className="me-2" /> Create Course
                        </NavLink>
                    </li>
                </ul>
            </>
        )}
        
        {/* --- Support Menu --- */}
        {userRole === 'support' && (
            <>
                <p className="sidebar-heading">Support Menu</p>
                <ul className="list-unstyled">
                    <li>
                        <NavLink to="/dashboard/support" className="sidebar-link">
                            <Headset className="me-2" /> All Inquiries
                        </NavLink>
                    </li>
                </ul>
            </>
        )}

        {/* --- Corporate Menu --- */}
        {userRole === 'corporate' && (
             <>
                <p className="sidebar-heading">Partner Menu</p>
                <ul className="list-unstyled">
                    <li>
                        <NavLink to="/dashboard/corporate" className="sidebar-link">
                            <Building className="me-2" /> Partnership Overview
                        </NavLink>
                    </li>
                </ul>
            </>
        )}

      </nav>
      <div className="sidebar-footer">
        {/* --- UPDATED: Use a button for the logout action --- */}
        <button onClick={handleLogout} className="sidebar-link logout-link btn btn-link text-decoration-none">
          <BoxArrowLeft className="me-2" /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
