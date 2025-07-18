import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../styles/Navbar.css'; 

// --- NEW: Import useFirebase and Firestore functions ---
import { useFirebase } from '../context/FirebaseContext';
import { doc, getDoc } from "firebase/firestore";

// Import all necessary icons
import { PersonPlus, Mortarboard, Building, Briefcase, Bank, Person } from 'react-bootstrap-icons';

const Navbar = () => {
  // --- Get the current user and db connection from the central Firebase context ---
  const { auth, db, currentUser } = useFirebase();
  const navigate = useNavigate();
  const navbarCollapseRef = useRef(null); 
  const togglerRef = useRef(null);

  // --- NEW: State to hold the user's role ---
  const [userRole, setUserRole] = useState(null);

  // --- NEW: This effect fetches the user's role from Firestore when they log in ---
  useEffect(() => {
    const fetchUserRole = async () => {
      if (currentUser && db) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setUserRole(docSnap.data().role);
        } else {
          // If for some reason a user exists in Auth but not in the database,
          // default them to a student role.
          setUserRole('student');
        }
      } else {
        setUserRole(null); // Clear role when user logs out
      }
    };

    fetchUserRole();
  }, [currentUser, db]); // This effect re-runs whenever the logged-in user changes

  const handleCloseMenu = () => {
    if (navbarCollapseRef.current && navbarCollapseRef.current.classList.contains('show')) {
      togglerRef.current.click();
    }
  };

  const handleLogout = async () => {
    handleCloseMenu();
    try {
        if (auth) {
            await auth.signOut();
            console.log("User signed out successfully.");
            navigate('/'); // Redirect to homepage after logout
        }
    } catch (error) {
        console.error("Error signing out:", error);
    }
  };

  // --- NEW: Helper function to get the correct dashboard path based on the user's role ---
  const getDashboardPath = () => {
    switch (userRole) {
        case 'trainer':
            return '/dashboard/trainer';
        case 'support':
            return '/dashboard/support';
        case 'corporate':
            return '/dashboard/corporate';
        case 'student':
        default:
            return '/dashboard/my-courses';
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (navbarCollapseRef.current && navbarCollapseRef.current.classList.contains('show')) {
          handleCloseMenu();
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); 

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/" onClick={handleCloseMenu}>
          Taxly <span className="text-dark">Academy</span>
        </Link>
        <button 
          ref={togglerRef} 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarContent" 
          aria-controls="navbarContent" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent" ref={navbarCollapseRef}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
           
            <li className="nav-item">
              <NavLink className="nav-link" to="/" onClick={handleCloseMenu}>Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/courses" onClick={handleCloseMenu}>Courses</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/joblistpage" onClick={handleCloseMenu}>Job Board</NavLink>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="solutionsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Solutions For
              </a>
              <ul className="dropdown-menu" aria-labelledby="solutionsDropdown">
                <li>
                  <Link className="dropdown-item d-flex align-items-center" to="/" onClick={handleCloseMenu}>
                    <Person className="me-2" /> For Individuals
                  </Link>
                </li>
                 <li>
                  <Link className="dropdown-item d-flex align-items-center" to="/for-businesses" onClick={handleCloseMenu}>
                    <Briefcase className="me-2" /> For Businesses
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <Link className="dropdown-item d-flex align-items-center" to="/for-universities" onClick={handleCloseMenu}>
                    <Mortarboard className="me-2" /> For Universities
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item d-flex align-items-center" to="/for-secondary-schools" onClick={handleCloseMenu}>
                    <Building className="me-2" /> For Schools
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item d-flex align-items-center" to="/for-government" onClick={handleCloseMenu}>
                    <Bank className="me-2" /> For Government
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="moreDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                More
              </a>
              <ul className="dropdown-menu" aria-labelledby="moreDropdown">
                <li><Link className="dropdown-item" to="/about" onClick={handleCloseMenu}>About Us</Link></li>
                <li><Link className="dropdown-item" to="/contact" onClick={handleCloseMenu}>Contact</Link></li>
                <li><Link className="dropdown-item" to="/events" onClick={handleCloseMenu}>Events</Link></li>
                <li><Link className="dropdown-item" to="/blog" onClick={handleCloseMenu}>Blog</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <Link className="dropdown-item d-flex align-items-center" to="/become-a-trainer" onClick={handleCloseMenu}>
                    <PersonPlus className="me-2" /> Become a Trainer
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
          <div className="d-flex align-items-center">
            {/* --- FIX: Conditional rendering based on currentUser --- */}
            {currentUser ? (
                <>
                    {/* --- FIX: Use the dynamic path from getDashboardPath() --- */}
                    <Link to={getDashboardPath()} className="btn btn-outline-secondary me-2" onClick={handleCloseMenu}>
                        Dashboard
                    </Link>
                    <button className="btn btn-primary" onClick={handleLogout}>
                        Logout
                    </button>
                </>
            ) : (
                <>
                    <Link to="/login" className="btn btn-outline-secondary me-2" onClick={handleCloseMenu}>
                        Login
                    </Link>
                    <Link to="/enroll" className="btn btn-primary" onClick={handleCloseMenu}>
                        Enroll Now
                    </Link>
                </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
