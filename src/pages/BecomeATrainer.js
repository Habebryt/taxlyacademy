import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/BecomeATrainer.css"; // You can create this new CSS file for specific styles
import Hero from "../components/Hero";

// --- NEW: Import Firebase modules ---
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

// --- IMPROVEMENT: Import the centralized course data ---
import COURSES from '../data/courses';

// Import icons for a more visual layout
import { Easel, People, GraphUp } from 'react-bootstrap-icons';

// --- UPDATED: Firebase Configuration ---
// This now correctly reads the configuration string from your .env file
// and parses it into a JavaScript object. It falls back to an empty object
// to prevent crashing if the .env variable is missing.
const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG || '{}');

// Initialize Firebase services only if the config is valid
let app, db, auth;
if (firebaseConfig.apiKey) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
} else {
  console.error("Firebase config is missing. Please check your .env file and ensure you have restarted the development server.");
}


const BecomeATrainer = () => {
  // --- UPDATED: State management for the application form ---
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    linkedin: '',
    portfolio: '',
    expertise: '',
    otherExpertise: '',
    experienceYears: '',
    teachingExperience: '',
    message: '',
    cvLink: '', // Replaced file upload with a link
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    // Authenticate the user when the component mounts
    const authenticateUser = async () => {
        // Ensure auth is initialized before trying to sign in
        if (auth) {
            try {
                // For a local environment, we'll sign in the user anonymously
                // to get the necessary permissions to write to the database.
                await signInAnonymously(auth);
            } catch (error) {
                console.error("Anonymous authentication failed:", error);
            }
        }
    };
    authenticateUser();
  }, []);

  // Handler for form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newState = { ...prev, [name]: value };
      if (name === 'expertise' && value !== 'other') {
        newState.otherExpertise = '';
      }
      return newState;
    });
  };

  // --- UPDATED: Handler for form submission to save data to Firestore ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent submission if Firebase isn't configured
    if (!db || !auth.currentUser) {
        setSubmitMessage('Error: Application service is not configured correctly. Please check the console.');
        return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
        const userId = auth.currentUser.uid;
        // Define the path to your new Firestore collection
        const applicationsCollectionRef = collection(db, "trainerApplications");

        // Prepare the data object for submission
        const dataToSubmit = {
            userId: userId,
            fullName: formData.fullName,
            email: formData.email,
            linkedin: formData.linkedin,
            portfolio: formData.portfolio,
            expertise: formData.expertise === 'other' ? formData.otherExpertise : formData.expertise,
            experienceYears: formData.experienceYears,
            teachingExperience: formData.teachingExperience,
            message: formData.message,
            cvLink: formData.cvLink, // Save the link to the CV
            submittedAt: serverTimestamp()
        };

        await addDoc(applicationsCollectionRef, dataToSubmit);

        console.log("Successfully saved trainer application to Firestore.");
        setSubmitMessage('Thank you for your application! Our team will review your profile and get in touch if there is a good fit.');
        
        // Reset form state after successful submission
        setFormData({ 
            fullName: '', email: '', linkedin: '', portfolio: '', 
            expertise: '', otherExpertise: '', experienceYears: '', 
            teachingExperience: '', message: '', cvLink: '' 
        });

    } catch (error) {
        console.error("Error writing document to Firestore: ", error);
        setSubmitMessage('There was an error submitting your application. Please try again.');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Become a Trainer | Taxly Academy</title>
        <meta
          name="description"
          content="Partner with Taxly Academy to train the next generation of virtual professionals in Africa. Apply to become a trainer today."
        />
      </Helmet>

      <Hero
        backgroundImage="/images/becomeatrainer.jpg"
        title="Share Your Expertise. Shape the Future."
        subtitle="Join our mission to empower Africa's next generation of virtual professionals. Become a Taxly Academy Trainer."
      />

      <section className="why-partner-section py-5">
          <div className="container text-center">
              <h2 className="section-title" data-aos="fade-up">Why Partner With Us?</h2>
              <p className="section-subtitle mb-5 text-muted" data-aos="fade-up" data-aos-delay="100">
                  Collaborate with a platform dedicated to quality, impact, and growth.
              </p>
              <div className="row">
                  <div className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="200">
                      <div className="icon-box shadow-sm p-4 h-100">
                          <div className="icon-box-icon text-primary mb-3"><People size={40} /></div>
                          <h4 className="fw-bold">Impact a Generation</h4>
                          <p>Your knowledge will directly empower talented individuals across Africa to secure global remote work opportunities.</p>
                      </div>
                  </div>
                  <div className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="300">
                      <div className="icon-box shadow-sm p-4 h-100">
                          <div className="icon-box-icon text-primary mb-3"><GraphUp size={40} /></div>
                          <h4 className="fw-bold">Grow Your Brand</h4>
                          <p>Position yourself as a thought leader in your field and gain visibility within our growing network of students and corporate partners.</p>
                      </div>
                  </div>
                  <div className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="400">
                      <div className="icon-box shadow-sm p-4 h-100">
                          <div className="icon-box-icon text-primary mb-3"><Easel size={40} /></div>
                          <h4 className="fw-bold">Flexible & Remote</h4>
                          <p>Our training model is built for the virtual world. Teach from anywhere and work with a schedule that fits your lifestyle.</p>
                      </div>
                  </div>
              </div>
          </div>
        </section>

      <section className="application-section py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="p-4 p-md-5 bg-white rounded shadow-lg" data-aos="fade-up">
                <h3 className="fw-bold mb-4 text-center">Trainer Application Form</h3>
                <form onSubmit={handleSubmit}>
                  <h5 className="form-section-title">Personal Information</h5>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="fullName" className="form-label">Full Name</label>
                      <input type="text" className="form-control" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required disabled={isSubmitting} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} required disabled={isSubmitting} />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="linkedin" className="form-label">LinkedIn Profile URL</label>
                      <input type="url" className="form-control" id="linkedin" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/yourprofile" required disabled={isSubmitting} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="portfolio" className="form-label">Portfolio/Website URL (Optional)</label>
                      <input type="url" className="form-control" id="portfolio" name="portfolio" value={formData.portfolio} onChange={handleChange} disabled={isSubmitting} />
                    </div>
                  </div>
                  
                  <h5 className="form-section-title mt-4">Professional Experience</h5>
                  <div className="row align-items-end">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="expertise" className="form-label">Primary Area of Expertise</label>
                      <select className="form-select" id="expertise" name="expertise" value={formData.expertise} onChange={handleChange} required disabled={isSubmitting}>
                        <option value="">Select a course area...</option>
                        {COURSES.map(course => (
                          <option key={course.id} value={course.title}>{course.title}</option>
                        ))}
                        <option value="other">Other (Please specify)</option>
                      </select>
                    </div>
                    
                    {formData.expertise === 'other' && (
                      <div className="col-md-6 mb-3" data-aos="fade-in">
                        <label htmlFor="otherExpertise" className="form-label">Specify Your Expertise</label>
                        <input type="text" className="form-control" id="otherExpertise" name="otherExpertise" value={formData.otherExpertise} onChange={handleChange} required disabled={isSubmitting} />
                      </div>
                    )}
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="experienceYears" className="form-label">Years of Professional Experience</label>
                      <input type="number" className="form-control" id="experienceYears" name="experienceYears" value={formData.experienceYears} onChange={handleChange} placeholder="e.g., 5" required disabled={isSubmitting} />
                    </div>
                    {/* --- UPDATED: CV Link Input --- */}
                    <div className="col-md-6 mb-3">
                        <label htmlFor="cvLink" className="form-label">Link to Your CV/Resume</label>
                        <input type="url" className="form-control" id="cvLink" name="cvLink" value={formData.cvLink} onChange={handleChange} placeholder="e.g., Google Drive, Dropbox link" required disabled={isSubmitting} />
                        <div className="form-text">Please ensure the link is publicly accessible.</div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="teachingExperience" className="form-label">Teaching/Training Experience</label>
                    <textarea className="form-control" id="teachingExperience" name="teachingExperience" rows="3" value={formData.teachingExperience} onChange={handleChange} placeholder="Briefly describe any experience you have in teaching, mentoring, or public speaking." required disabled={isSubmitting}></textarea>
                  </div>

                  <h5 className="form-section-title mt-4">Application Details</h5>
                  <div className="mb-3">
                    <label htmlFor="message" className="form-label">Why do you want to be a trainer at Taxly Academy?</label>
                    <textarea className="form-control" id="message" name="message" rows="5" value={formData.message} onChange={handleChange} placeholder="Tell us what motivates you and what your teaching philosophy is." required disabled={isSubmitting}></textarea>
                  </div>
                  
                  <button type="submit" className="btn btn-primary btn-lg w-100 mt-3" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Submitting...
                        </>
                    ) : (
                        'Submit Application'
                    )}
                  </button>
                  {submitMessage && <div className={`alert mt-3 ${submitMessage.includes('error') ? 'alert-danger' : 'alert-success'}`}>{submitMessage}</div>}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BecomeATrainer;
