import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/Home.css";
import Hero from "../components/Hero";
import About from "../components/About";
import WhyTaxly from "../components/WhyTaxly";
import FeaturedCourses from "../components/FeaturedCourses";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import Partners from "../components/Partners";
import LatestJobs from "../components/LatestJobs";
import FAQ from "../components/FAQ";
import CallToAction from "../components/CallToAction";
import UpcomingEventsHome from "../components/UpcomingEventsHome";


const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, 
      once: true,
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
