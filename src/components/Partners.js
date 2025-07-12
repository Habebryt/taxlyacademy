import React from 'react';
import '../styles/Partners.css'; // We will create the styles for the marquee here

const partners = [
  '/images/adzuna_logo.svg',
  '/images/reed.svg',
  '/images/jooble-logo.png',
  '/images/the-muse-logo.png',
  '/images/jobicy-official.svg',
  '/images/DevIT.A.png',
  '/images/remote.co-logo.png',
  '/images/remoteok-logo.jpg',
  '/images/we-work-remotely-logo.png',
  '/images/workingnomads-logo.png',
  '/images/indeed-logo.svg.png',
  '/images/Glassdoor_Logo_2023.svg.png',
  '/images/linkedin-svgrepo-com.svg',
  '/images/affirm.png',
  '/images/chewy.png',
];

const Partners = () => {
  return (
    <section className="partners-section py-5 bg-light">
      <div className="container text-center">
        <h2 className="mb-5" data-aos="fade-up">Our Trusted Partners & Job Sources</h2>
        
        {/* The marquee container */}
        <div className="marquee-container" data-aos="fade-up" data-aos-delay="200">
          <div className="marquee-track">
            {/* We render the list of logos twice for a seamless loop */}
            {partners.map((logo, idx) => (
              <div key={`logo-a-${idx}`} className="partner-logo">
                <img src={logo} alt={`Partner ${idx + 1}`} loading="lazy"/>
              </div>
            ))}
            {partners.map((logo, idx) => (
              <div key={`logo-b-${idx}`} className="partner-logo">
                <img src={logo} alt={`Partner ${idx + 1}`} loading="lazy"/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
