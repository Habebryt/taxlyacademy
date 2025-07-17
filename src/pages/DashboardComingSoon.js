import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import AOS from "aos";
import "aos/dist/aos.css";
import Hero from "../components/Hero";
import { useFirebase } from "../context/FirebaseContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import StatusModal from "../components/common/StatusModal";
import {
  HourglassSplit,
  Trophy,
  Briefcase,
  CollectionPlay,
  Envelope,
  Person,
} from "react-bootstrap-icons";
const CountdownTimer = () => {
  const targetDate = new Date("2026-01-13T00:00:00");
  const calculateTimeLeft = () => {
    const difference = +targetDate - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  return (
    <div className="countdown-timer d-flex justify-content-center gap-3 gap-md-4 my-4">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="timer-unit text-center">
          <div className="timer-value">{value}</div>
          <div className="timer-label">{unit}</div>
        </div>
      ))}
    </div>
  );
};

const DashboardComingSoon = () => {
  const { db, auth, authStatus } = useFirebase();
  const [formData, setFormData] = useState({ fullName: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (authStatus !== "success" || !db || !auth.currentUser) {
      setModalContent({
        status: "error",
        title: "Submission Failed",
        message:
          "Could not connect to our services. Please refresh the page and try again.",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const userId = auth.currentUser.uid;
      const waitlistCollectionRef = collection(
        db,
        `dashboardWaitlist`
      );

      await addDoc(waitlistCollectionRef, {
        userId,
        ...formData,
        submittedAt: serverTimestamp(),
      });

      setModalContent({
        status: "success",
        title: "You're on the Waitlist!",
        message:
          "Thank you for your interest. We will notify you as soon as the dashboard is live.",
      });
      setFormData({ fullName: "", email: "" });
    } catch (error) {
      setModalContent({
        status: "error",
        title: "Submission Failed",
        message:
          "There was an error submitting your request. Please try again.",
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
        <title>Dashboard Coming Soon | Taxly Academy</title>
      </Helmet>
      <Hero
        backgroundImage="/images/dashboard-banner.jpg"
        title="A New Way to Manage Your Learning"
        subtitle="Our all-in-one student and trainer dashboard is currently under development."
      />

      <section className="py-5 text-center">
        <div className="container">
          <HourglassSplit
            size={60}
            className="text-primary mb-3"
            data-aos="zoom-in"
          />
          <h2 className="display-5 fw-bold" data-aos="fade-up">
            Launching in Approximately 180 Days
          </h2>
          <p
            className="lead text-muted"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            We're working hard to bring you a seamless experience. Here's the
            countdown to launch!
          </p>
          <div data-aos="fade-up" data-aos-delay="200">
            <CountdownTimer />
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6" data-aos="fade-right">
              <h2 className="fw-bold mb-3">What to Expect</h2>
              <p className="text-muted">
                Our new dashboard will be your central hub for success at Taxly
                Academy. You'll be able to:
              </p>
              <ul className="list-unstyled feature-list">
                <li className="d-flex align-items-center mb-2">
                  <Trophy size={20} className="text-success me-3" /> Track your
                  course progress and achievements.
                </li>
                <li className="d-flex align-items-center mb-2">
                  <CollectionPlay size={20} className="text-success me-3" />{" "}
                  Access all your course materials and recordings in one place.
                </li>
                <li className="d-flex align-items-center mb-2">
                  <Briefcase size={20} className="text-success me-3" /> Manage
                  your job applications and view recommendations.
                </li>
              </ul>
            </div>
            <div className="col-lg-6" data-aos="fade-left">
              <div className="p-4 p-md-5 bg-white rounded shadow">
                <h3 className="fw-bold mb-4 text-center">Join the Waitlist</h3>
                <p className="text-center text-muted small">
                  Be the first to know when we go live. Sign up for an exclusive
                  notification.
                </p>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="fullName" className="form-label">
                      <Person className="me-2" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      className="form-control"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      <Envelope className="me-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={isSubmitting || authStatus !== "success"}
                  >
                    {isSubmitting ? "Submitting..." : "Notify Me on Launch"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

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

export default DashboardComingSoon;
