import React from 'react';
import '../styles/About.css';
import heroImage from '../assets/hero-image.jpg'; // replace with actual image





const About = () => {
  return (
    <section className="about-section py-5">
      <div className="container">
        <h1 className="section-title text-center mb-4" data-aos="fade-down">
          About Taxly Academy
        </h1>
        <div className="row align-items-center">
          <div className="col-md-6" data-aos="fade-right">
            
            <img src={heroImage} alt="Hero" className="img-fluid hero-image rounded shadow" loading="lazy" />
          </div>
          <div className="col-md-6" data-aos="fade-left">
            <h3>Our Mission</h3>
            <p>
              At Taxly Academy, our mission is to empower Africans with in-demand virtual skills that open doors to remote work opportunities worldwide. We believe in practical, accessible training that prepares learners for real jobs in virtual assistance, finance, compliance, marketing, and more.
            </p>

            <h3>Our Vision</h3>
            <p>
              We envision a future where every African can access quality virtual skills education to thrive in the global digital economy — without geographical or financial barriers.
            </p>

            <h3>Why Choose Taxly Academy?</h3>
            <ul>
              <li>Hands-on, industry-relevant courses tailored for African learners.</li>
              <li>Flexible learning: self-paced with expert support.</li>
              <li>Certification that enhances your resume and credibility.</li>
              <li>Connection to real remote job opportunities.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
