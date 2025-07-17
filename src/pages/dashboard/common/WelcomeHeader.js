import React from 'react';
import '../../../../src/styles/Dashboard.css';

const WelcomeHeader = ({ userName }) => {
  return (
    <div className="welcome-header">
      <h2 className="fw-bold mb-0">Welcome back, {userName}!</h2>
      <p className="text-muted">Let's continue making progress on your goals today.</p>
    </div>
  );
};

export default WelcomeHeader;