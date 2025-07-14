import React, { useEffect, useState, useContext } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/Enroll.css'; // Ensure this path is correct
import { CurrencyContext } from '../context/CurrencyContext';
import { useNavigate } from 'react-router-dom';

import COURSES from '../data/courses';

const FreeEnrollmentModal = ({ courseTitle, onClose, onSubmit }) => (
  <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Enroll in {courseTitle} for Free</h5>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
        <div className="modal-body">
          <p>You're about to get free access to all course materials. Please confirm your details below to continue.</p>
          {/* The form submission is handled by the parent component */}
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="modalFullName" className="form-label">Full Name</label>
              <input type="text" className="form-control" id="modalFullName" required />
            </div>
            <div className="mb-3">
              <label htmlFor="modalEmail" className="form-label">Email Address</label>
              <input type="email" className="form-control" id="modalEmail" required />
            </div>
            <button type="submit" className="btn btn-success w-100">Confirm Free Enrollment</button>
          </form>
        </div>
      </div>
    </div>
  </div>
);

const Enroll = () => {
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { symbol, rate } = useContext(CurrencyContext);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);
  
  // --- IMPROVEMENT: Derive the selected course directly from the state and imported data ---
  const selectedCourse = COURSES.find(c => c.id === selectedCourseId);

  const calculateCertFee = (priceNgn) => {
    if (!priceNgn || !rate) return '...';
    const fee = (priceNgn / 10) * rate;
    return fee.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // --- Event Handlers ---
  const handleCourseSelection = (e) => {
    setSelectedCourseId(e.target.value);
  };

  const handlePaidEnroll = () => {
    if (selectedCourseId) {
      navigate(`/checkout?course=${selectedCourseId}`);
    } else {
      alert('Please select a course first.');
    }
  };
  
  const handleFreeEnrollClick = () => {
    if (selectedCourseId) {
      setIsModalOpen(true);
    } else {
      alert('Please select a course first.');
    }
  };

  const handleFreeEnrollSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
    alert(`You have successfully enrolled in ${selectedCourse.title} for free! Check your email for access details.`);
    // In a real app, you might navigate to a "My Courses" page
    // navigate('/my-courses');
  };

  return (
    <>
      <section className="enroll-section py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 data-aos="fade-down">Enroll Today</h2>
            <p className="text-muted" data-aos="fade-up">
              Select a course to begin your journey. All courses are free to enroll.
            </p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="enroll-form-wrapper p-4 p-md-5 shadow-sm rounded bg-white" data-aos="fade-up">
                <div className="mb-4">
                  <label htmlFor="courseSelect" className="form-label fs-5 fw-bold">1. Select Your Course</label>
                  <select id="courseSelect" name="selectedCourseId" className="form-select form-select-lg" value={selectedCourseId} onChange={handleCourseSelection} required>
                    <option value="">Choose a course...</option>
                    {COURSES.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* --- IMPROVEMENT: Show enrollment options only after a course is selected --- */}
                {selectedCourse && (
                  <div id="enrollment-options" data-aos="fade-in">
                    <p className="fs-5 fw-bold mt-5">2. Choose Your Enrollment Option</p>
                    <div className="row">
                      {/* Free Enrollment Option */}
                      <div className="col-md-6 mb-3 mb-md-0">
                        <div className="option-card card h-100 text-center p-3">
                          <h5 className="fw-bold">Standard Enrollment</h5>
                          <p className="display-6 text-success fw-bold">Free</p>
                          <p className="text-muted small">Full course access, community support, and hands-on projects.</p>
                          <button className="btn btn-success mt-auto" onClick={handleFreeEnrollClick}>
                            Start for Free
                          </button>
                        </div>
                      </div>
                      {/* Paid Certificate Option */}
                      <div className="col-md-6">
                        <div className="option-card card h-100 text-center p-3">
                          <h5 className="fw-bold">Certificate Upgrade</h5>
                          <p className="display-6 text-primary fw-bold">
                            {symbol}{calculateCertFee(selectedCourse.price)}
                          </p>
                          <p className="text-muted small">Includes all standard features plus an official, shareable certificate.</p>
                          <button className="btn btn-primary mt-auto" onClick={handlePaidEnroll}>
                            Enroll + Get Certificate
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conditionally render the modal and backdrop */}
      {isModalOpen && selectedCourse && (
        <>
          <FreeEnrollmentModal 
            courseTitle={selectedCourse.title}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleFreeEnrollSubmit}
          />
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </>
  );
};

export default Enroll;
