import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from 'react-router-dom';
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/About.css"; 
import Hero from "../components/Hero";

import {Bullseye, People, Puzzle } from 'react-bootstrap-icons';

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
          content="Learn more about Taxly Academy's mission to train Africa's next generation of virtual professionals, empowering them for global opportunities."
        />
        <meta property="og:title" content="About Us | Taxly Academy" />
        <meta
          property="og:description"
          content="We are building Africa’s largest talent pool of virtual professionals. Join us."
        />
      </Helmet>

      <Hero
        backgroundImage="/images/about-banner.jpg" 
        title="Our Story"
        subtitle="Empowering African Talent for the Global Digital Economy"
      />

      {/* --- Section 1: Our Mission --- */}
      <section className="about-section py-5">
        <div className="container">
          <div className="row align-items-center mb-5">
            <div className="col-lg-6" data-aos="fade-right">
              <h2 className="display-5 fw-bold mb-3">We're on a Mission to Bridge the Talent Gap.</h2>
              <p className="text-muted fs-5">
                Taxly Academy was born from a simple observation: while global companies desperately need skilled back-office professionals, countless talented individuals in Africa are seeking meaningful, remote career opportunities. We exist to connect that talent with that demand.
              </p>
              <p className="text-muted">
                Our mission is to build Africa’s most trusted talent pool of virtual professionals. We do this by providing practical, job-ready training that equips our students to work confidently and competently with companies anywhere in the world.
              </p>
            </div>
            <div className="col-lg-6" data-aos="fade-left" data-aos-delay="200">
              <img
                src="/images/ourmission.png"
                alt="A team collaborating on a project"
                className="img-fluid rounded shadow-lg"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 2: Our Values --- */}
      <section className="values-section py-5 bg-light">
        <div className="container text-center">
            <h2 className="section-title" data-aos="fade-up">What Makes Us Different</h2>
            <p className="section-subtitle mb-5 text-muted" data-aos="fade-up" data-aos-delay="100">
                Our approach is built on three core pillars.
            </p>
            <div className="row">
                <div className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="200">
                    <div className="icon-box shadow-sm p-4 h-100">
                        <div className="icon-box-icon text-primary mb-3"><Bullseye size={40} /></div>
                        <h4 className="fw-bold">Practical, Job-Ready Skills</h4>
                        <p>We don't teach abstract theory. Our curriculum is designed around the real-world tasks and tools you'll use on the job from day one.</p>
                    </div>
                </div>
                <div className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="300">
                    <div className="icon-box shadow-sm p-4 h-100">
                        <div className="icon-box-icon text-primary mb-3"><People size={40} /></div>
                        <h4 className="fw-bold">Built for African Talent</h4>
                        <p>We understand the unique context and opportunities for African professionals and tailor our support, mentorship, and pricing to ensure your success.</p>
                    </div>
                </div>
                <div className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="400">
                    <div className="icon-box shadow-sm p-4 h-100">
                        <div className="icon-box-icon text-primary mb-3"><Puzzle size={40} /></div>
                        <h4 className="fw-bold">Free Access to Learning</h4>
                        <p>We believe financial barriers shouldn't stop you from learning. Enroll in any course for free and only pay for a certificate if you choose to.</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- Section 3: Meet the Founder (Optional but Recommended) --- */}
      <section className="founder-section py-5">
        <div className="container">
            <div className="row align-items-center">
                <div className="col-lg-4 text-center" data-aos="fade-right">
                    <img src="/images/1752706282_img_0.webp" alt="Founder of Taxly Academy" className="img-fluid rounded-circle shadow mb-3" style={{width: '250px', height: '250px', objectFit: 'cover'}} />
                    <h4 className="fw-bold">Igiekpemi Habeeb</h4>
                    <p className="text-muted">Founder, Taxly Academy</p>
                </div>
                <div className="col-lg-8" data-aos="fade-left" data-aos-delay="200">
                    <h2 className="fw-bold">A Message From Our Founder</h2>
                    <p className="fst-italic fs-5 text-muted">"My journey started with a simple goal: to create the opportunities for others that I wished I had when I began my career. I saw incredible, untapped potential across the continent, and I knew that with the right skills, African professionals could compete on a global stage. Taxly Academy is our commitment to making that vision a reality."</p>
                    <p>We are more than just an online school; we are a community dedicated to mutual growth and success. Whether you are starting a new career or leveling up your existing skills, we are here to support you every step of the way. Welcome to the future of work.</p>
                </div>
            </div>
        </div>
      </section>

      {/* --- Section 4: Call to Action --- */}
      <section className="cta-section text-center py-5 bg-primary text-white">
        <div className="container" data-aos="zoom-in">
            <h2 className="mb-3">Ready to Join the Next Generation of Virtual Professionals?</h2>
            <p className="mb-4 lead">Your new career is just one course away. Start learning for free today.</p>
            <Link to="/courses" className="btn btn-light btn-lg fw-bold">
                Explore Our Courses
            </Link>
        </div>
      </section>
    </>
  );
};

export default About;
