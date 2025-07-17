import React, { useEffect, useState, useContext } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/Enroll.css";
import { CurrencyContext } from "../context/CurrencyContext";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useFirebase } from "../context/FirebaseContext";
import StatusModal from "../components/common/StatusModal";
import COURSES from "../data/courses";
import Hero from "../components/Hero";

const FreeEnrollmentModal = ({
  courseTitle,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState({ fullName: "", email: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Enroll in {courseTitle} for Free</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={isSubmitting}
            ></button>
          </div>
          <div className="modal-body">
            <p>
              You're about to get free access to all course materials. Please
              confirm your details below.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="modalFullName" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  className="form-control"
                  id="modalFullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="modalEmail" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  id="modalEmail"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Submitting...
                  </>
                ) : (
                  "Confirm Free Enrollment"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const Enroll = () => {
  const { db, auth, appId, authStatus } = useFirebase();
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const { symbol, rate } = useContext(CurrencyContext);
  const navigate = useNavigate();
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);
  const selectedCourse = COURSES.find((c) => c.id === selectedCourseId);
  const calculateCertFee = (priceNgn) => {
    if (!priceNgn || !rate) return "...";
    const fee = (priceNgn / 10) * rate;
    return fee.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  const handleCourseSelection = (e) => setSelectedCourseId(e.target.value);
  const handlePaidEnroll = () => {
    if (selectedCourseId) {
      navigate(`/checkout?course=${selectedCourseId}`);
    } else {
      alert("Please select a course first.");
    }
  };
  const handleFreeEnrollClick = () => {
    if (selectedCourseId) {
      setIsEnrollModalOpen(true);
    } else {
      alert("Please select a course first.");
    }
  };

  const handleFreeEnrollSubmit = async (formData) => {
    if (authStatus !== "success" || !db || !auth.currentUser) {
      setModalContent({
        status: "error",
        title: "Enrollment Failed",
        message:
          "Could not connect to the database. Please refresh the page and try again.",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const userId = auth.currentUser.uid;
      const enrollmentsCollectionRef = collection(db, "freeEnrollments");
      await addDoc(enrollmentsCollectionRef, {
        userId,
        courseId: selectedCourse.id,
        courseTitle: selectedCourse.title,
        fullName: formData.fullName,
        email: formData.email,
        enrolledAt: serverTimestamp(),
      });

      setIsEnrollModalOpen(false);
      setModalContent({
        status: "success",
        title: "Enrollment Successful!",
        message: `You're in! Check your email for access details to the ${selectedCourse.title} course.`,
      });
    } catch (error) {
      setModalContent({
        status: "error",
        title: "Enrollment Failed",
        message:
          "There was an error submitting your enrollment. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseStatusModal = () => {
    if (modalContent?.status === "success") {
      navigate(`/courses/${selectedCourseId}`);
    }
    setModalContent(null);
  };

  return (
    <>
      <Helmet>
        <title>Enroll | Taxly Academy</title>
      </Helmet>
      <Hero
        backgroundImage="/images/enroll-banner.jpg"
        title="Start Your Learning Journey"
        subtitle="Choose a course below and enroll instantly to get started."
      />
      <section className="enroll-section py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div
                className="enroll-form-wrapper p-4 p-md-5 shadow-sm rounded bg-white"
                data-aos="fade-up"
              >
                <div className="mb-4">
                  <label
                    htmlFor="courseSelect"
                    className="form-label fs-5 fw-bold"
                  >
                    1. Select Your Course
                  </label>
                  <select
                    id="courseSelect"
                    name="selectedCourseId"
                    className="form-select form-select-lg"
                    value={selectedCourseId}
                    onChange={handleCourseSelection}
                    required
                  >
                    <option value="">Choose a course...</option>
                    {COURSES.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedCourse && (
                  <div id="enrollment-options" data-aos="fade-in">
                    <p className="fs-5 fw-bold mt-5">
                      2. Choose Your Enrollment Option
                    </p>
                    {/* --- NEW: Disable buttons based on global authStatus --- */}
                    <div className="row">
                      <div className="col-md-6 mb-3 mb-md-0">
                        <div className="option-card card h-100 text-center p-3">
                          <h5 className="fw-bold">Standard Enrollment</h5>
                          <p className="display-6 text-success fw-bold">Free</p>
                          <p className="text-muted small">
                            Full course access, community support, and hands-on
                            projects.
                          </p>
                          <button
                            className="btn btn-success mt-auto"
                            onClick={handleFreeEnrollClick}
                            disabled={authStatus !== "success"}
                          >
                            {authStatus === "pending"
                              ? "Connecting..."
                              : "Start for Free"}
                          </button>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="option-card card h-100 text-center p-3">
                          <h5 className="fw-bold">Certificate Upgrade</h5>
                          <p className="display-6 text-primary fw-bold">
                            {symbol}
                            {calculateCertFee(selectedCourse.price)}
                          </p>
                          <p className="text-muted small">
                            Includes all standard features plus an official,
                            shareable certificate.
                          </p>
                          <button
                            className="btn btn-primary mt-auto"
                            onClick={handlePaidEnroll}
                            disabled={authStatus !== "success"}
                          >
                            {authStatus === "pending"
                              ? "Connecting..."
                              : "Enroll + Get Certificate"}
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
      {/* ... Modals JSX remains the same ... */}
      {isEnrollModalOpen && selectedCourse && (
        <>
          <FreeEnrollmentModal
            courseTitle={selectedCourse.title}
            onClose={() => setIsEnrollModalOpen(false)}
            onSubmit={handleFreeEnrollSubmit}
            isSubmitting={isSubmitting}
          />
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {modalContent && (
        <>
          <StatusModal
            status={modalContent.status}
            title={modalContent.title}
            message={modalContent.message}
            onClose={handleCloseStatusModal}
          />
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </>
  );
};

export default Enroll;
