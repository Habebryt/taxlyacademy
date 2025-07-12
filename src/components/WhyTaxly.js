import React from 'react';
import '../styles/WhyTaxly.css';
import { CheckCircleFill } from 'react-bootstrap-icons';

const reasons = [
  {
    title: 'Africa-Focused',
    text: 'We train Africans for global virtual jobs, tailored for emerging markets.',
  },
  {
    title: 'Practical Curriculum',
    text: 'Each course is designed to help you land remote jobs or serve real clients.',
  },
  {
    title: 'Expert Instructors',
    text: 'Learn from professionals with experience supporting foreign companies.',
  },
  {
    title: 'Certificates & Support',
    text: 'Earn certificates, access job tools, and enjoy continued mentoring.',
  },
];

const WhyTaxly = () => {
  return (
    <section className="why-section py-5" id="why-taxly">
      <div className="container text-center">
        <h2 className="section-title" data-aos="fade-up">
          Why Choose <span className="text-primary">Taxly Academy</span>
        </h2>
        <p className="section-subtitle mb-5" data-aos="fade-up" data-aos-delay="100">
          We equip you with the tools to thrive in remote and back-office roles.
        </p>
        <div className="row">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="col-md-6 col-lg-3 mb-4"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="card reason-card h-100 shadow-sm p-3">
                <div className="icon mb-3 text-primary">
                  <CheckCircleFill size={30} />
                </div>
                <h5 className="reason-title">{reason.title}</h5>
                <p className="reason-text">{reason.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyTaxly;
