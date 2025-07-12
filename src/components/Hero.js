import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Hero.css';

const Hero = ({
  backgroundImage,
  title = 'Learn the Skills for Remote & Back Office Jobs',
  subtitle = 'Taxly Academy trains Africans for high-demand virtual roles like Compliance Officers, Executive Assistants, Virtual CFOs, and more.',
  ctaText = 'Explore Courses',
  ctaLink = '/courses'
}) => {
  return (
    <section
      className="hero-banner d-flex align-items-center justify-content-center text-white"
      style={{ backgroundImage: `url(${backgroundImage})` }}
      loading="lazy"
      id="hero"
    >
      <div className="overlay"></div>
      <div className="hero-content text-center" data-aos="zoom-in">
        <h1 className="display-4 fw-bold mb-3">{title}</h1>
        <p className="lead mb-4">{subtitle}</p>
        {ctaText && (
          <Link to={ctaLink} className="btn btn-lg btn-primary">
            {ctaText}
          </Link>
        )}
      </div>
    </section>
  );
};

export default Hero;
