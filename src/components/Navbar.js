import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import Bootstrap JS for collapse functionality
import '../styles/Navbar.css'; // Ensure this path is correct for your project
import { PersonPlus } from 'react-bootstrap-icons';

const Navbar = () => {
  // Ref to target the collapsible navbar content for programmatic closing
  const navbarCollapseRef = useRef(null);

  // Function to close the mobile navbar if it's open
  const handleCloseMenu = () => {
    if (navbarCollapseRef.current && navbarCollapseRef.current.classList.contains('show')) {
      const bsCollapse = new window.bootstrap.Collapse(navbarCollapseRef.current, {
        toggle: false
      });
      bsCollapse.hide();
    }
  };

  // Add a scroll listener to close the menu when the user scrolls
  useEffect(() => {
    window.addEventListener('scroll', handleCloseMenu);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleCloseMenu);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/" onClick={handleCloseMenu}>
          Taxly <span className="text-dark">Academy</span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent" ref={navbarCollapseRef}>
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            {/* Use NavLink for active styling */}
            <li className="nav-item">
              <NavLink className="nav-link" to="/" onClick={handleCloseMenu}>Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/courses" onClick={handleCloseMenu}>Courses</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/joblistpage" onClick={handleCloseMenu}>Job Board</NavLink>
            </li>
             <li className="nav-item">
              <NavLink className="nav-link" to="/about" onClick={handleCloseMenu}>About</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact" onClick={handleCloseMenu}>Contact</NavLink>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                More
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
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
            <Link to="/login" className="btn btn-outline-secondary me-2 disabled" onClick={handleCloseMenu}>
              Login
            </Link>
            <Link to="/enroll" className="btn btn-primary" onClick={handleCloseMenu}>
              Enroll Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
