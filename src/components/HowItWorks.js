import React from 'react';
import '../styles/HowItWorks.css';

const steps = [
  {
    title: "Browse Courses",
    description: "Explore our curated virtual courses designed for remote work and back-office support.",
    icon: "bi bi-search", // Bootstrap icons
  },
  {
    title: "Enroll & Learn",
    description: "Register easily and learn at your own pace with video lessons, quizzes, and assignments.",
    icon: "bi bi-journal-check",
  },
  {
    title: "Get Certified",
    description: "Complete courses and earn certificates to boost your resume and land remote jobs.",
    icon: "bi bi-award",
  },
  {
    title: "Start Working",
    description: "Apply your skills as a freelancer or remote employee with trusted clients across Africa and beyond.",
    icon: "bi bi-briefcase",
  },
];

const HowItWorks = () => {
  return (
    <section className="how-it-works-section py-5" id="how-it-works">
      <div className="container">
        <h2 className="text-center section-title" data-aos="fade-up">How Taxly Academy Works</h2>
        <div className="row text-center mt-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="col-md-3 mb-4"
              data-aos="fade-up"
              data-aos-delay={index * 150}
            >
              <div className="step-icon mb-3">
                <i className={step.icon} style={{ fontSize: '3rem', color: '#007bff' }}></i>
              </div>
              <h5>{step.title}</h5>
              <p className="text-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
