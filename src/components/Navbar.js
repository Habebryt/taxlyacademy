import React, { useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../styles/Navbar.css";
import {
  PersonPlus,
  Person,
  Briefcase,
  Bank,
  Building,
  Mortarboard,
} from "react-bootstrap-icons";

const Navbar = () => {
  const navbarCollapseRef = useRef(null);
  const togglerRef = useRef(null);

  const handleCloseMenu = () => {
    if (
      navbarCollapseRef.current &&
      navbarCollapseRef.current.classList.contains("show")
    ) {
      togglerRef.current.click();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (navbarCollapseRef.current?.classList.contains("show")) {
        handleCloseMenu();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
      <div className="container">
        <Link
          className="navbar-brand fw-bold text-primary"
          to="/"
          onClick={handleCloseMenu}
        >
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

        <div
          className="collapse navbar-collapse"
          id="navbarContent"
          ref={navbarCollapseRef}
        >
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" onClick={handleCloseMenu}>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/courses"
                onClick={handleCloseMenu}
              >
                Courses
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/joblistpage"
                onClick={handleCloseMenu}
              >
                Job Board
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/about"
                onClick={handleCloseMenu}
              >
                About
              </NavLink>
            </li>

            {/* Partnerships Dropdown */}
            <li className="nav-item dropdown">
              <button
                type="button"
                className="nav-link dropdown-toggle btn btn-link"
                id="partnershipsDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Partnerships
              </button>
              <ul
                className="dropdown-menu"
                aria-labelledby="partnershipsDropdown"
              >
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    to="/"
                    onClick={handleCloseMenu}
                  >
                    <Person className="me-2" /> For Individuals
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    to="/for-businesses"
                    onClick={handleCloseMenu}
                  >
                    <Briefcase className="me-2" /> For Businesses
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    to="/for-government"
                    onClick={handleCloseMenu}
                  >
                    <Bank className="me-2" /> For Government
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    to="/for-schools"
                    onClick={handleCloseMenu}
                  >
                    <Building className="me-2" /> For Schools
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    to="/for-universities"
                    onClick={handleCloseMenu}
                  >
                    <Mortarboard className="me-2" /> For Universities
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/contact"
                onClick={handleCloseMenu}
              >
                Contact
              </NavLink>
            </li>

            {/* More Dropdown */}
            <li className="nav-item dropdown">
              <button
                type="button"
                className="nav-link dropdown-toggle btn btn-link"
                id="moreDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                More
              </button>
              <ul className="dropdown-menu" aria-labelledby="moreDropdown">
                <li>
                  <Link
                    className="dropdown-item"
                    to="/events"
                    onClick={handleCloseMenu}
                  >
                    Events
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    to="/blog"
                    onClick={handleCloseMenu}
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    to="/become-a-trainer"
                    onClick={handleCloseMenu}
                  >
                    <PersonPlus className="me-2" /> Become a Trainer
                  </Link>
                </li>
              </ul>
            </li>
          </ul>

          {/* Right-side buttons */}
          <div className="d-flex align-items-center">
            <Link
              to="/login"
              className="btn btn-outline-secondary me-2"
              onClick={handleCloseMenu}
            >
              Login
            </Link>
            <Link
              to="/enroll"
              className="btn btn-primary"
              onClick={handleCloseMenu}
            >
              Enroll Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
