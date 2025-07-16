import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/About.css'; // You can reuse the same stylesheet or create a new one

// Import icons for a more visual and engaging layout
import { Bullseye, People, Puzzle } from 'react-bootstrap-icons';

const AboutSummary = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section className="about-summary-section py-5">
      <div className="container">
        <div className="row align-items-center">
          {/* Image Column */}
          <div className="col-lg-6" data-aos="fade-right">
            <img
              src="/images/freelance-tax.jpg" // Suggestion: Use a picture of students collaborating or a trainer teaching
              alt="A snapshot of the Taxly Academy community"
              className="img-fluid rounded shadow-lg"
              loading="lazy"
            />
          </div>
          {/* Content Column */}
          <div className="col-lg-6" data-aos="fade-left" data-aos-delay="200">
            <h2 className="display-5 fw-bold mb-3">Empowering Africa's Virtual Workforce</h2>
            <p className="text-muted fs-5 mb-4">
              We are on a mission to bridge the gap between talented African professionals and global remote work opportunities.
            </p>
            
            <div className="d-flex align-items-start mb-3">
              <Bullseye size={24} className="text-primary me-3 flex-shrink-0 mt-1" />
              <div>
                <h5 className="fw-bold mb-1">Practical, Job-Ready Skills</h5>
                <p className="text-muted mb-0">Our courses are designed around the real-world skills employers are looking for right now.</p>
              </div>
            </div>

            <div className="d-flex align-items-start mb-3">
              <People size={24} className="text-primary me-3 flex-shrink-0 mt-1" />
              <div>
                <h5 className="fw-bold mb-1">Built for African Talent</h5>
                <p className="text-muted mb-0">We provide tailored support and mentorship to help you succeed in the global digital economy.</p>
              </div>
            </div>
            
            <div className="d-flex align-items-start mb-4">
              <Puzzle size={24} className="text-primary me-3 flex-shrink-0 mt-1" />
              <div>
                <h5 className="fw-bold mb-1">Free Access to Learning</h5>
                <p className="text-muted mb-0">Enroll in any course for free and only pay for a certificate when you're ready.</p>
              </div>
            </div>

            <Link to="/about" className="btn btn-outline-primary mt-3">
              Learn More About Our Story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSummary;
