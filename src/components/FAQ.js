import React, { useState, useEffect } from 'react';
import '../styles/FAQ.css'; // Ensure this path is correct for your project
import { Plus, Dash } from 'react-bootstrap-icons';
import AOS from 'aos';
import 'aos/dist/aos.css';


const faqs = [
  {
    question: 'Are the courses really free to enroll?',
    answer: 'Yes, absolutely! You can enroll in any of our courses for free. This gives you full access to all video lessons, project materials, and our community channels. You only pay if you decide you want an official, shareable certificate upon completion.',
  },
  {
    question: 'What do I get with the paid certificate?',
    answer: 'The paid certificate is a professional credential that you can add to your LinkedIn profile and resume. It verifies that you have successfully completed all course requirements and projects, demonstrating your skills to potential employers.',
  },
  {
    question: 'Do I have to decide about the certificate when I enroll?',
    answer: 'Not at all! You can enroll for free now and decide to upgrade to the certificate path at any point during the course. The option is always available to you.',
  },
  {
    question: 'What kind of support can I expect in the courses?',
    answer: 'All enrollments, both free and paid, include access to our vibrant student community. Here, you can ask questions, network with peers, and get support from course mentors and instructors.',
  },
  {
    question: 'Are these courses self-paced?',
    answer: 'Our courses are designed with flexibility in mind. While they follow a structured weekly curriculum with live sessions, you can watch recordings and complete assignments at your own pace within the course duration.',
  },
    {
    question: 'What payment methods do you accept for the certificate fee?',
    answer: 'We accept a variety of payment methods depending on your location, including credit/debit cards via Stripe for international students and Paystack or bank transfers for students in Nigeria.',
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  // Initialize AOS for animations
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section py-5">
      <div className="container">
        <div className="text-center mb-5">
            <h2 className="section-title" data-aos="fade-up">Frequently Asked Questions</h2>
            <p className="section-subtitle text-muted" data-aos="fade-up" data-aos-delay="100">
                Have questions? We have answers.
            </p>
        </div>
        
        <div className="accordion" id="faqAccordion">
          {faqs.map((faq, idx) => {
            const isActive = activeIndex === idx;
            return (
              <div className="accordion-item" key={idx} data-aos="fade-up" data-aos-delay={idx * 50}>
                <h2 className="accordion-header" id={`heading${idx}`}>
                  <button
                    className={`accordion-button ${!isActive ? 'collapsed' : ''}`}
                    type="button"
                    onClick={() => toggleFAQ(idx)}
                    aria-expanded={isActive}
                    aria-controls={`collapse${idx}`}
                  >
                    {/* --- IMPROVEMENT: Use icons for a cleaner look --- */}
                    <span className="faq-icon me-3">
                        {isActive ? <Dash size={24} /> : <Plus size={24} />}
                    </span>
                    {faq.question}
                  </button>
                </h2>
                <div
                  id={`collapse${idx}`}
                  className={`accordion-collapse collapse ${isActive ? 'show' : ''}`}
                  aria-labelledby={`heading${idx}`}
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
