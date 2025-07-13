import React, { useEffect, useState, useContext } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/Enroll.css';
import { CurrencyContext } from '../context/CurrencyContext';
// Import useNavigate for programmatic navigation
import { useNavigate } from 'react-router-dom';

const offeredCourses = [
  { id: "executive-assistant-mastery", title: "Executive Assistant Mastery", price: 65000 },
  { id: "customer-success-manager", title: "Customer Success Manager", price: 55000 },
  { id: "social-media-strategy", title: "Social Media Strategy & Management", price: 70000 },
  { id: "paid-traffic-ads-manager", title: "Paid Traffic & Ads Management", price: 90000 },
  { id: "podcast-production-management", title: "Podcast Production & Management", price: 50000 },
  { id: "tech-automations-expert", title: "Tech & Automations Expert", price: 85000 },
  { id: "community-management-pro", title: "Community Management Pro", price: 48000 },
  { id: "content-marketing-manager", title: "Content Marketing Manager", price: 75000 },
  { id: "launch-affiliate-management", title: "Launch & Affiliate Management", price: 95000 },
  { id: "pinterest-marketing-expert", title: "Pinterest Marketing Expert", price: 45000 },
  { id: "professional-copywriting", title: "Professional Copywriting for Web & Email", price: 80000 },
  { id: "unicorn-digital-marketing-assistant", title: "Unicorn Digital Marketing Assistant", price: 120000 },
  { id: "virtual-executive-assistant", title: "Virtual Executive Assistant", price: 60000 },
  { id: "virtual-cfo", title: "Virtual CFO (vCFO)", price: 150000 },
  { id: "compliance-legal-assistant", title: "Compliance & Legal Assistant", price: 75000 },
  { id: "digital-business-assistant", title: "Digital Business Assistant", price: 40000 },
  { id: "sales-crm-assistant", title: "Sales & CRM Assistant", price: 50000 },
  { id: "remote-marketing-assistant", title: "Remote Marketing Assistant", price: 45000 },
];

const Enroll = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    selectedCourseId: '',
    message: ''
  });

  const [courseInfo, setCourseInfo] = useState(null);
  const { symbol, rate } = useContext(CurrencyContext);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    // This component no longer needs to read from localStorage
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'selectedCourseId') {
      const fullCourseInfo = offeredCourses.find(c => c.id === value);
      setCourseInfo(fullCourseInfo);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.selectedCourseId) {
      // FIX: Navigate to checkout with the selected course ID
      navigate(`/checkout?course=${formData.selectedCourseId}`);
    } else {
      alert('Please select a course before submitting.');
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
    <section className="enroll-section py-5 bg-light">
      <div className="container">
        <div className="row mb-5">
          <div className="col text-center">
            <h2 data-aos="fade-down">Enroll in a Course</h2>
            <p className="text-muted" data-aos="fade-up">
              Submit your interest in any of our virtual courses and we’ll guide you through the next steps.
            </p>
          </div>
        </div>

        <div className="row justify-content-center">
            <div className="col-lg-4 mb-4 mb-lg-0" data-aos="fade-right">
                <div className="p-4 shadow-sm rounded bg-white h-100">
                    <h4>Course Details</h4>
                    <hr />
                    {courseInfo ? (
                        <div>
                            <h5 className="text-primary">{courseInfo.title}</h5>
                            <p className="lead fw-bold text-success">
                                {symbol}{displayPrice(courseInfo.price)}
                            </p>
                            <p className="text-muted">
                                Fill out the form to express your interest. We'll contact you with payment details and next steps.
                            </p>
                        </div>
                    ) : (
                        <p className="text-muted">
                            Please select a course from the dropdown menu to see the details here.
                        </p>
                    )}
                </div>
            </div>

            <div className="col-lg-8" data-aos="fade-left">
                <form onSubmit={handleSubmit} className="p-4 shadow-sm rounded bg-white">
                <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input type="text" name="fullName" className="form-control" value={formData.fullName} onChange={handleChange} required placeholder="Your full name" />
                </div>

                <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required placeholder="e.g. you@example.com" />
                </div>

                <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input type="tel" name="phone" className="form-control" value={formData.phone} onChange={handleChange} required placeholder="e.g. +234 812 345 6789" />
                </div>

                <div className="mb-3">
                    <label className="form-label">Select Course</label>
                    <select name="selectedCourseId" className="form-select" value={formData.selectedCourseId} onChange={handleChange} required>
                        <option value="">Choose a course...</option>
                        {offeredCourses.map(course => (
                            <option key={course.id} value={course.id}>
                            {course.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Why do you want to join?</label>
                    <textarea name="message" rows="4" className="form-control" value={formData.message} onChange={handleChange} placeholder="Tell us what you're hoping to achieve"></textarea>
                </div>

                <button type="submit" className="btn btn-primary w-100">
                    Proceed to Checkout
                </button>
                </form>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Enroll;
