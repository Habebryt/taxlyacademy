import React, { useState } from 'react';
import '../styles/FAQ.css';

const faqs = [
  {
    question: 'How long do courses last?',
    answer: 'Courses typically range from 3 to 6 weeks depending on the topic and depth.',
  },
  {
    question: 'Are the courses online?',
    answer: 'Yes, all courses are fully online and accessible anytime from anywhere.',
  },
  {
    question: 'Do you provide certificates?',
    answer: 'Yes, we provide digital certificates upon successful completion of courses.',
  },
  {
    question: 'Can I get a refund?',
    answer: 'Refund requests are handled on a case-by-case basis. Please contact support.',
  },
  {
    question: 'Are there any prerequisites?',
    answer: 'Most courses require only basic computer literacy and internet access.',
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section py-5">
      <div className="container">
        <h2 className="text-center mb-4">Frequently Asked Questions</h2>
        <div className="accordion" id="faqAccordion" role="tablist">
          {faqs.map((faq, idx) => {
            const isActive = activeIndex === idx;
            return (
              <div key={idx} className="accordion-item">
                <h2 className="accordion-header" id={`heading${idx}`}>
                  <button
                    className={`accordion-button ${!isActive ? 'collapsed' : ''}`}
                    type="button"
                    onClick={() => toggleFAQ(idx)}
                    aria-expanded={isActive}
                    aria-controls={`collapse${idx}`}
                    aria-disabled={false}
                  >
                    {faq.question}
                    <span
                      className={`faq-icon ms-2 ${isActive ? 'rotate' : ''}`}
                      aria-hidden="true"
                    >
                      ▼
                    </span>
                  </button>
                </h2>
                <div
                  id={`collapse${idx}`}
                  className={`accordion-collapse collapse ${isActive ? 'show' : ''}`}
                  aria-labelledby={`heading${idx}`}
                  data-bs-parent="#faqAccordion"
                  role="tabpanel"
                  tabIndex={isActive ? 0 : -1}
                >
                  <div className="accordion-body">{faq.answer}</div>
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
