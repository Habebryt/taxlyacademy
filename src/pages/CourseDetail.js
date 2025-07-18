import React, { useState, useContext, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { CurrencyContext } from "../context/CurrencyContext";
import { useCourses } from "../context/CourseContext";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../styles/CourseDetail.css";
import Hero from "../components/Hero";
import { useFirebase } from "../context/FirebaseContext";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import {
  CheckCircleFill,
  XCircleFill,
  BoxArrowInRight,
  Easel,
} from "react-bootstrap-icons";

// --- Reusable Modals (can be moved to a separate components file later) ---
const StatusModal = ({ status, title, message, onClose }) => (
  <div
    className="modal fade show"
    style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
    tabIndex="-1"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-body text-center p-4">
          {status === "success" ? (
            <CheckCircleFill className="text-success mb-3" size={48} />
          ) : (
            <XCircleFill className="text-danger mb-3" size={48} />
          )}
          <h5 className="modal-title mb-2">{title}</h5>
          <p className="text-muted">{message}</p>
          <button
            className={`btn ${
              status === "success" ? "btn-primary" : "btn-secondary"
            }`}
            onClick={onClose}
          >
            {/* --- FIX: Updated button text for clarity --- */}
            {status === "success" ? "Go to My Dashboard" : "Close"}
          </button>
        </div>
      </div>
    </div>
  </div>
);

const FreeEnrollmentModal = ({
  courseTitle,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const { auth, db } = useFirebase();
  const [formData, setFormData] = useState({
    fullName: auth.currentUser?.displayName || "",
    email: auth.currentUser?.email || "",
  });

  // --- NEW: Pre-fill full name from user's Firestore profile for better UX ---
  useEffect(() => {
    const fetchUserName = async () => {
        if (auth.currentUser && db) {
            const userDocRef = doc(db, "users", auth.currentUser.uid);
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists() && docSnap.data().fullName) {
                setFormData(prev => ({ ...prev, fullName: docSnap.data().fullName }));
            }
        }
    };
    fetchUserName();
  }, [auth, db]);

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
              Please confirm your details below to get free access to all course
              materials.
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


const CourseDetail = () => {
  const { id } = useParams();
  const { courses, loading } = useCourses();
  
  const course = useMemo(() => courses.find((c) => c.id === id), [id, courses]);
  
  const { db, auth, appId, authStatus, currentUser } = useFirebase();
  const { symbol, rate } = useContext(CurrencyContext);
  const navigate = useNavigate();
  
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (currentUser && db) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          // --- FIX: Correctly call the data() function ---
          setUserRole(docSnap.data().role);
        }
      }
    };
    fetchUserRole();
  }, [currentUser, db]);

  const isLoggedIn = authStatus === "success" && currentUser != null;
  const isTrainerAndOwner =
    userRole === "trainer" && currentUser?.uid === course?.trainerId;

  const handlePaidEnroll = () => {
    if (isLoggedIn) {
      navigate(`/checkout?course=${id}`);
    } else {
      navigate("/login");
    }
  };

  const handleFreeEnrollClick = () => {
    if (isLoggedIn) {
      setIsEnrollModalOpen(true);
    } else {
      navigate("/login");
    }
  };

  const handleFreeEnrollSubmit = async (formData) => {
    if (authStatus !== "success" || !db || !auth.currentUser) {
      setModalContent({ status: "error", title: "Enrollment Failed", message: "Could not connect to the database. Please refresh and try again." });
      return;
    }
    setIsSubmitting(true);
    try {
      const userId = auth.currentUser.uid;
      const enrollmentsCollectionRef = collection(db, "freeEnrollments");
      await addDoc(enrollmentsCollectionRef, {
        userId,
        courseId: course.id,
        courseTitle: course.title,
        fullName: formData.fullName,
        email: formData.email,
        enrolledAt: serverTimestamp(),
      });
      setIsEnrollModalOpen(false);
      setModalContent({ status: "success", title: "Enrollment Successful!", message: `You're in! Check your email for access details to the ${course.title} course.` });
    } catch (error) {
      console.error("Error writing document to Firestore: ", error);
      setModalContent({ status: "error", title: "Enrollment Failed", message: "There was an error submitting your enrollment. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseStatusModal = () => {
    // --- FIX: Redirect to the student dashboard on success ---
    if (modalContent?.status === 'success') {
      navigate('/dashboard/my-courses');
    }
    setModalContent(null);
  };

  if (loading) {
    return <div className="container py-5 text-center">Loading course details...</div>;
  }

  if (!course) {
    return (
      <div className="container py-5 text-center">
        <h2>Course Not Found</h2>
        <p>The course you are looking for may have been moved or does not exist.</p>
        <Link to="/courses" className="btn btn-outline-primary mt-3">
          Go Back to Courses
        </Link>
      </div>
    );
  }

  const certificateFee = ((course.price / 10) * rate).toLocaleString(
    undefined,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );

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
                    <span key={idx} className="badge bg-success text-light m-1">
                      {job}
                    </span>
                  ))}
                </div>
                <h3 className="mt-5">Curriculum</h3>
                <div className="accordion" id="curriculumAccordion">
                  {course.curriculum.map((topic, idx) => (
                    <div className="accordion-item" key={idx}>
                      <h2 className="accordion-header" id={`heading${idx}`}>
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapse${idx}`}
                        >
                          {topic}
                        </button>
                      </h2>
                      <div
                        id={`collapse${idx}`}
                        className="accordion-collapse collapse"
                        data-bs-parent="#curriculumAccordion"
                      >
                        <div className="accordion-body">
                          Detailed lesson plans, resources, and assignments for
                          this module will be provided upon course enrollment.
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div
                className="course-sidebar card shadow-sm p-4 sticky-top"
                style={{ top: "120px" }}
              >
                <h4 className="mb-3">Enrollment Options</h4>
                {isTrainerAndOwner ? (
                    <div className="alert alert-info text-center">
                        <Easel size={24} className="mb-2" />
                        <p className="fw-bold mb-1">You are the instructor of this course.</p>
                        <p className="small mb-0">You can manage this course from your trainer dashboard.</p>
                    </div>
                ) : !isLoggedIn ? (
                    <div className="alert alert-warning text-center">
                        <p className="fw-bold mb-2">You must be logged in to enroll.</p>
                        <Link to="/login" className="btn btn-primary w-100">
                            <BoxArrowInRight className="me-2" /> Login or Register
                        </Link>
                    </div>
                ) : (
                    <>
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
                        <div className="border rounded p-3 text-center">
                          <h5 className="fw-bold">Certificate Upgrade</h5>
                          <p className="display-6 text-primary fw-bold">{symbol}{certificateFee}</p>
                          <p className="text-muted small">Includes all standard features plus an official, shareable certificate.</p>
                          <button
                            className="btn btn-primary btn-lg w-100"
                            onClick={handlePaidEnroll}
                          >
                            Enroll + Get Certificate
                          </button>
                        </div>
                    </>
                )}
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
      {isEnrollModalOpen && (
        <>
          <FreeEnrollmentModal
            courseTitle={course.title}
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

export default CourseDetail;
