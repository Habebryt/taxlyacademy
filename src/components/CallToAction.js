import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/CallToAction.css';
import { RocketTakeoff, Mortarboard } from 'react-bootstrap-icons';
import AOS from 'aos';
import 'aos/dist/aos.css';

const CallToAction = () => {
  React.useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section className="cta-section text-center py-5" data-aos="zoom-in">
      <div className="container">
        <div className="cta-icon-wrapper mb-3">
            <RocketTakeoff size={40} className="text-primary" />
        </div>
        <h2 className="mb-3 fw-bold">Ready to Launch Your Remote Career?</h2>
        <p className="mb-4 lead">
          Our courses are free to enroll. Start learning the skills you need today and <br/> decide about the certificate later.
        </p>
        <div className="d-flex justify-content-center flex-wrap gap-3">
            <Link to="/courses" className="btn btn-primary btn-lg d-flex align-items-center">
                <Mortarboard className="me-2" /> Explore Free Courses
            </Link>
            <Link to="/joblistpage" className="btn btn-outline-secondary btn-lg d-flex align-items-center">
                <RocketTakeoff className="me-2" /> Find a Job
            </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
