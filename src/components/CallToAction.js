import React from 'react';
// Import the Link component for client-side navigation
import { Link } from 'react-router-dom';
import '../styles/CallToAction.css';

const CallToAction = () => {
  return (
    <section className="cta-section text-center py-5" data-aos="zoom-in">
      <div className="container">
        <h2 className="mb-3">Ready to Level Up Your Virtual Skills?</h2>
        <p className="mb-4 lead">Join thousands of learners getting certified and hired worldwide.</p>
        {/* FIX: Use the Link component instead of a standard <a> tag */}
        <Link to="/courses" className="btn btn-primary btn-lg">
          Join Now
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;
