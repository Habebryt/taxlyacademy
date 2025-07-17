import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/PrivacyPolicy.css";
import Hero from "../components/Hero";
import { Envelope } from "react-bootstrap-icons";
import policySections from "../components/common/PolicySections";


const PrivacyPolicy = () => {
  const [activeIndex, setActiveIndex] = useState(0); 

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleSidebarClick = (e, index) => {
    e.preventDefault(); 
    setActiveIndex(index); 

  
    const sectionElement = document.getElementById(
      `section-${policySections[index].id}`
    );
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <>
      <Helmet>
        <title>Privacy Policy | Taxly Academy</title>
        <meta
          name="description"
          content="Understand how Taxly Academy collects, uses, and protects your personal information."
        />
      </Helmet>

      <Hero
        backgroundImage="/images/privacy-banner.jpg" 
        title="Your Privacy Matters to Us"
        subtitle="We are committed to transparency and protecting your data. Here’s how we do it."
        ctaText={null}
      />

      <section className="privacy-policy-section py-5">
        <div className="container">
          <div className="row">
            {/* --- Sticky Navigation Sidebar --- */}
            <div className="col-lg-4 d-none d-lg-block" data-aos="fade-right">
              <div className="sticky-top" style={{ top: "120px" }}>
                <h4 className="fw-bold mb-3">Policy Sections</h4>
                <ul className="list-group">
                  {policySections.map((section, idx) => (
                    // --- FIX: Use the new handler for the onClick event ---
                    <a
                      href={`#section-${section.id}`}
                      key={section.id}
                      className={`list-group-item list-group-item-action ${
                        activeIndex === idx ? "active" : ""
                      }`}
                      onClick={(e) => handleSidebarClick(e, idx)}
                    >
                      {section.icon}{" "}
                      <span className="ms-2">
                        {section.question.split(":")[0]}
                      </span>
                    </a>
                  ))}
                </ul>
              </div>
            </div>

            {/* --- Main Content Accordion --- */}
            <div className="col-lg-8" data-aos="fade-left" data-aos-delay="200">
              <p className="text-muted">
                Last updated:{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <div className="accordion" id="privacyAccordion">
                {policySections.map((section, idx) => {
                  const isActive = activeIndex === idx;
                  return (
                    <div
                      className="accordion-item"
                      key={section.id}
                      id={`section-${section.id}`}
                    >
                      <h2 className="accordion-header" id={`heading${idx}`}>
                        <button
                          className={`accordion-button fw-bold ${
                            !isActive ? "collapsed" : ""
                          }`}
                          type="button"
                          onClick={() => toggleFAQ(idx)}
                        >
                          {section.question}
                        </button>
                      </h2>
                      <div
                        id={`collapse${idx}`}
                        className={`accordion-collapse collapse ${
                          isActive ? "show" : ""
                        }`}
                      >
                        <div className="accordion-body">
                          <div className="summary-box mb-3">
                            <strong>In Plain English:</strong> {section.summary}
                          </div>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: section.details,
                            }}
                          />
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
                  <h5 className="card-title">Have Questions?</h5>
                  <p className="card-text text-muted">
                    If you have any questions or concerns about our policy,
                    please feel free to contact us.
                  </p>
                  <a
                    href="mailto:privacy@academy.taxlyafrica.com"
                    className="btn btn-primary"
                  >
                    Contact Our Privacy Team
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicy;
