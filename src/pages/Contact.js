import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/Contact.css"; 
import Hero from "../components/Hero";
import { useFirebase } from '../context/FirebaseContext';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import StatusModal from '../components/common/StatusModal';
import {Envelope, Whatsapp, GeoAlt } from 'react-bootstrap-icons';

const Contact = () => {
  const { db, auth, authStatus } = useFirebase();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (authStatus !== 'success' || !db || !auth.currentUser) {
      setModalContent({
        status: 'error',
        title: 'Submission Failed',
        message: 'Could not connect to our services. Please refresh the page and try again.'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const userId = auth.currentUser.uid;
      const submissionsCollectionRef = collection(db, `contactUsSubmissions`);

      await addDoc(submissionsCollectionRef, {
        userId,
        ...formData,
        submittedAt: serverTimestamp()
      });
      setModalContent({
        status: 'success',
        title: 'Message Sent!',
        message: 'Thank you for reaching out. Our team will get back to you shortly.'
      });
      setFormData({ fullName: '', email: '', subject: '', message: '' });

    } catch (error) {
      setModalContent({
        status: 'error',
        title: 'Submission Failed',
        message: 'There was an error sending your message. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setModalContent(null);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Taxly Academy</title>
        <meta
          name="description"
          content="Get in touch with the Taxly Academy team for inquiries, support, or partnerships. We're here to help you on your journey."
        />
        <meta property="og:title" content="Contact Us | Taxly Academy" />
        <meta
          property="og:description"
          content="We’re here to help! Reach out to our support or training teams."
        />
      </Helmet>

      <Hero
        backgroundImage="/images/contact-banner.jpg"
        title="We'd Love to Hear From You"
        subtitle="Whether you have a question about our courses, partnerships, or anything else, our team is ready to answer all your questions."
      />

      <section className="contact-section py-5">
        <div className="container">
          <div className="row g-5">
            {/* --- Contact Form Column --- */}
            <div className="col-lg-7" data-aos="fade-right">
              <div className="p-4 p-md-5 bg-white rounded shadow-sm">
                <h3 className="fw-bold mb-4">Send us a Message</h3>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="fullName" className="form-label">Full Name</label>
                      <input type="text" className="form-control" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Your full name" required disabled={isSubmitting} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required disabled={isSubmitting} />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="subject" className="form-label">Subject</label>
                    <input type="text" className="form-control" id="subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="e.g., Course Inquiry" required disabled={isSubmitting} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="message" className="form-label">Message</label>
                    <textarea className="form-control" id="message" name="message" rows="5" value={formData.message} onChange={handleChange} placeholder="Your message..." required disabled={isSubmitting}></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg w-100" disabled={isSubmitting || authStatus !== 'success'}>
                    {isSubmitting ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Sending...
                        </>
                    ) : authStatus === 'pending' ? 'Connecting...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>

            {/* --- Contact Info Column --- */}
            <div className="col-lg-5" data-aos="fade-left" data-aos-delay="200">
              <div className="p-4 p-md-5 bg-light rounded shadow-sm h-100">
                <h3 className="fw-bold mb-4">Contact Information</h3>
                <p className="text-muted mb-4">Find us at our headquarters or reach out via our digital channels.</p>
                
                <ul className="list-unstyled contact-info-list">
                  <li className="d-flex align-items-start mb-3">
                    <GeoAlt size={24} className="text-primary me-3 flex-shrink-0 mt-1" />
                    <div>
                      <h6 className="fw-bold mb-0">Our Location</h6>
                      <p className="text-muted mb-0">Remote-first (HQ: Lagos, Nigeria)</p>
                    </div>
                  </li>
                  <li className="d-flex align-items-start mb-3">
                    <Envelope size={24} className="text-primary me-3 flex-shrink-0 mt-1" />
                    <div>
                      <h6 className="fw-bold mb-0">General Inquiries</h6>
                      <a href="mailto:academy@taxlyafrica.com" className="text-muted text-decoration-none">academy@taxlyafrica.com</a>
                    </div>
                  </li>
                  <li className="d-flex align-items-start mb-3">
                    <Whatsapp size={24} className="text-primary me-3 flex-shrink-0 mt-1" />
                    <div>
                      <h6 className="fw-bold mb-0">Phone / WhatsApp</h6>
                      <a href="tel:+2347052152979" className="text-muted text-decoration-none">+234 705 215 2979</a>
                    </div>
                  </li>
                </ul>

                {/* Embedded Map */}
                <div className="mt-4 rounded overflow-hidden">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.376226759714!2d3.379205315343954!3d6.59999999522699!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b9228fa2a1e7f%3A0x8b3259a39f5c3dd5!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2sus!4v1678886456789!5m2!1sen!2sus" 
                        width="100%" 
                        height="250" 
                        style={{ border: 0 }} 
                        allowFullScreen="" 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Lagos, Nigeria Location">
                    </iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- NEW: Conditionally render the status modal --- */}
      {modalContent && (
        <>
          <StatusModal 
            status={modalContent.status}
            title={modalContent.title}
            message={modalContent.message}
            onClose={handleCloseModal}
          />
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </>
  );
};

export default Contact;
