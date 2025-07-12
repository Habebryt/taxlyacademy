import React, { useEffect, useState, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/Checkout.css'; // You'll want to create this CSS file for specific styling
import { CurrencyContext } from '../context/CurrencyContext';
import { Link } from 'react-router-dom';
import { usePaystackPayment } from 'react-paystack'; // Import Paystack hook

// Define bank account options
const bankAccounts = [
  { bankName: "GTBank PLC", accountName: "Taxly Academy", accountNumber: "0123456789" },
  { bankName: "Kuda Microfinance Bank", accountName: "Taxly Academy", accountNumber: "9876543210" },
  { bankName: "OPay Digital Services", accountName: "Taxly Academy", accountNumber: "5556667778" },
];

// This new component will only be rendered when we have valid course info,
// preventing the Paystack hook from crashing on initial load.
const PaymentForm = ({ courseInfo }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({ fullName: '', email: '' });
  const { symbol, rate } = useContext(CurrencyContext);

  // Paystack Configuration
  const paystackConfig = {
    reference: (new Date()).getTime().toString(),
    email: formData.email,
    amount: courseInfo.price * 100, // Amount in Kobo, guaranteed to be valid here
    publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  // Callbacks for Paystack
  const onSuccess = (reference) => {
    console.log(reference);
    alert(`Payment successful! Your enrollment in "${courseInfo.title}" is confirmed.`);
    localStorage.removeItem('selectedCourse');
    window.location.href = '/';
  };

  const onClose = () => {
    console.log('Payment modal closed');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === 'card') {
      initializePayment(onSuccess, onClose);
    } else {
      alert('Please complete your payment using the bank details provided. Your enrollment will be confirmed upon receipt.');
    }
  };
  
  const displayPrice = (priceNgn) => {
    if (!priceNgn || !rate) return 'N/A';
    const converted = priceNgn * rate;
    return converted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="p-4 shadow-sm rounded bg-white">
      <h4>Payment Details</h4>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="fullName" className="form-label">Full Name</label>
            <input type="text" id="fullName" name="fullName" className="form-control" placeholder="Your full name" value={formData.fullName} onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input type="email" id="email" name="email" className="form-control" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Payment Method</label>
          <div className="d-flex">
            <div className="form-check me-3">
              <input className="form-check-input" type="radio" name="paymentMethod" id="cardPayment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
              <label className="form-check-label" htmlFor="cardPayment">Pay with Card</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="paymentMethod" id="bankTransfer" value="bank" checked={paymentMethod === 'bank'} onChange={() => setPaymentMethod('bank')} />
              <label className="form-check-label" htmlFor="bankTransfer">Bank Transfer</label>
            </div>
          </div>
        </div>

        {paymentMethod === 'bank' && (
          <div id="bank-details" className="alert alert-info">
            <p className="fw-bold">Bank Transfer Instructions</p>
            <p>Please transfer the total amount to any of the following accounts:</p>
            {bankAccounts.map((account, index) => (
              <div key={index} className={index > 0 ? "mt-3" : ""}>
                <ul className="list-unstyled mb-0">
                  <li><strong>Bank:</strong> {account.bankName}</li>
                  <li><strong>Account Name:</strong> {account.accountName}</li>
                  <li><strong>Account Number:</strong> {account.accountNumber}</li>
                </ul>
              </div>
            ))}
            <p className="small mt-3">Use your email address as the payment reference. Your enrollment will be confirmed upon receipt of payment.</p>
          </div>
        )}

        <button type="submit" className="btn btn-success w-100 mt-3 btn-lg">
          {paymentMethod === 'card' ? `Pay ${symbol}${displayPrice(courseInfo.price)} with Paystack` : 'Confirm Enrollment'}
        </button>
      </form>
    </div>
  );
};


const Checkout = () => {
  const [courseInfo, setCourseInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { symbol, rate } = useContext(CurrencyContext);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    const stored = localStorage.getItem('selectedCourse');
    if (stored) {
      try {
        const selected = JSON.parse(stored);
        setCourseInfo(selected);
      } catch (error) {
        console.error("Failed to parse course info from localStorage", error);
      }
    }
    setIsLoading(false);
  }, []);

  const displayPrice = (priceNgn) => {
    if (!priceNgn || !rate) return 'N/A';
    const converted = priceNgn * rate;
    return converted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (isLoading) {
    return (
        <div className="container text-center py-5">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
  }

  if (!courseInfo) {
    return (
      <div className="container text-center py-5">
        <h2 data-aos="fade-down">Your Cart is Empty</h2>
        <p className="text-muted" data-aos="fade-up">Please select a course to enroll in first.</p>
        <Link to="/courses" className="btn btn-primary mt-3" data-aos="fade-up">Browse Courses</Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout | Taxly Academy</title>
        <meta name="description" content="Complete your enrollment and payment for your selected course." />
      </Helmet>

      <section className="checkout-section py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 data-aos="fade-down">Complete Your Enrollment</h2>
            <p className="text-muted" data-aos="fade-up">You're just one step away from starting your new course.</p>
          </div>

          <div className="row">
            <div className="col-lg-5 mb-4 mb-lg-0" data-aos="fade-right">
              <div className="p-4 shadow-sm rounded bg-white h-100">
                <h4>Order Summary</h4>
                <hr />
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fw-bold">{courseInfo.title}</span>
                  <span className="text-muted">{symbol}{displayPrice(courseInfo.price)}</span>
                </div>
                <p className="text-muted small">This single payment gives you full lifetime access to the course materials, community, and live sessions.</p>
                <hr />
                <div className="d-flex justify-content-between align-items-center fw-bold fs-5">
                  <span>Total</span>
                  <span className="text-primary">{symbol}{displayPrice(courseInfo.price)}</span>
                </div>
              </div>
            </div>

            <div className="col-lg-7" data-aos="fade-left">
                {/* Conditionally render the form only when we have courseInfo */}
                <PaymentForm courseInfo={courseInfo} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Checkout;
