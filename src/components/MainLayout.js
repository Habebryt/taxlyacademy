// src/components/MainLayout.js

import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * A smart layout component that conditionally renders the main Navbar and Footer.
 * It checks the URL path to decide which layout to use.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The page component to be rendered.
 */
const MainLayout = ({ children }) => {
  const location = useLocation();

  // Check if the current page is part of the dashboard
  const isDashboardPage = location.pathname.startsWith('/dashboard') || location.pathname.includes('/learn');

  // If it's a dashboard page, we render *only* the page content.
  // The dashboard pages themselves are responsible for their own layout (e.g., DashboardLayout).
  if (isDashboardPage) {
    return <>{children}</>;
  }

  // For all other public-facing pages, wrap them with the main Navbar and Footer.
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default MainLayout;
