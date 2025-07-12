import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/About.css";
import Hero from "../components/Hero";

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <>
      <Helmet>
        <title>About Us | Taxly Academy</title>
        <meta
          name="description"
          content="Learn more about Taxly Academy's mission to train Africa's next generation of virtual professionals."
        />
        <meta property="og:title" content="About Us | Taxly Academy" />
        <meta
          property="og:description"
          content="We empower Africans with virtual and remote job skills."
        />
      </Helmet>

      <Hero
        backgroundImage="/images/about-banner.jpg"
        title="About Taxly Academy"
        subtitle="We are building Africa’s largest talent pool of virtual professionals. Join us."
        ctaText="" // No button will render
      />

      <section className="about-section py-5">
        <div className="container">
          <div className="row align-items-center mb-5">
            <div className="col-md-6" data-aos="fade-right">
              <h2 className="mb-4">About Taxly Academy</h2>
              <p className="text-muted">
                Taxly Academy is Africa’s premier learning platform for training
                back-office and remote professionals. We are committed to
                equipping individuals with practical, job-ready skills that
                enable them to work virtually with companies across the world.
              </p>
              <p className="text-muted">
                Our mission is to democratize access to high-quality,
                skill-based learning for Africans, preparing them for roles such
                as Virtual Assistants, Compliance Officers, Remote CFOs, Legal
                Aides, and more.
              </p>
            </div>
            <div className="col-md-6" data-aos="fade-left">
              <img
                src="/images/ourmission.png"
                alt="About Taxly Academy"
                className="img-fluid"
              />
            </div>
          </div>

          <div className="row text-center" data-aos="fade-up">
            <div className="col-md-4 mb-4">
              <div className="icon-box shadow-sm p-4 border rounded h-100">
                <h4>🎯 Mission</h4>
                <p>
                  Empower African professionals to work virtually, confidently,
                  and globally.
                </p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="icon-box shadow-sm p-4 border rounded h-100">
                <h4>🌍 Vision</h4>
                <p>
                  Become the go-to virtual skills academy for emerging
                  back-office talent in Africa.
                </p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="icon-box shadow-sm p-4 border rounded h-100">
                <h4>💡 Method</h4>
                <p>
                  Live classes, mentorship, projects, and job-readiness
                  simulations built for African realities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
