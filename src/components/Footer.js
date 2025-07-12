import React from 'react';
import '../styles/Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white pt-5 pb-4">
      <div className="container">
        <div className="row">

          {/* Quick Links */}
          <div className="col-md-4 mb-4">
            <h5 className="text-uppercase mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/courses" className="footer-link">Courses</Link></li>
              <li><Link to="/about" className="footer-link">About</Link></li>
              <li><Link to="/contact" className="footer-link">Contact</Link></li>
              <li><a href="http://www.taxlyafrica.com" className="footer-link">Taxly Africa</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-4 mb-4">
            <h5 className="text-uppercase mb-3">Contact Us</h5>
            <p className="mb-1"><a href="mailto:support@taxlyacademy.com" className="footer-link">academy@taxlyafrica.com</a></p>
            <p className="mb-1"><a href="tel:+1234567890" className="footer-link">+234 7052152979</a></p>
            <p className="mb-0">HQ, Lagos, Nigeria</p>
          </div>

          {/* Social Links */}
          <div className="col-md-4 mb-4">
            <h5 className="text-uppercase mb-3">Follow Us</h5>
            <div className="d-flex gap-3">
              <a href="https://facebook.com/taxlyacademy" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="footer-link fs-5">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://twitter.com/taxlyacademy" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="footer-link fs-5">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="https://instagram.com/taxlyacademy" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="footer-link fs-5">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://www.linkedin.com/showcase/taxly-africa-academy" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="footer-link fs-5">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>

        </div>

        <div className="text-center mt-4 border-top pt-3">
          <small className="text-muted">&copy; {new Date().getFullYear()} Taxly Academy. All rights reserved.</small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
