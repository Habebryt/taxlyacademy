import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import AOS from "aos";
import "aos/dist/aos.css";
import Hero from "../components/Hero";
import { Book, Mortarboard, ShieldCheck } from "react-bootstrap-icons";
import { useFirebase } from "../context/FirebaseContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import StatusModal from "../components/common/StatusModal"; 

const ForSecondarySchools = () => {
  const { db, auth, appId, authStatus } = useFirebase();
  const [formData, setFormData] = useState({
    schoolName: "",
    contactPerson: "",
    schoolEmail: "",
    message: "",
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
      const inquiriesCollectionRef = collection(
        db,
        `schoolInquiries`
      );

      await addDoc(inquiriesCollectionRef, {
        userId,
        ...formData,
        submittedAt: serverTimestamp(),
      });

      setModalContent({
        status: "success",
        title: "Inquiry Sent!",
        message:
          "Thank you for your interest. Our partnerships team will review your inquiry and get back to you shortly.",
      });
      setFormData({
        schoolName: "",
        contactPerson: "",
        schoolEmail: "",
        message: "",
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
        <title>For Secondary Schools | Taxly Academy</title>
        <meta
          name="description"
          content="Prepare your students for the future of work with Taxly Academy's digital skills programs for secondary schools."
        />
      </Helmet>
      <Hero
        backgroundImage="/images/school-banner.jpg"
        title="Prepare Students for the Future, Today"
        subtitle="Introduce Practical Digital and Vocational Skills in Your School"
        ctaText={null}
      />
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6" data-aos="fade-right">
              <h2 className="display-5 fw-bold mb-3">
                Beyond the Traditional Curriculum
              </h2>
              <p className="text-muted fs-5">
                In a world where digital literacy is paramount, it's essential
                to equip students with practical skills that complement their
                academic learning. Taxly Academy offers programs designed
                specifically for secondary school students to give them a head
                start in the digital world.
              </p>
            </div>
            <div className="col-lg-6" data-aos="fade-left">
              <img
                src="/images/teen-students.jpg"
                alt="Young students learning on laptops"
                className="img-fluid rounded shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="py-5 bg-light">
        <div className="container text-center">
          <h2 className="section-title" data-aos="fade-up">
            Our Programs for Schools
          </h2>
          <div className="row">
            <div
              className="col-md-4 mb-4"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="icon-box p-4 h-100">
                <div className="icon-box-icon text-primary mb-3">
                  <Book size={40} />
                </div>
                <h4 className="fw-bold">Digital Literacy Clubs</h4>
                <p>
                  We provide the curriculum and support to help you launch an
                  after-school Digital Skills or Virtual Assistant club.
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
                  <Mortarboard size={40} />
                </div>
                <h4 className="fw-bold">Holiday Bootcamps</h4>
                <p>
                  Offer our intensive, week-long virtual bootcamps during school
                  holidays to teach students valuable vocational skills.
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
                  <ShieldCheck size={40} />
                </div>
                <h4 className="fw-bold">Teacher Training</h4>
                <p>
                  We can train your ICT teachers to deliver our foundational
                  digital skills curriculum directly to your students.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5" data-aos="fade-up">
            Partner With Our Academy
          </h2>
          <div className="row justify-content-center">
            <div className="col-lg-8" data-aos="fade-up">
              <div className="p-4 p-md-5 bg-white rounded shadow">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="schoolName" className="form-label">
                        School Name
                      </label>
                      <input
                        type="text"
                        id="schoolName"
                        name="schoolName"
                        className="form-control"
                        value={formData.schoolName}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="contactPerson" className="form-label">
                        Your Name / Title
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
                    <label htmlFor="schoolEmail" className="form-label">
                      School or Work Email
                    </label>
                    <input
                      type="email"
                      id="schoolEmail"
                      name="schoolEmail"
                      className="form-control"
                      value={formData.schoolEmail}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="message" className="form-label">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      className="form-control"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How would you like to partner with us?"
                      required
                      disabled={isSubmitting}
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={isSubmitting || authStatus !== "success"}
                  >
                    {isSubmitting
                      ? "Submitting..."
                      : "Send Partnership Inquiry"}
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

export default ForSecondarySchools;
