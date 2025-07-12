import React from 'react';
import '../styles/Testimonials.css';

const testimonials = [
  {
    name: "Aisha B.",
    role: "Virtual CFO | Lagos",
    feedback: "Taxly Academy gave me the confidence to support real startups with budgeting and compliance. The courses were practical and easy to follow.",
    image: "/images/lagos.jpg",
  },
  {
    name: "Michael T.",
    role: "Digital Business Assistant | Nairobi",
    feedback: "After taking the academy's courses, I landed my first remote client from Europe. The templates and real-life projects made a big difference!",
    image: "/images/nairobi.jpg",
  },
  {
    name: "Ngozi A.",
    role: "HR Assistant | Abuja",
    feedback: "I loved the flexibility. I learned on my schedule and now manage onboarding for 3 remote startups. Thank you, Taxly!",
    image: "/images/abuja.jpg",
  },
];

const Testimonials = () => {
  return (
    <section className="testimonials-section py-5" id="testimonials">
      <div className="container">
        <h2 className="text-center section-title" data-aos="fade-up">Success Stories</h2>
        <p className="text-center section-subtitle mb-5" data-aos="fade-up" data-aos-delay="100">
          Hear from some of our successful students and remote professionals
        </p>

        <div className="row">
          {testimonials.map((t, index) => (
            <div className="col-md-4 mb-4" key={index} data-aos="fade-up" data-aos-delay={index * 100}>
              <div className="testimonial-card p-4 shadow-sm h-100 text-center">
                <img src={t.image} alt={t.name} className="testimonial-img mb-3 rounded-circle" loading="lazy"/>
                <h5 className="testimonial-name">{t.name}</h5>
                <p className="testimonial-role text-muted">{t.role}</p>
                <p className="testimonial-text">“{t.feedback}”</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
