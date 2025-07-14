import React, { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/Checkout.css";
import { CurrencyContext } from "../context/CurrencyContext";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { usePaystackPayment } from "react-paystack";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// --- IMPROVEMENT: Import the single source of truth for course data ---
import COURSES from "../data/courses";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const bankAccounts = [
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
  {
    bankName: "Fidelity Bank",
    accountName: "Taxly Africa Limited",
    accountNumber: "5601514348",
  },
];

// --- NEW: Stripe Payment Form Component ---
const StripePaymentForm = ({ courseInfo, paymentConfig, navigate }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [formData, setFormData] = useState({ fullName: "", email: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }
    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        name: formData.fullName,
        email: formData.email,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsProcessing(false);
    } else {
      setErrorMessage("");
      // In a real app, you would send paymentMethod.id to your server
      // to confirm the payment. Here, we'll simulate success.
      console.log("Stripe PaymentMethod:", paymentMethod);
      alert(
        `Payment successful! Your enrollment in "${courseInfo.title}" is confirmed.`
      );
      navigate("/");
    }
  };

  return (
    <div className="p-4 shadow-sm rounded bg-white">
      <h4>Pay with Card (Stripe)</h4>
      <hr />
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
              placeholder="Your full name"
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
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Card Details</label>
          <CardElement className="form-control p-3" />
        </div>
        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}
        <button
          type="submit"
          className="btn btn-success w-100 mt-3 btn-lg"
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? "Processing..." : `Pay ${paymentConfig.displayPrice}`}
        </button>
      </form>
    </div>
  );
};

// --- Paystack Payment Form Component ---
const PaystackPaymentForm = ({ courseInfo, paymentConfig, navigate }) => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [formData, setFormData] = useState({ fullName: "", email: "" });

  const paystackConfig = {
    reference: new Date().getTime().toString(),
    email: formData.email,
    amount: paymentConfig.amount,
    publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
    currency: paymentConfig.currency,
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  const onSuccess = (reference) => {
    console.log(reference);
    alert(
      `Payment successful! Your enrollment in "${courseInfo.title}" is confirmed.`
    );
    navigate("/");
  };

  const onClose = () => {
    console.log("Payment modal closed");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === "card") {
      initializePayment(onSuccess, onClose);
    } else {
      alert(
        "Please complete your payment using the bank details provided. Your enrollment will be confirmed upon receipt."
      );
    }
  };

  return (
    <div className="p-4 shadow-sm rounded bg-white">
      <h4>Payment Details</h4>
      <hr />
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
              placeholder="Your full name"
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
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Payment Method</label>
          <div className="d-flex">
            <div className="form-check me-3">
              <input
                className="form-check-input"
                type="radio"
                name="paymentMethod"
                id="cardPayment"
                value="card"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />
              <label className="form-check-label" htmlFor="cardPayment">
                Pay with Card (Paystack)
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="paymentMethod"
                id="bankTransfer"
                value="bank"
                checked={paymentMethod === "bank"}
                onChange={() => setPaymentMethod("bank")}
              />
              <label className="form-check-label" htmlFor="bankTransfer">
                Bank Transfer
              </label>
            </div>
          </div>
        </div>

        {paymentMethod === "bank" && (
          <div id="bank-details" className="alert alert-info">
            <p className="fw-bold">Bank Transfer Instructions</p>
            {bankAccounts.map((account, index) => (
              <div key={index} className={index > 0 ? "mt-3" : ""}>
                <ul className="list-unstyled mb-0">
                  <li>
                    <strong>Bank:</strong> {account.bankName}
                  </li>
                  <li>
                    <strong>Account Name:</strong> {account.accountName}
                  </li>
                  <li>
                    <strong>Account Number:</strong> {account.accountNumber}
                  </li>
                </ul>
              </div>
            ))}
            <p className="small mt-3">
              Use your email address as the payment reference.
            </p>
          </div>
        )}

        <button type="submit" className="btn btn-success w-100 mt-3 btn-lg">
          {paymentMethod === "bank"
            ? "Confirm Enrollment"
            : `Pay ${paymentConfig.displayPrice} with Paystack`}
        </button>
      </form>
    </div>
  );
};

// --- Main Checkout Component ---
// --- Main Checkout Component (Refactored for Efficiency) ---
const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { symbol, rate, code } = useContext(CurrencyContext); // Get currency context

  // --- IMPROVEMENT: Directly find the course from the centralized data ---
  const courseId = searchParams.get("course");
  const selectedCourse = COURSES.find((c) => c.id === courseId);

  // --- IMPROVEMENT: State is now only for things that change, like payment config ---
  const [paymentConfig, setPaymentConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    // If no course is found from the URL, we don't need to do anything else.
    if (!selectedCourse) {
      setIsLoading(false);
      return;
    }

    const determinePaymentOptions = async () => {
      try {
        const response = await axios.get("http://ip-api.com/json");
        const userCountry = response.data.countryCode;

        // --- IMPROVEMENT: Use the context rate for conversions ---
        // This ensures consistency with the rest of the app.
        const certificateFee = selectedCourse.price / 10;
        const convertedAmount = certificateFee * (rate || 1); // Default to 1 if rate not loaded

        let config = {};
        const europeanCountries = [
          "AT",
          "BE",
          "BG",
          "HR",
          "CY",
          "CZ",
          "DK",
          "EE",
          "FI",
          "FR",
          "DE",
          "GR",
          "HU",
          "IE",
          "IT",
          "LV",
          "LT",
          "LU",
          "MT",
          "NL",
          "PL",
          "PT",
          "RO",
          "SK",
          "SI",
          "ES",
          "SE",
          "GB",
        ];

        if (userCountry === "NG") {
          config = {
            currency: "NGN",
            symbol: "₦",
            amount: Math.round(certificateFee * 100), // Paystack needs kobo
            displayPrice: `₦${certificateFee.toLocaleString()}`,
            gateway: "paystack",
          };
        } else if (europeanCountries.includes(userCountry) && code === "EUR") {
          config = {
            currency: "EUR",
            symbol: "€",
            amount: Math.round(convertedAmount * 100), // Stripe needs cents
            displayPrice: `€${convertedAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            gateway: "stripe",
          };
        } else {
          // Default to USD for all other countries
          config = {
            currency: "USD",
            symbol: "$",
            amount: Math.round(convertedAmount * 100), // Stripe needs cents
            displayPrice: `$${convertedAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            gateway: "stripe",
          };
        }
        setPaymentConfig(config);
      } catch (error) {
        console.error("Failed to fetch location, defaulting to NGN.", error);
        // Default to NGN on error
        setPaymentConfig({
          currency: "NGN",
          symbol: "₦",
          amount: Math.round((selectedCourse.price / 10) * 100),
          displayPrice: `₦${(selectedCourse.price / 10).toLocaleString()}`,
          gateway: "paystack",
        });
      } finally {
        setIsLoading(false);
      }
    };

    determinePaymentOptions();
  }, [searchParams, selectedCourse, rate, code]); // Depend on the derived course and context

  if (isLoading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-muted">
          Detecting your location for pricing...
        </p>
      </div>
    );
  }

  if (!selectedCourse || !paymentConfig) {
    return (
      <div className="container text-center py-5">
        <h2 data-aos="fade-down">No Course Selected</h2>
        <p className="text-muted" data-aos="fade-up">
          Please select a course to enroll in first.
        </p>
        <Link to="/courses" className="btn btn-primary mt-3" data-aos="fade-up">
          Browse Courses
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout | Taxly Academy</title>
        <meta
          name="description"
          content={`Complete your enrollment for the ${selectedCourse.title} course.`}
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
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fw-bold">
                    {selectedCourse.title} (Certificate)
                  </span>
                  <span className="text-muted">
                    {paymentConfig.displayPrice}
                  </span>
                </div>
                <p className="text-muted small">
                  This single payment gives you a lifetime-valid, shareable
                  certificate upon successful completion of the course.
                </p>
                <hr />
                <div className="d-flex justify-content-between align-items-center fw-bold fs-5">
                  <span>Total</span>
                  <span className="text-primary">
                    {paymentConfig.displayPrice}
                  </span>
                </div>
                <p className="text-muted small mt-2 text-end">
                  (Currency detected: {paymentConfig.currency})
                </p>
              </div>
            </div>

            <div className="col-lg-7" data-aos="fade-left">
              {paymentConfig.gateway === "paystack" && (
                <PaystackPaymentForm
                  courseInfo={selectedCourse}
                  paymentConfig={paymentConfig}
                  navigate={navigate}
                />
              )}
              {paymentConfig.gateway === "stripe" && (
                <Elements stripe={stripePromise}>
                  <StripePaymentForm
                    courseInfo={selectedCourse}
                    paymentConfig={paymentConfig}
                    navigate={navigate}
                  />
                </Elements>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Checkout;
