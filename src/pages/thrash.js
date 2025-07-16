import React, { useEffect, useState, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/Checkout.css';
import { CurrencyContext } from '../context/CurrencyContext';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { usePaystackPayment } from 'react-paystack';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// --- NEW: Import Firebase services from the central file ---
import { db, auth } from '../firebase'; // Assuming firebase.js is in src/
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// --- FIX: Import the useFirebase hook ---
import { useFirebase } from '../context/FirebaseContext';

// --- IMPROVEMENT: Import the single source of truth for course data ---
import COURSES from '../data/courses';

// --- NEW: Import icons for modals ---
import { CheckCircleFill, XCircleFill } from 'react-bootstrap-icons';

// --- REMOVED: The local Firebase initialization is no longer needed here ---

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const bankAccounts = [
  { bankName: "GTBank", accountName: "Taxly Africa Limited", accountNumber: "3001766097" },
  { bankName: "UBA", accountName: "Taxly Africa Limited", accountNumber: "1028332283" },
  { bankName: "Fidelity Bank", accountName: "Taxly Africa Limited", accountNumber: "5601514348" },
];

// --- Helper function to save paid enrollment data to Firestore ---
const savePaidEnrollment = async (enrollmentData) => {
    console.log("Attempting to save paid enrollment...");
    if (!db || !auth.currentUser) {
        console.error("DB connection or authenticated user is not available.");
        throw new Error("Database connection is not available.");
    }
    try {
        const userId = auth.currentUser.uid;
        // --- FIX: Use a simple, direct collection name for consistency ---
        const certCollectionRef = collection(db, "certificateEnrollments");
        
        const dataToSave = {
            ...enrollmentData,
            userId,
            enrolledAt: serverTimestamp()
        };

        console.log("Saving to collection: certificateEnrollments with data:", dataToSave);
        
        await addDoc(certCollectionRef, dataToSave);
        
        console.log("Paid enrollment saved successfully to Firestore.");
    } catch (error) {
        console.error("Error during Firestore write operation:", error);
        throw error;
    }
};

// --- Reusable Status Modal Component ---
const StatusModal = ({ status, title, message, onClose }) => (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-body text-center p-4">
            {status === 'success' ? <CheckCircleFill className="text-success mb-3" size={48} /> : <XCircleFill className="text-danger mb-3" size={48} />}
            <h5 className="modal-title mb-2">{title}</h5>
            <p className="text-muted">{message}</p>
            <button className={`btn ${status === 'success' ? 'btn-primary' : 'btn-secondary'}`} onClick={onClose}>
              {status === 'success' ? 'Go to My Course' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
);

// --- UPDATED: Simplified Payment Form Component for debugging ---
const EnrollmentConfirmationForm = ({ courseInfo, paymentConfig, onEnrollmentSuccess, onEnrollmentError }) => {
  const [formData, setFormData] = useState({ fullName: "", email: "" });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // --- FOCUS ON DB: We save to the database directly, bypassing payment for this test ---
      await savePaidEnrollment({
          paymentId: `manual_confirmation_${new Date().getTime()}`,
          paymentGateway: 'Manual (Payment Pending)',
          courseId: courseInfo.id,
          courseTitle: courseInfo.title,
          amount: paymentConfig.amount / 100,
          currency: paymentConfig.currency,
          fullName: formData.fullName,
          email: formData.email,
      });
      onEnrollmentSuccess(); // Trigger the success modal flow
    } catch (dbError) {
      onEnrollmentError(); // Trigger the error modal flow
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 shadow-sm rounded bg-white">
      <h4>Confirm Your Certificate Enrollment</h4>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="fullName" className="form-label">Full Name</label>
            <input type="text" id="fullName" name="fullName" className="form-control" value={formData.fullName} onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input type="email" id="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
          </div>
        </div>
        <div className="alert alert-info small">
            By clicking confirm, your spot will be reserved. You will receive an email with payment instructions to complete your registration.
        </div>
        <button type="submit" className="btn btn-primary w-100 mt-3 btn-lg" disabled={isProcessing}>
          {isProcessing ? "Saving Enrollment..." : `Confirm Enrollment for ${paymentConfig.displayPrice}`}
        </button>
      </form>
    </div>
  );
};



// --- Main Checkout Component ---
const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { symbol, rate, code } = useContext(CurrencyContext);
  const [paymentConfig, setPaymentConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalContent, setModalContent] = useState(null);
  const { authStatus } = useFirebase(); // Get auth status from central context

  const courseId = searchParams.get("course");
  const selectedCourse = COURSES.find((c) => c.id === courseId);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    if (!selectedCourse || !rate || !code) {
      return;
    }
    setIsLoading(true);
    const certificateFee = selectedCourse.price / 10;
    const convertedAmount = certificateFee * rate;
    
    const config = {
        currency: code,
        symbol: symbol,
        amount: Math.round(convertedAmount * 100),
        displayPrice: `${symbol}${convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    };
    
    setPaymentConfig(config);
    setIsLoading(false);
  }, [courseId, rate, code, symbol, selectedCourse]);

  const handleEnrollmentSuccess = () => {
    console.log("handleEnrollmentSuccess triggered!");
    setModalContent({ status: 'success', title: 'Enrollment Confirmed!', message: `Your spot for the ${selectedCourse.title} certificate is reserved. Please check your email for payment instructions.` });
  };
  const handleEnrollmentError = () => {
    console.log("handleEnrollmentError triggered!");
    setModalContent({ status: 'error', title: 'Oh no!', message: 'We had trouble recording your enrollment. Please try again or contact support.' });
  };
  const handleCloseModal = () => {
    console.log("handleCloseModal triggered!");
    if (modalContent?.status === 'success' && selectedCourse) {
        console.log(`Redirecting to /courses/${selectedCourse.id}`);
        navigate(`/courses/${selectedCourse.id}`);
    }
    setModalContent(null);
  };

  if (isLoading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
        <p className="mt-2 text-muted">Preparing checkout...</p>
      </div>
    );
  }

  if (!selectedCourse) {
    return (
      <div className="container text-center py-5">
        <h2 data-aos="fade-down">No Course Selected</h2>
        <p className="text-muted" data-aos="fade-up">Please select a course to enroll in first.</p>
        <Link to="/courses" className="btn btn-primary mt-3" data-aos="fade-up">Browse Courses</Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout | Taxly Academy</title>
        <meta name="description" content={`Complete your certificate enrollment for the ${selectedCourse.title} course.`} />
      </Helmet>
      <section className="checkout-section py-5 bg-light">
        <div className="container">
            <div className="text-center mb-5">
                <h2 data-aos="fade-down">Complete Your Enrollment</h2>
                <p className="text-muted" data-aos="fade-up">You're one step away from getting your certificate for the <strong>{selectedCourse.title}</strong> course.</p>
            </div>
            <div className="row">
                <div className="col-lg-5 mb-4 mb-lg-0" data-aos="fade-right">
                    <div className="p-4 shadow-sm rounded bg-white h-100">
                        <h4>Order Summary</h4>
                        <hr />
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="fw-bold">{selectedCourse.title} (Certificate)</span>
                            <span className="text-muted">{paymentConfig.displayPrice}</span>
                        </div>
                        <p className="text-muted small">This single payment gives you a lifetime-valid, shareable certificate upon successful completion of the course.</p>
                        <hr />
                        <div className="d-flex justify-content-between align-items-center fw-bold fs-5">
                            <span>Total</span>
                            <span className="text-primary">{paymentConfig.displayPrice}</span>
                        </div>
                        <p className="text-muted small mt-2 text-end">(Currency: {paymentConfig.currency})</p>
                    </div>
                </div>
                <div className="col-lg-7" data-aos="fade-left">
                  {authStatus === 'pending' || !paymentConfig ? (
                    <div className="p-4 text-center">
                        <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
                        <p className="mt-2 text-muted">Preparing secure enrollment form...</p>
                    </div>
                  ) : authStatus === 'failed' ? (
                     <div className="alert alert-danger">Could not connect to enrollment services. Please refresh and try again.</div>
                  ) : (
                    <EnrollmentConfirmationForm 
                        courseInfo={selectedCourse} 
                        paymentConfig={paymentConfig} 
                        onEnrollmentSuccess={handleEnrollmentSuccess} 
                        onEnrollmentError={handleEnrollmentError} 
                    />
                  )}
                </div>
            </div>
        </div>
      </section>
      {modalContent && (
        <>
          <StatusModal status={modalContent.status} title={modalContent.title} message={modalContent.message} onClose={handleCloseModal} />
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </>
  );
};

export default Checkout;
