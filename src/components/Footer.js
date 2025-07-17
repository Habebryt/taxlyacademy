import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';
import { db, auth, appId } from '../firebase';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Facebook, Twitter, Instagram, Linkedin, Send, CheckCircleFill } from 'react-bootstrap-icons';


const NewsletterSuccessModal = ({ onClose }) => (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-body text-center p-4">
            <CheckCircleFill className="text-success mb-3" size={48} />
            <h5 className="modal-title mb-2">Subscription Successful!</h5>
            <p className="text-muted">Thank you for subscribing. Keep an eye on your inbox for the latest news and course updates.</p>
            <button className="btn btn-primary" onClick={onClose}>
              Awesome!
            </button>
          </div>
        </div>
      </div>
    </div>
);


const Footer = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleNewsletterSubmit = async (e) => {
        e.preventDefault();
        
        if (!db || !auth) {
            setSubmitMessage('Error: Connection to service failed. Please try again later.');
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage('');

        try {
            const userId = auth.currentUser ? auth.currentUser.uid : 'anonymous_subscriber';
            const newsletterCollectionRef = collection(db, `newsletterSubscriptions`);

            await addDoc(newsletterCollectionRef, {
                email: email,
                userId: userId,
                subscribedAt: serverTimestamp()
            });

        
            setEmail(''); 
            setShowSuccessModal(true); 

        } catch (error) {
            
            setSubmitMessage('Could not subscribe at this time. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <footer className="footer bg-dark text-white pt-5 pb-4">
                <div className="container">
                    <div className="row">

                        {/* Column 1: Brand and Newsletter */}
                        <div className="col-lg-4 col-md-6 mb-4">
                            <h5 className="text-uppercase mb-3 fw-bold">
                                Taxly <span className="text-primary">Academy</span>
                            </h5>
                            <p className="text-light">
                                Empowering Africa's next generation of virtual professionals with job-ready skills for the global market.
                            </p>
                            <h6 className="mt-4 mb-3">Stay Updated</h6>
                            <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
                                <div className="input-group">
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        placeholder="Your email address" 
                                        aria-label="Your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                    />
                                    <button className="btn btn-primary" type="submit" id="button-addon2" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        ) : (
                                            <Send />
                                        )}
                                    </button>
                                </div>
                                {/* Display error messages, but not success (modal handles that) */}
                                {submitMessage && (
                                    <div className={`form-text mt-2 text-danger`}>
                                        {submitMessage}
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Column 2: Quick Links */}
                        <div className="col-lg-2 col-md-6 mb-4">
                            <h5 className="text-uppercase mb-3">Explore</h5>
                            <ul className="list-unstyled">
                                <li><Link to="/courses" className="footer-link">Courses</Link></li>
                                <li><Link to="/joblistpage" className="footer-link">Job Board</Link></li>
                                <li><Link to="/about" className="footer-link">About Us</Link></li>
                                <li><Link to="/become-a-trainer" className="footer-link">Become a Trainer</Link></li>
                            </ul>
                        </div>

                        {/* Column 3: Legal & Support */}
                        <div className="col-lg-3 col-md-6 mb-4">
                            <h5 className="text-uppercase mb-3">Support</h5>
                             <ul className="list-unstyled">
                                <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
                                <li><Link to="/faq" className="footer-link">FAQ</Link></li>
                                <li><Link to="/privacy-policy" className="footer-link">Privacy Policy</Link></li>
                                <li><Link to="/terms-of-service" className="footer-link">Terms of Service</Link></li>
                            </ul>
                        </div>

                        {/* Column 4: Social Links */}
                        <div className="col-lg-3 col-md-6 mb-4">
                            <h5 className="text-uppercase mb-3">Follow Us</h5>
                            <p className="text-light">Join our community on social media for the latest updates and tips.</p>
                            <div className="d-flex gap-3">
                                <a href="https://twitter.com/taxlyacademy" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="footer-social-link">
                                    <Twitter size={24} />
                                </a>
                                <a href="https://facebook.com/taxlyacademy" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="footer-social-link">
                                    <Facebook size={24} />
                                </a>
                                <a href="https://instagram.com/taxlyacademy" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="footer-social-link">
                                    <Instagram size={24} />
                                </a>
                                <a href="https://www.linkedin.com/showcase/taxly-africa-academy" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="footer-social-link">
                                    <Linkedin size={24} />
                                </a>
                            </div>
                        </div>

                    </div>

                    <div className="text-center mt-4 border-top border-secondary pt-4">
                        <small className="text-light">&copy; {new Date().getFullYear()} Taxly Academy. A subsidiary of <a href="http://www.taxlyafrica.com" target="_blank" rel="noopener noreferrer" className="footer-link">Taxly Africa</a>. All rights reserved.</small>
                    </div>
                </div>
            </footer>
            
            {/* --- NEW: Conditionally render the success modal and backdrop --- */}
            {showSuccessModal && (
                <>
                    <NewsletterSuccessModal onClose={() => setShowSuccessModal(false)} />
                    <div className="modal-backdrop fade show"></div>
                </>
            )}
        </>
    );
};

export default Footer;
