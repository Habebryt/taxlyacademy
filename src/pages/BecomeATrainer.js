import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/BecomeATrainer.css"; // You can create this new CSS file for specific styles
import Hero from "../components/Hero";

// --- NEW: Import the centralized course data ---
import COURSES from '../data/courses';

// Import icons for a more visual layout
import { Easel, People, GraphUp, PatchCheck } from 'react-bootstrap-icons';

const BecomeATrainer = () => {
  // State management for the application form
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    linkedin: '',
    portfolio: '',
    expertise: '', // This will now hold the value from the dropdown
    otherExpertise: '', // New field for when "Other" is selected
    experienceYears: '',
    teachingExperience: '',
    message: '',
    cv: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // Handler for form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "cv") {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => {
        const newState = { ...prev, [name]: value };
        // If user selects an option other than 'other', clear the otherExpertise field
        if (name === "expertise" && value !== "other") {
          newState.otherExpertise = '';
        }
        return newState;
      });
    }
  };

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    // Prepare the data for submission
    const submissionData = new FormData();
    // Create a copy of formData to avoid mutating state directly
    const dataToSubmit = { ...formData };

    // If 'Other' was selected, use the value from the text input
    if (dataToSubmit.expertise === 'other') {
      dataToSubmit.expertise = dataToSubmit.otherExpertise;
    }
    // Remove the temporary 'otherExpertise' field before submission
    delete dataToSubmit.otherExpertise;

    // Append all final data to the FormData object
    for (const key in dataToSubmit) {
        submissionData.append(key, dataToSubmit[key]);
    }

    console.log("Trainer application submitted:", Object.fromEntries(submissionData.entries()));
    
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage('Thank you for your application! Our team will review your profile and get in touch if there is a good fit.');
      // Reset form state
      setFormData({ 
        fullName: '', email: '', linkedin: '', portfolio: '', 
        expertise: '', otherExpertise: '', experienceYears: '', 
        teachingExperience: '', message: '', cv: null 
      });
      e.target.reset(); // Clear file input
    }, 2000);
  };

  return (
    <>
      <Helmet>
        <title>Become a Trainer | Taxly Academy</title>
        <meta
          name="description"
          content="Partner with Taxly Academy to train the next generation of virtual professionals in Africa. Apply to become a trainer today."
        />
        <meta property="og:title" content="Become a Trainer | Taxly Academy" />
        <meta property="og:description" content="Share your expertise, empower talent, and earn competitive rates as a trainer at Taxly Academy." />
      </Helmet>

      <Hero
        backgroundImage="/images/becomeatrainer.jpg" // Suggestion: Use an image of a person teaching or collaborating
        title="Share Your Expertise. Shape the Future."
        subtitle="Join our mission to empower Africa's next generation of virtual professionals. Become a Taxly Academy Trainer."
      />

      {/* --- Section 1: Why Partner With Us? --- */}
      <section className="why-partner-section py-5">
        {/* ... This section remains the same ... */}
      </section>

      {/* --- Section 2: Application Form --- */}
      <section className="application-section py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="p-4 p-md-5 bg-white rounded shadow-lg" data-aos="fade-up">
                <h3 className="fw-bold mb-4 text-center">Trainer Application Form</h3>
                <form onSubmit={handleSubmit}>
                  {/* Personal Information */}
                  <h5 className="form-section-title">Personal Information</h5>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="fullName" className="form-label">Full Name</label>
                      <input type="text" className="form-control" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="linkedin" className="form-label">LinkedIn Profile URL</label>
                      <input type="url" className="form-control" id="linkedin" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/yourprofile" required />
                    </div>
                     <div className="col-md-6 mb-3">
                      <label htmlFor="portfolio" className="form-label">Portfolio/Website URL (Optional)</label>
                      <input type="url" className="form-control" id="portfolio" name="portfolio" value={formData.portfolio} onChange={handleChange} />
                    </div>
                  </div>
                  
                  {/* Professional Experience */}
                  <h5 className="form-section-title mt-4">Professional Experience</h5>
                   <div className="row align-items-end">
                    {/* --- UPDATED: Expertise Dropdown --- */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="expertise" className="form-label">Primary Area of Expertise</label>
                      <select className="form-select" id="expertise" name="expertise" value={formData.expertise} onChange={handleChange} required>
                        <option value="">Select a course area...</option>
                        {COURSES.map(course => (
                          <option key={course.id} value={course.title}>{course.title}</option>
                        ))}
                        <option value="other">Other (Please specify)</option>
                      </select>
                    </div>
                    
                    {/* --- NEW: Conditional "Other" Input --- */}
                    {formData.expertise === 'other' && (
                      <div className="col-md-6 mb-3" data-aos="fade-in">
                        <label htmlFor="otherExpertise" className="form-label">Specify Your Expertise</label>
                        <input type="text" className="form-control" id="otherExpertise" name="otherExpertise" value={formData.otherExpertise} onChange={handleChange} required />
                      </div>
                    )}
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="experienceYears" className="form-label">Years of Professional Experience</label>
                      <input type="number" className="form-control" id="experienceYears" name="experienceYears" value={formData.experienceYears} onChange={handleChange} placeholder="e.g., 5" required />
                    </div>
                  </div>
                   <div className="mb-3">
                    <label htmlFor="teachingExperience" className="form-label">Teaching/Training Experience</label>
                    <textarea className="form-control" id="teachingExperience" name="teachingExperience" rows="3" value={formData.teachingExperience} onChange={handleChange} placeholder="Briefly describe any experience you have in teaching, mentoring, or public speaking." required></textarea>
                  </div>
                  <div className="mb-3">
                      <label htmlFor="cv" className="form-label">Upload Your CV/Resume</label>
                      <input type="file" className="form-control" id="cv" name="cv" onChange={handleChange} accept=".pdf,.doc,.docx" required />
                      <div className="form-text">Please upload in PDF, DOC, or DOCX format.</div>
                  </div>

                  {/* Application Details */}
                  <h5 className="form-section-title mt-4">Application Details</h5>
                  <div className="mb-3">
                    <label htmlFor="message" className="form-label">Why do you want to be a trainer at Taxly Academy?</label>
                    <textarea className="form-control" id="message" name="message" rows="5" value={formData.message} onChange={handleChange} placeholder="Tell us what motivates you and what your teaching philosophy is." required></textarea>
                  </div>
                  
                  <button type="submit" className="btn btn-primary btn-lg w-100 mt-3" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                  </button>
                  {submitMessage && <div className="alert alert-success mt-3">{submitMessage}</div>}
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
