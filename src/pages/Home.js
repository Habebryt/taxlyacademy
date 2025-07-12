import React, { useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/Home.css"; // Create this CSS file for custom styles
import Hero from "../components/Hero";
import WhyTaxly from "../components/WhyTaxly";
import FeaturedCourses from "../components/FeaturedCourses";
import Testimonials from "../components/Testimonials";
import HowItWorks from "../components/HowItWorks";
import About from "../components/About";
import Partners from "../components/Partners";
import LatestJobs from "../components/LatestJobs";
import FAQ from "../components/FAQ";

const Home = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <>
     <Helmet>
    <title>Home | Taxly Academy</title>
    <meta
      name="description"
      content="Learn remote and virtual skills for global back-office roles with Taxly Academy."
    />
    <meta property="og:title" content="Home | Taxly Academy" />
    <meta
      property="og:description"
      content="Africa’s #1 platform for virtual and remote professional training."
    />
  </Helmet>;
  
      <Hero backgroundImage="/images/hero-banner.jpg" />
      <About />
      <WhyTaxly />
      <FeaturedCourses />
      <Testimonials />
      <HowItWorks />
      <Partners />
      <LatestJobs />

      {/* Ensure FAQ is included in the Home page */}
      <FAQ />

      {/* Add any additional sections or components here */}
    </>
  );
};

export default Home;
