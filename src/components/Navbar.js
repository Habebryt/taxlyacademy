import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../styles/Navbar.css";
import "animate.css";

import { useFirebase } from "../context/FirebaseContext";
import { doc, getDoc } from "firebase/firestore";

import {
  PersonPlus,
  Mortarboard,
  Building,
  Briefcase,
  Bank,
  Person,
  InfoCircle,
  Envelope,
  CalendarEvent,
  Newspaper,
  PersonBadge,
  BoxArrowInRight,
  RocketTakeoff,
} from "react-bootstrap-icons";

const Navbar = () => {
  const { auth, db, currentUser } = useFirebase();
  const navigate = useNavigate();
  const navbarCollapseRef = useRef(null);
  const togglerRef = useRef(null);
  const [scrollDirection, setScrollDirection] = useState("up");
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const navbarRef = useRef(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (currentUser && db) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setUserRole(docSnap.data().role);
        } else {
          setUserRole("student");
        }
      } else {
        setUserRole(null);
      }
    };
    fetchUserRole();
  }, [currentUser, db]);

  const handleCloseMenu = () => {
    if (
      navbarCollapseRef.current &&
      navbarCollapseRef.current.classList.contains("show")
    ) {
      togglerRef.current?.click();
    }
  };

  const handleLogout = async () => {
    handleCloseMenu();
    try {
      if (auth) {
        await auth.signOut();
        console.log("User signed out successfully.");
        navigate("/");
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getDashboardPath = () => {
    switch (userRole) {
      case "trainer":
        return "/dashboard/trainer";
      case "support":
        return "/dashboard/support";
      case "corporate":
        return "/dashboard/corporate";
      case "student":
        return "/dashboard/my-courses";
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop) {
        // Scrolling Down
        setScrollDirection("down");
      } else {
        // Scrolling Up
        setScrollDirection("up");
      }
      setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-light bg-white shadow-sm py-2 fixed-top ${
        scrollDirection === "down"
          ? "animate__animated animate__fadeOutUp"
          : "animate__animated animate__fadeInDown"
      }`}
      ref={navbarRef}
    >
      <div className="container d-flex flex-column flex-lg-row justify-content-between align-items-center">
        {/* Brand */}
        <Link
          className="navbar-brand fw-bold text-primary mb-2 mb-lg-0"
          to="/"
          onClick={handleCloseMenu}
        >
          Taxly <span className="text-dark">Academy</span>
        </Link>

        {/* Toggler */}
        <button
          className="navbar-toggler"
          ref={togglerRef}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Centered Nav Links */}
        <div
          className="collapse navbar-collapse"
          ref={navbarCollapseRef}
          id="navbarContent"
        >
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-3 text-center">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={handleCloseMenu}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/courses"
                onClick={handleCloseMenu}
              >
                Courses
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/jobs" onClick={handleCloseMenu}>
                Job Board
              </Link>
            </li>

            {/* Solutions For */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="solutionsDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Solutions
              </a>
              <ul
                className="dropdown-menu text-center"
                aria-labelledby="solutionsDropdown"
              >
                <li>
                  <Link
                    className="dropdown-item"
                    to="/"
                    onClick={handleCloseMenu}
                  >
                    <Person className="me-2" /> For Individuals
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    to="/for-businesses"
                    onClick={handleCloseMenu}
                  >
                    <Briefcase className="me-2" /> For Businesses
                  </Link>
                </li>
                <hr className="dropdown-divider" />
                <li>
                  <Link
                    className="dropdown-item"
                    to="/for-universities"
                    onClick={handleCloseMenu}
                  >
                    <Mortarboard className="me-2" /> For Universities
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    to="/for-secondary-schools"
                    onClick={handleCloseMenu}
                  >
                    <Building className="me-2" /> For Schools
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    to="/for-government"
                    onClick={handleCloseMenu}
                  >
                    <Bank className="me-2" /> For Government
                  </Link>
                </li>
              </ul>
            </li>

            {/* More */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="moreDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                More
              </a>
              <ul
                className="dropdown-menu text-center"
                aria-labelledby="moreDropdown"
              >
                <li>
                  <Link
                    className="dropdown-item"
                    to="/about"
                    onClick={handleCloseMenu}
                  >
                    <InfoCircle className="me-2" /> About Us
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    to="/contact"
                    onClick={handleCloseMenu}
                  >
                    <Envelope className="me-2" /> Contact
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    to="/events"
                    onClick={handleCloseMenu}
                  >
                    <CalendarEvent className="me-2" /> Events
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    to="/blog"
                    onClick={handleCloseMenu}
                  >
                    <Newspaper className="me-2" /> Blog
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    to="/become-a-trainer"
                    onClick={handleCloseMenu}
                  >
                    <PersonPlus className="me-2" /> Become a Trainer
                  </Link>
                </li>
              </ul>
            </li>
          </ul>

          {/* Right-side Action Buttons */}
          <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0">
            {currentUser ? (
              <>
                <Link
                  to={getDashboardPath()}
                  className="btn btn-outline-secondary me-2"
                  onClick={handleCloseMenu}
                >
                  Dashboard
                </Link>
                <button className="btn btn-primary" onClick={handleLogout}>
                  logout
                </button>
              </>
            ) : (
              <>
                <Link
                  className="btn btn-outline-primary btn-sm d-flex align-items-center"
                  to="/login"
                >
                  <BoxArrowInRight className="me-1" /> Sign In
                </Link>
                <Link
                  className="btn btn-primary btn-sm d-flex align-items-center"
                  to="/enroll"
                >
                  <RocketTakeoff className="me-1" /> Enroll Now
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
