import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/TopBar.css'; // Create this new CSS file

// Import icons for the links
import { Telephone, Envelope, PersonPlus } from 'react-bootstrap-icons';

const TopBar = () => {
  return (
    <div className="top-bar bg-dark text-white">
      <div className="container d-flex justify-content-between align-items-center">
        {/* Left Side: Contact Info */}
        <div className="d-none d-md-flex gap-3">
          <a href="tel:+2347052152979" className="top-bar-link">
            <Telephone size={14} className="me-2" />
            +234 705 215 2979
          </a>
          <a href="mailto:academy@taxlyafrica.com" className="top-bar-link">
            <Envelope size={14} className="me-2" />
            academy@taxlyafrica.com
          </a>
        </div>

        {/* Right Side: Quick Links */}
        <div className="d-flex ms-auto">
          <ul className="navbar-nav flex-row">
            <li className="nav-item">
              <Link className="top-bar-link px-2" to="/for-businesses">For Businesses</Link>
            </li>
            <li className="nav-item">
               <span className="text-muted d-none d-md-inline">|</span>
            </li>
            <li className="nav-item">
              <Link className="top-bar-link px-2" to="/for-government">For Government</Link>
            </li>
             <li className="nav-item">
               <span className="text-muted d-none d-md-inline">|</span>
            </li>
            <li className="nav-item">
              <Link className="top-bar-link ps-2 pe-0" to="/for-schools">
                <PersonPlus size={16} className="me-1" /> For Schools
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
