import React from 'react';
import Sidebar from './Sidebar';
import WelcomeHeader from './WelcomeHeader';
import '../../../../src/styles/Dashboard.css';

/**
 * The main layout component for all dashboard pages.
 * It provides a consistent structure with a sidebar and a content area.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The specific page content to be rendered inside the layout.
 */
const DashboardLayout = ({ children }) => {
  // In a real app, you would get the user's name from your authentication context
  const userName = "Jane Doe"; 

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main-content">
        <WelcomeHeader userName={userName} />
        <div className="dashboard-page-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
