import React, { useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { CurrencyContext } from "../context/CurrencyContext";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../styles/CourseDetail.css";
import Hero from "../components/Hero";

// Import the single source of truth for course data
import COURSES from "../data/courses";

// A new, simple modal component for the free enrollment flow.
const FreeEnrollmentModal = ({ courseTitle, onClose, onSubmit }) => (
  <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Enroll in {courseTitle} for Free</h5>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
        <div className="modal-body">
          <p>You're about to get free access to all course materials. Please confirm your details below.</p>
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label">Full Name</label>
              <input type="text" className="form-control" id="fullName" required />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input type="email" className="form-control" id="email" required />
            </div>
            <button type="submit" className="btn btn-success w-100">Confirm Free Enrollment</button>
          </form>
        </div>
      </div>
    </div>
  </div>
);

const CourseDetail = () => {
  const { id } = useParams();
  const course = Array.isArray(COURSES) ? COURSES.find(c => c.id === id) : null;
  const { symbol, rate } = useContext(CurrencyContext);
  const navigate = useNavigate();
  
  // State to manage the visibility of the free enrollment modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Navigate to checkout for paid certificate enrollment
  const handlePaidEnroll = () => {
    navigate(`/checkout?course=${id}`);
  };

  // Open the modal for free enrollment
  const handleFreeEnrollClick = () => {
    setIsModalOpen(true);
  };

  // Handle the submission of the free enrollment form
  const handleFreeEnrollSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would submit the form data to your backend here.
    setIsModalOpen(false); // Close the modal
    alert(`You have successfully enrolled in ${course.title} for free! Check your email for access details.`);
  };

  if (!course) {
    return (
      <div className="container py-5 text-center">
        <h2>Course Not Found</h2>
        <Link to="/courses" className="btn btn-outline-primary mt-3">
          Go Back to Courses
        </Link>
      </div>
    );
  }

  // Calculate the certificate fee
  const certificateFee = (course.price / 10 * rate).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <>
      <Helmet>
        <title>{course.title} | Taxly Academy</title>
        <meta name="description" content={course.overview} />
      </Helmet>

      <Hero
        backgroundImage="/images/single-course-banner.jpg"
        title={course.title}
        subtitle="Master in-demand skills with our expert-led, hands-on training."
      />

      <section className="course-detail-section py-5">
        <div className="container">
          <div className="row">
            {/* Main Content Column */}
            <div className="col-lg-8">
              <div className="course-content">
                <h2 className="mb-3">Course Overview</h2>
                <p className="lead">{course.overview}</p>
                <h3 className="mt-5">What You'll Learn</h3>
                <ul className="list-unstyled outcome-list">
                  {course.learningOutcomes.map((outcome, idx) => (
                    <li key={idx}>
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      {outcome}
                    </li>
                  ))}
                </ul>
                <h3 className="mt-5">Who Is This Course For?</h3>
                <p>{course.whoIsThisFor}</p>
                <h3 className="mt-5">Career Opportunities</h3>
                <div className="d-flex flex-wrap">
                  {course.careerOpportunities.map((job, idx) => (
                    <span key={idx} className="badge bg-secondary text-dark m-1">{job}</span>
                  ))}
                </div>
                <h3 className="mt-5">Curriculum</h3>
                <div className="accordion" id="curriculumAccordion">
                  {course.curriculum.map((topic, idx) => (
                    <div className="accordion-item" key={idx}>
                      <h2 className="accordion-header" id={`heading${idx}`}>
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${idx}`}>
                          {topic}
                        </button>
                      </h2>
                      <div id={`collapse${idx}`} className="accordion-collapse collapse" data-bs-parent="#curriculumAccordion">
                        <div className="accordion-body">
                          Detailed lesson plans, resources, and assignments for this module will be provided upon course enrollment.
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="col-lg-4">
              <div className="course-sidebar card shadow-sm p-4">
                <h4 className="mb-3">Enrollment Options</h4>
                
                {/* Free Enrollment Option */}
                <div className="border rounded p-3 mb-3 text-center">
                    <h5 className="fw-bold">Standard Enrollment</h5>
                    <p className="display-6 text-success fw-bold">Free</p>
                    <p className="text-muted small">Full course access, community support, and hands-on projects.</p>
                    <button
                        className="btn btn-success btn-lg w-100"
                        onClick={handleFreeEnrollClick}
                    >
                        Start Learning for Free
                    </button>
                </div>

                {/* Paid Certificate Option */}
                <div className="border rounded p-3 text-center">
                    <h5 className="fw-bold">Certificate Upgrade</h5>
                     <p className="display-6 text-primary fw-bold">
                       {symbol}
                       {certificateFee}
                     </p>
                    <p className="text-muted small">Includes all standard features plus an official, shareable certificate upon completion.</p>
                    <button
                      className="btn btn-primary btn-lg w-100"
                      onClick={handlePaidEnroll}
                    >
                      Enroll + Get Certificate
                    </button>
                </div>

                <div className="mt-4">
                  <h5 className="mb-3">All Options Include</h5>
                  <ul className="list-unstyled">
                    <li><i className="bi bi-camera-video me-2"></i>Live expert-led sessions</li>
                    <li><i className="bi bi-file-earmark-text me-2"></i>Hands-on projects</li>
                    <li><i className="bi bi-people me-2"></i>Community support</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Conditionally render the modal and backdrop */}
      {isModalOpen && (
        <>
          <FreeEnrollmentModal 
            courseTitle={course.title}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleFreeEnrollSubmit}
          />
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </>
  );
};

export default CourseDetail;
