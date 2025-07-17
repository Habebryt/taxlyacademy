import React from 'react';
import { NavLink, Link } from 'react-router-dom';
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

const Sidebar = () => {
  // --- This is a placeholder for demonstration ---
  // In a real application, you would get the user's role from your authentication context.
  // You can change this value to 'trainer', 'support', or 'corporate' to see the menu change.
  const userRole = 'corporate'; 

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
        <Link to="/" className="sidebar-link logout-link">
          <BoxArrowLeft className="me-2" /> Logout
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
