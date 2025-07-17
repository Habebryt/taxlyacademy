import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/FeaturedCourses.css'; 
import { Laptop, PersonWorkspace, GraphUp, FileEarmarkText } from 'react-bootstrap-icons';
import AOS from 'aos';
import 'aos/dist/aos.css';
import COURSES from '../data/courses';
const featuredCourseIds = [
  'virtual-executive-assistant',
  'virtual-cfo',
  'compliance-legal-assistant',
  'digital-business-assistant',
];
const iconMap = {
  'virtual-executive-assistant': <PersonWorkspace size={36} />,
  'virtual-cfo': <GraphUp size={36} />,
  'compliance-legal-assistant': <FileEarmarkText size={36} />,
  'digital-business-assistant': <Laptop size={36} />,
};

const FeaturedCourses = () => {
  React.useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);
  const featuredCourses = COURSES.filter(course => featuredCourseIds.includes(course.id));

  return (
    <section className="courses-section py-5 bg-light" id="featured-courses">
      <div className="container text-center">
        <h2 className="section-title" data-aos="fade-up">Our Top Virtual Courses</h2>
        <p className="section-subtitle mb-5" data-aos="fade-up" data-aos-delay="100">
          Launch your career in virtual back-office services with these job-ready programs.
        </p>

        <div className="row">
          {featuredCourses.map((course, index) => (
            <div className="col-md-6 col-lg-3 mb-4" key={course.id} data-aos="fade-up" data-aos-delay={index * 100}>
              {/* Wrap the entire card in a Link to make it clickable */}
              <Link to={`/courses/${course.id}`} className="course-card-link text-decoration-none">
                <div className="course-card h-100 shadow-sm p-4 bg-white">
                  {/* Get the icon from our new iconMap */}
                  <div className="course-icon mb-3 text-primary">{iconMap[course.id]}</div>
                  {/* Use the title and description from the centralized data */}
                  <h5 className="course-title">{course.title}</h5>
                  <p className="course-description">{course.description}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <div className="text-center mt-4" data-aos="fade-up">
            <Link to="/courses" className="btn btn-primary btn-lg">
                Explore All Courses
            </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
