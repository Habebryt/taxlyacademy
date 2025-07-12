import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/Contact.css";
import Hero from "../components/Hero";

const Contact = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <>
    <Helmet>
  <title>Contact Us | Taxly Academy</title>
  <meta
    name="description"
    content="Get in touch with the Taxly Academy team for inquiries, support, or partnerships."
  />
  <meta property="og:title" content="Contact Us | Taxly Academy" />
  <meta
    property="og:description"
    content="We’re here to help! Reach out to our support or training teams."
  />
</Helmet>

      <Hero
        backgroundImage="/images/contact-banner.jpg"
        title="Get in Touch"
        subtitle="Have questions or need support? We’re here to help you get started or go further."
        ctaText="" // No CTA button needed
      />

      <section className="contact-section py-5">
        <div className="container">
          <div className="row mb-5">
            <div className="col text-center">
              <h2 data-aos="fade-down">Get in Touch</h2>
              <p className="text-muted" data-aos="fade-up">
                Have questions about our courses, enrollment, or partnerships?
                Reach out and we’ll respond shortly.
              </p>
            </div>
          </div>

          <div className="row">
            {/* Contact Form */}
            <div className="col-md-7" data-aos="fade-right">
              <form>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Your email"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="subject" className="form-label">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="subject"
                    placeholder="e.g. Course Inquiry"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">
                    Message
                  </label>
                  <textarea
                    className="form-control"
                    id="message"
                    rows="5"
                    placeholder="Your message..."
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="col-md-5" data-aos="fade-left">
              <div className="p-4 bg-light rounded shadow-sm h-100">
                <h5>📍 Location</h5>
                <p className="text-muted">Remote-first (HQ: Lagos, Nigeria)</p>

                <h5>📧 Email</h5>
                <p className="text-muted">support@taxlyacademy.com</p>

                <h5>📞 Phone / WhatsApp</h5>
                <p className="text-muted">+234 912 345 6789</p>

                <h5>💼 Partnerships</h5>
                <p className="text-muted">collaborate@taxlyacademy.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
