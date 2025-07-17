import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/PrivacyPolicy.css'; 
import Hero from '../components/Hero';
import termsSections from '../components/common/TermsOfService';
import {Envelope } from 'react-bootstrap-icons';


const TermsOfService = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const toggleSection = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  
  const handleSidebarClick = (e, index) => {
    e.preventDefault(); 
    setActiveIndex(index);
    const sectionElement = document.getElementById(`section-${termsSections[index].id}`);
    if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };


  return (
    <>
      <Helmet>
        <title>Terms of Service | Taxly Academy</title>
        <meta name="description" content="Read the Terms of Service for using the Taxly Academy website and enrolling in our courses." />
      </Helmet>

      <Hero
        backgroundImage="/images/terms-banner.jpg"
        title="Terms of Service"
        subtitle="Please read our terms carefully before using our services."
        ctaText={null}
      />

      <section className="privacy-policy-section py-5">
        <div className="container">
          <div className="row">
            {/* --- Sticky Navigation Sidebar --- */}
            <div className="col-lg-4 d-none d-lg-block" data-aos="fade-right">
                <div className="sticky-top" style={{top: '120px'}}>
                    <h4 className="fw-bold mb-3">Service Terms</h4>
                    <ul className="list-group">
                        {termsSections.map((section, idx) => (
                            
                             <a 
                                href={`#section-${section.id}`} 
                                key={section.id} 
                                className={`list-group-item list-group-item-action ${activeIndex === idx ? 'active' : ''}`} 
                                onClick={(e) => handleSidebarClick(e, idx)}
                             >
                                {section.icon} <span className="ms-2">{section.question.split('.')[1].trim()}</span>
                            </a>
                        ))}
                    </ul>
                </div>
            </div>

            {/* --- Main Content Accordion --- */}
            <div className="col-lg-8" data-aos="fade-left" data-aos-delay="200">
                <p className="text-muted">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <div className="accordion" id="termsAccordion">
                {termsSections.map((section, idx) => {
                    const isActive = activeIndex === idx;
                    return (
                    <div className="accordion-item" key={section.id} id={`section-${section.id}`}>
                        <h2 className="accordion-header" id={`heading${idx}`}>
                        <button
                            className={`accordion-button fw-bold ${!isActive ? 'collapsed' : ''}`}
                            type="button"
                            onClick={() => toggleSection(idx)}
                        >
                            {section.question}
                        </button>
                        </h2>
                        <div
                        id={`collapse${idx}`}
                        className={`accordion-collapse collapse ${isActive ? 'show' : ''}`}
                        >
                        <div className="accordion-body">
                            <div className="summary-box mb-3">
                                <strong>Summary:</strong> {section.summary}
                            </div>
                            <div dangerouslySetInnerHTML={{ __html: section.details }} />
                        </div>
                        </div>
                    </div>
                    );
                })}
                </div>

                {/* --- Contact Us Section --- */}
                <div className="card mt-5">
                    <div className="card-body text-center">
                        <Envelope size={32} className="text-primary mb-2" />
                        <h5 className="card-title">Questions About Our Terms?</h5>
                        <p className="card-text text-muted">If you have any questions about these terms, please contact our support team.</p>
                        <a href="mailto:support@aademy.taxlyafrica.com" className="btn btn-primary">Contact Support</a>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TermsOfService;
