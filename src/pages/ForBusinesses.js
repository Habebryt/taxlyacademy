import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import AOS from "aos";
import "aos/dist/aos.css";
import Hero from "../components/Hero";
import { Briefcase, People, ArrowRepeat } from "react-bootstrap-icons";
import { useFirebase } from "../context/FirebaseContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import StatusModal from "../components/common/StatusModal";

const ForBusinesses = () => {
  const { db, auth, appId, authStatus } = useFirebase();
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    workEmail: "",
    interest: "I'm interested in hiring graduates",
  });
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
      const inquiriesCollectionRef = collection(db, `businessInquiries`);

      await addDoc(inquiriesCollectionRef, {
        userId,
        ...formData,
        submittedAt: serverTimestamp(),
      });

      setModalContent({
        status: "success",
        title: "Inquiry Sent!",
        message:
          "Thank you for your interest. Our partnerships team will get back to you shortly.",
      });
      setFormData({
        companyName: "",
        contactPerson: "",
        workEmail: "",
        interest: "I'm interested in hiring graduates",
      });
    } catch (error) {
      setModalContent({
        status: "error",
        title: "Submission Failed",
        message: "There was an error sending your inquiry. Please try again.",
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
        <title>For Businesses | Taxly Academy</title>
        <meta
          name="description"
          content="Upskill your team or hire pre-vetted virtual professionals trained by Taxly Academy."
        />
      </Helmet>
      <Hero
        backgroundImage="/images/business-banner.jpg"
        title="Supercharge Your Workforce"
        subtitle="Custom Training and Talent Sourcing for Modern Businesses"
        ctaText={null}
      />
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6" data-aos="fade-right">
              <h2 className="display-5 fw-bold mb-3">
                Stop Searching. Start Building.
              </h2>
              <p className="text-muted fs-5">
                Finding reliable, skilled, and affordable back-office talent is
                one of the biggest challenges for growing businesses. Taxly
                Academy solves this problem by providing a direct pipeline to
                pre-vetted, job-ready virtual professionals trained on the exact
                tools and workflows you use.
              </p>
            </div>
            <div className="col-lg-6" data-aos="fade-left">
              <img
                src="/images/business-team.jpg"
                alt="A professional business team"
                className="img-fluid rounded shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="py-5 bg-light">
        <div className="container text-center">
          <h2 className="section-title" data-aos="fade-up">
            Our Corporate Solutions
          </h2>
          <div className="row">
            <div
              className="col-md-4 mb-4"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="icon-box p-4 h-100">
                <div className="icon-box-icon text-primary mb-3">
                  <People size={40} />
                </div>
                <h4 className="fw-bold">Hire Our Graduates</h4>
                <p>
                  Gain direct access to our pool of certified graduates for
                  roles like Virtual Assistant, Social Media Manager,
                  Bookkeeper, and more.
                </p>
              </div>
            </div>
            <div
              className="col-md-4 mb-4"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="icon-box p-4 h-100">
                <div className="icon-box-icon text-primary mb-3">
                  <ArrowRepeat size={40} />
                </div>
                <h4 className="fw-bold">Upskill Your Team</h4>
                <p>
                  Enroll your existing staff in our specialized courses to boost
                  their productivity and proficiency with modern virtual tools.
                </p>
              </div>
            </div>
            <div
              className="col-md-4 mb-4"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div className="icon-box p-4 h-100">
                <div className="icon-box-icon text-primary mb-3">
                  <Briefcase size={40} />
                </div>
                <h4 className="fw-bold">Custom Training</h4>
                <p>
                  We can develop and deliver bespoke training programs tailored
                  to your company's specific software, workflows, and culture.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5" data-aos="fade-up">
            Partner With Us
          </h2>
          <div className="row justify-content-center">
            <div className="col-lg-8" data-aos="fade-up">
              <div className="p-4 p-md-5 bg-white rounded shadow">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="companyName" className="form-label">
                        Company Name
                      </label>
                      <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        className="form-control"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="contactPerson" className="form-label">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="contactPerson"
                        name="contactPerson"
                        className="form-control"
                        value={formData.contactPerson}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="workEmail" className="form-label">
                      Work Email
                    </label>
                    <input
                      type="email"
                      id="workEmail"
                      name="workEmail"
                      className="form-control"
                      value={formData.workEmail}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="interest" className="form-label">
                      I'm interested in...
                    </label>
                    <select
                      id="interest"
                      name="interest"
                      className="form-select"
                      value={formData.interest}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    >
                      <option>I'm interested in hiring graduates</option>
                      <option>I'm interested in upskilling my team</option>
                      <option>I'm interested in custom training</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={isSubmitting || authStatus !== "success"}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Inquiry"}
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

export default ForBusinesses;
