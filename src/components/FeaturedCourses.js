import React from 'react';
import '../styles/FeaturedCourses.css';
import { Laptop, PersonWorkspace, GraphUp, FileEarmarkText } from 'react-bootstrap-icons';

const courses = [
  {
    title: 'Virtual Executive Assistant',
    icon: <PersonWorkspace size={36} />,
    description: 'Master scheduling, communication, and high-level executive support for global founders.',
  },
  {
    title: 'Virtual CFO (vCFO)',
    icon: <GraphUp size={36} />,
    description: 'Learn financial planning, budgeting, and reporting for startups and SMEs.',
  },
  {
    title: 'Compliance & Legal Assistant',
    icon: <FileEarmarkText size={36} />,
    description: 'Support businesses with filings, contracts, and corporate compliance from anywhere.',
  },
  {
    title: 'Digital Business Assistant',
    icon: <Laptop size={36} />,
    description: 'Provide remote admin support, CRM updates, customer emails, and data handling.',
  },
];

const FeaturedCourses = () => {
  return (
    <section className="courses-section py-5 bg-light" id="featured-courses">
      <div className="container text-center">
        <h2 className="section-title" data-aos="fade-up">Our Top Virtual Courses</h2>
        <p className="section-subtitle mb-5" data-aos="fade-up" data-aos-delay="100">
          Launch your career in virtual back-office services with these job-ready programs.
        </p>

        <div className="row">
          {courses.map((course, index) => (
            <div className="col-md-6 col-lg-3 mb-4" key={index} data-aos="fade-up" data-aos-delay={index * 100}>
              <div className="course-card h-100 shadow-sm p-4 bg-white">
                <div className="course-icon mb-3 text-primary">{course.icon}</div>
                <h5 className="course-title">{course.title}</h5>
                <p className="course-description">{course.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
