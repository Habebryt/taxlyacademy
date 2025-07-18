import React from 'react';
import '../../../../src/styles/Dashboard.css';

/**
 * A component that displays a personalized welcome message in the dashboard.
 * @param {object} props - The component props.
 * @param {string} props.greeting - The time-sensitive greeting (e.g., "Good morning").
 * @param {string} props.userName - The name of the logged-in user.
 * @param {string} props.message - The role-specific welcome message.
 */
const WelcomeHeader = ({ greeting, userName, message }) => {
  return (
    <div className="welcome-header">
      {/* --- FIX: Display the dynamic greeting and user name --- */}
      <h2 className="fw-bold mb-0">{greeting}, {userName}!</h2>
      {/* --- FIX: Display the dynamic, role-based welcome message --- */}
      <p className="text-muted">{message}</p>
    </div>
  );
};

export default WelcomeHeader;
