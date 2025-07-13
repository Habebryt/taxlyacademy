import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CurrencyProvider } from "./context/CurrencyContext";
import CallToAction from './components/CallToAction';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Enroll from './pages/Enroll';
import Checkout from './pages/Checkout';
import JobList from './pages/JobList';
import JobListPage from './pages/JobListPage';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';

// Your Google Analytics Measurement ID
const GA_MEASUREMENT_ID = "G-NGZ7CF0TNG";

function App() {
  const location = useLocation();

  // This useEffect hook listens for route changes and sends a pageview to Google Analytics
  useEffect(() => {
    // Check if the gtag function is available
    if (window.gtag) {
      // Send a pageview event with the new path
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]); // This effect runs every time the location changes

  return (
    <HelmetProvider>
      <CurrencyProvider>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/enroll" element={<Enroll />} />
            <Route path="/checkout" element={<Checkout />}/>
            <Route path="/joblist" element={<JobList />} />
            <Route path="/joblistpage" element={<JobListPage />} />
            {/* Add more routes as needed */}
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            {/* Add more routes as needed */}
          </Routes>
          <CallToAction/>
          <Footer />
        </div>
      </CurrencyProvider>
    </HelmetProvider>
  );
}

export default App;
