import React, { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/Checkout.css";
import { CurrencyContext } from "../context/CurrencyContext";
import StatusModal from '../components/common/StatusModal';
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { db, auth, appId } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useFirebase } from "../context/FirebaseContext";
import COURSES from "../data/courses";
import {
  CheckCircleFill,
  XCircleFill,
  InfoCircleFill,
} from "react-bootstrap-icons";
const bankAccounts = {
  NGN: [
    {
      bankName: "GTBank",
      accountName: "Taxly Africa Limited",
      accountNumber: "3001766097",
    },
    {
      bankName: "UBA",
      accountName: "Taxly Africa Limited",
      accountNumber: "1028332283",
    },
  ],
  USD: [
    {
      accountName: "Bright Igiekpemi",
      accountNumber: "219824328705",
      wireRouting: "101019644",
      achRouting: "101019644",
      accountType: "Checking",
      bankAddress: "1801 Main St., Kansas City, MO 64108",
    },
  ],
  GBP: [
    {
      accountName: "Bright Igiekpemi",
      accountNumber: "64548616",
      sortCode: "041307",
      swiftCode: "CLJUGB21XXX",
      iban: "GB29CLJU04130764548616",
      bankName: "Clear Junction Limited",
      bankAddress:
        "4th Floor Imperial House, 15 Kingsway, London, United Kingdom, WC2B 6UN",
    },
  ],
  EUR: [
    {
      accountName: "Bright Igiekpemi",
      accountNumber: "64548616",
      sortCode: "041307",
      swiftCode: "CLJUGB21XXX",
      iban: "GB29CLJU04130764548616",
      bankName: "Clear Junction Limited",
      bankAddress:
        "4th Floor Imperial House, 15 Kingsway, London, United Kingdom, WC2B 6UN",
    },
  ],
};
const saveCertificateEnrollment = async (enrollmentData) => {
  if (!db || !auth.currentUser) {
    throw new Error("Database connection is not available.");
  }
  try {
    const userId = auth.currentUser.uid;
    const certCollectionRef = collection(db, "certificateEnrollments");
    const dataToSave = {
      ...enrollmentData,
      userId,
      paymentStatus: "pending_bank_transfer",
      enrolledAt: serverTimestamp(),
    };
    await addDoc(certCollectionRef, dataToSave);
  } catch (error) {
    throw error;
  }
};

const EnrollmentConfirmationForm = ({
  courseInfo,
  paymentConfig,
  onEnrollmentSuccess,
  onEnrollmentError,
}) => {
  const [formData, setFormData] = useState({ fullName: "", email: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const accountsToShow = bankAccounts[paymentConfig.currency] || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await saveCertificateEnrollment({
        paymentGateway: "Bank Transfer",
        courseId: courseInfo.id,
        courseTitle: courseInfo.title,
        amount: paymentConfig.amount,
        currency: paymentConfig.currency,
        fullName: formData.fullName,
        email: formData.email,
      });
      onEnrollmentSuccess();
    } catch (dbError) {
      onEnrollmentError();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 shadow-sm rounded bg-white">
      <h4>Confirm with Bank Transfer</h4>
      <hr />
      <div id="bank-details" className="alert alert-info">
        <p className="fw-bold">
          Bank Transfer Instructions ({paymentConfig.currency})
        </p>
        {accountsToShow.map((account, index) => (
          <div key={index} className={index > 0 ? "mt-3" : ""}>
            <ul className="list-unstyled mb-0 small">
              {account.bankName && (
                <li>
                  <strong>Bank:</strong> {account.bankName}
                </li>
              )}
              <li>
                <strong>Account Name:</strong> {account.accountName}
              </li>
              <li>
                <strong>Account Number:</strong> {account.accountNumber}
              </li>
              {account.sortCode && (
                <li>
                  <strong>Sort Code:</strong> {account.sortCode}
                </li>
              )}
              {account.iban && (
                <li>
                  <strong>IBAN:</strong> {account.iban}
                </li>
              )}
              {account.swiftCode && (
                <li>
                  <strong>SWIFT/BIC:</strong> {account.swiftCode}
                </li>
              )}
              {account.bankAddress && (
                <li>
                  <strong>Bank Address:</strong> {account.bankAddress}
                </li>
              )}
            </ul>
          </div>
        ))}
        <p className="small mt-3">
          Please use your email address as the payment reference.
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="fullName" className="form-label">
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
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="email" className="form-label">
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
            />
          </div>
        </div>
        <div className="alert alert-warning small">
          <p className="mb-1">
            By clicking confirm, your spot will be reserved. Your enrollment
            will be fully activated once your payment is confirmed by our team.
          </p>
          <p className="mb-0 fw-bold">
            If you do not receive a confirmation email within 48 hours of
            payment, please contact our support team.
          </p>
        </div>
        <button
          type="submit"
          className="btn btn-primary w-100 mt-3 btn-lg"
          disabled={isProcessing}
        >
          {isProcessing
            ? "Saving Enrollment..."
            : `Confirm Enrollment for ${paymentConfig.displayPrice}`}
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
  const { authStatus } = useFirebase();

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
    let certificateFee = selectedCourse.price / 10;
    let processingFee = 0;

    // --- NEW: Add processing fee for non-NGN currencies ---
    if (code !== "NGN") {
      if (code === "USD") processingFee = 2;
      if (code === "GBP") processingFee = 2;
      if (code === "EUR") processingFee = 2;
    }

    const totalAmount = certificateFee * rate + processingFee;

    const config = {
      currency: code,
      symbol: symbol,
      amount: totalAmount, // This is the final amount including fees
      displayPrice: `${symbol}${totalAmount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      processingFee:
        processingFee > 0 ? `${symbol}${processingFee.toFixed(2)}` : null,
    };

    setPaymentConfig(config);
    setIsLoading(false);
  }, [courseId, rate, code, symbol, selectedCourse]);

  const handleEnrollmentSuccess = () => {
    setModalContent({
      status: "success",
      title: "Enrollment Confirmed!",
      message: `Your spot for the ${selectedCourse.title} certificate is reserved. Please check your email for payment instructions.`,
    });
  };
  const handleEnrollmentError = () => {
    setModalContent({
      status: "error",
      title: "Oh no!",
      message:
        "We had trouble recording your enrollment. Please try again or contact support.",
    });
  };
  const handleCloseModal = () => {
    if (modalContent?.status === "success" && selectedCourse) {
      navigate(`/courses/${selectedCourse.id}`);
    }
    setModalContent(null);
  };

  if (isLoading) {
    /* ... loading UI ... */
  }
  if (!selectedCourse) {
    /* ... no course UI ... */
  }

  return (
    <>
      <Helmet>
        <title>Checkout | Taxly Academy</title>
        <meta
          name="description"
          content={`Complete your certificate enrollment for the ${selectedCourse.title} course.`}
        />
      </Helmet>
      <section className="checkout-section py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 data-aos="fade-down">Complete Your Enrollment</h2>
            <p className="text-muted" data-aos="fade-up">
              You're one step away from getting your certificate for the{" "}
              <strong>{selectedCourse.title}</strong> course.
            </p>
          </div>
          <div className="row">
            <div className="col-lg-5 mb-4 mb-lg-0" data-aos="fade-right">
              <div className="p-4 shadow-sm rounded bg-white h-100">
                <h4>Order Summary</h4>
                <hr />
                <div className="d-flex justify-content-between align-items-center">
                  <span>{selectedCourse.title} (Certificate)</span>
                  <span className="text-muted">
                    {paymentConfig &&
                      `${symbol}${(
                        paymentConfig.amount -
                        (paymentConfig.processingFee
                          ? parseFloat(
                              paymentConfig.processingFee.replace(symbol, "")
                            )
                          : 0)
                      ).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`}
                  </span>
                </div>
                {/* --- NEW: Display processing fee if applicable --- */}
                {paymentConfig && paymentConfig.processingFee && (
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <span>Processing Fee</span>
                    <span className="text-muted">
                      {paymentConfig.processingFee}
                    </span>
                  </div>
                )}
                <hr />
                <div className="d-flex justify-content-between align-items-center fw-bold fs-5">
                  <span>Total</span>
                  <span className="text-primary">
                    {paymentConfig && paymentConfig.displayPrice}
                  </span>
                </div>
                <p className="text-muted small mt-2 text-end">
                  (Currency: {paymentConfig && paymentConfig.currency})
                </p>
              </div>
            </div>
            <div className="col-lg-7" data-aos="fade-left">
              {authStatus === "pending" || !paymentConfig ? (
                <div className="p-4 text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted">
                    Preparing secure enrollment form...
                  </p>
                </div>
              ) : authStatus === "failed" ? (
                <div className="alert alert-danger">
                  Could not connect to enrollment services. Please refresh and
                  try again.
                </div>
              ) : (
                <>
                  {/* --- NEW: Informational alerts --- */}
                  {paymentConfig.currency !== "NGN" && (
                    <div className="alert alert-info d-flex align-items-center small mb-3">
                      <InfoCircleFill className="me-2" />A small processing fee
                      has been added for international transactions.
                    </div>
                  )}
                  <div className="alert alert-secondary small">
                    <InfoCircleFill className="me-2" />
                    Payment automation is coming soon! For now, please use the
                    bank transfer details below to complete your payment.
                  </div>
                  <EnrollmentConfirmationForm
                    courseInfo={selectedCourse}
                    paymentConfig={paymentConfig}
                    onEnrollmentSuccess={handleEnrollmentSuccess}
                    onEnrollmentError={handleEnrollmentError}
                  />
                </>
              )}
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

export default Checkout;
