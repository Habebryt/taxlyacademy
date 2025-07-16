import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import AOS from "aos";
import "aos/dist/aos.css";

// Assuming you will create a specific CSS file for homepage styles
import "../styles/Home.css";

// Import all the building-block components for the homepage
import Hero from "../components/Hero";
import About from "../components/About"; // This might be a summary component
import WhyTaxly from "../components/WhyTaxly";
import FeaturedCourses from "../components/FeaturedCourses";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import Partners from "../components/Partners";
import LatestJobs from "../components/LatestJobs";
import FAQ from "../components/FAQ";
import CallToAction from "../components/CallToAction";
import UpcomingEventsHome from "../components/UpcomingEventsHome";

/**
 * The main Home page component.
 * This component acts as a container that arranges all the different sections of your landing page.
 */
const Home = () => {
  // Initialize the AOS (Animate On Scroll) library when the component mounts
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
      once: true, // Whether animation should happen only once - while scrolling down
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>Home | Taxly Academy - Learn In-Demand Virtual Skills</title>
        <meta
          name="description"
          content="Join Taxly Academy to learn remote and virtual skills for global back-office roles. Enroll for free and get job-ready."
        />
        <meta property="og:title" content="Home | Taxly Academy" />
        <meta
          property="og:description"
          content="Africa’s #1 platform for virtual and remote professional training. Start your journey today."
        />
      </Helmet>

      {/* The homepage is built by stacking various components in a specific order.
        Each component represents a different section of the page.
      */}
      <Hero backgroundImage="/images/hero-banner.jpg" />
      <About />
      <WhyTaxly />
      <FeaturedCourses />
      <HowItWorks />
      <Testimonials />
      <Partners />
      <LatestJobs />
      <UpcomingEventsHome />

      {/* FAQ and Call to Action sections are typically placed at the bottom of the homepage */}
      <FAQ />
      <CallToAction />
    </>
  );
};

export default Home;
