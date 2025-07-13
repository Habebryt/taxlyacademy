import React, { useState, useContext, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { CurrencyContext } from "../context/CurrencyContext";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Courses.css";
import Hero from "../components/Hero";

// Using the more detailed and consistent course data structure
const initialCourses = [
  {
    id: "executive-assistant-mastery",
    title: "Executive Assistant Mastery",
    description:
      "Go beyond basic admin tasks. Learn to support C-suite executives by managing complex calendars, travel, and high-level communications.",
    duration: "6 Weeks",
    price: 65000,
  },
  {
    id: "customer-success-manager",
    title: "Customer Success Manager",
    description:
      "Master client retention and delight. Develop workflows for managing client needs, handling communications, and leading customer-facing teams.",
    duration: "5 Weeks",
    price: 55000,
  },
  {
    id: "social-media-strategy",
    title: "Social Media Strategy & Management",
    description:
      "Move from just posting to leading strategy. Master content planning, copywriting, graphic design, video editing, and AI tools.",
    duration: "6 Weeks",
    price: 70000,
  },
  {
    id: "paid-traffic-ads-manager",
    title: "Paid Traffic & Ads Management",
    description:
      "Learn the high-value skill of managing paid ad campaigns on platforms like Meta, Google, and YouTube to drive traffic and sales.",
    duration: "8 Weeks",
    price: 90000,
  },
  {
    id: "podcast-production-management",
    title: "Podcast Production & Management",
    description:
      "Manage a podcast from start to finish. Learn guest management, content scripting, audio editing coordination, and promotion strategies.",
    duration: "5 Weeks",
    price: 50000,
  },
  {
    id: "tech-automations-expert",
    title: "Tech & Automations Expert",
    description:
      "Become a tech powerhouse by learning to integrate platforms and automate workflows. This course covers essential tech stacks and AI.",
    duration: "7 Weeks",
    price: 85000,
  },
  {
    id: "community-management-pro",
    title: "Community Management Pro",
    description:
      "Lead and nurture online communities. Develop engagement strategies, manage memberships, and create systems for both free and paid groups.",
    duration: "4 Weeks",
    price: 48000,
  },
  {
    id: "content-marketing-manager",
    title: "Content Marketing Manager",
    description:
      "Oversee a brand's entire content ecosystem. Learn to write and repurpose blogs, emails, and social content with a deep understanding of SEO.",
    duration: "6 Weeks",
    price: 75000,
  },
  {
    id: "launch-affiliate-management",
    title: "Launch & Affiliate Management",
    description:
      "Specialize in revenue-generating projects. Master the art of managing product launches and affiliate programs.",
    duration: "8 Weeks",
    price: 95000,
  },
  {
    id: "pinterest-marketing-expert",
    title: "Pinterest Marketing Expert",
    description:
      "Harness the power of Pinterest for organic traffic and sales. This course combines SEO, graphic design, and content strategy.",
    duration: "4 Weeks",
    price: 45000,
  },
  {
    id: "professional-copywriting",
    title: "Professional Copywriting for Web & Email",
    description:
      "Master the art of persuasive writing. Learn to craft compelling copy for sales pages, emails, social posts, and blogs that converts.",
    duration: "7 Weeks",
    price: 80000,
  },
  {
    id: "unicorn-digital-marketing-assistant",
    title: "Unicorn Digital Marketing Assistant",
    description:
      "The ultimate entry-level course into marketing. Learn the core technical and strategic skills to support a marketing team.",
    duration: "10 Weeks",
    price: 120000,
  },
  {
    id: "virtual-executive-assistant",
    title: "Virtual Executive Assistant",
    description:
      "Master scheduling, communication, and high-level executive support for global founders.",
    duration: "5 Weeks",
    price: 60000,
  },
  {
    id: "virtual-cfo",
    title: "Virtual CFO (vCFO)",
    description:
      "Learn financial planning, budgeting, and reporting for startups and SMEs.",
    duration: "8 Weeks",
    price: 150000,
  },
  {
    id: "compliance-legal-assistant",
    title: "Compliance & Legal Assistant",
    description:
      "Support businesses with filings, contracts, and corporate compliance from anywhere.",
    duration: "6 Weeks",
    price: 75000,
  },
  {
    id: "digital-business-assistant",
    title: "Digital Business Assistant",
    description:
      "Provide remote admin support, CRM updates, customer emails, and data handling.",
    duration: "4 Weeks",
    price: 40000,
  },
  {
    id: "sales-crm-assistant",
    title: "Sales & CRM Assistant",
    description:
      "Support online sales processes, update CRMs, and manage client leads efficiently.",
    duration: "5 Weeks",
    price: 50000,
  },
  {
    id: "remote-marketing-assistant",
    title: "Remote Marketing Assistant",
    description:
      "Social media, email marketing, and content scheduling tools for virtual marketers.",
    duration: "4 Weeks",
    price: 45000,
  },
];

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("none");
  const [layoutView, setLayoutView] = useState('grid-3');
  // FIX: Destructure the full currency context object
  const { symbol, rate, code } = useContext(CurrencyContext);
  const navigate = useNavigate();

  // Convert price and format with commas
  const convert = (priceNgn) => {
    if (!rate) return '...'; // Handle case where rate is not yet loaded
    const converted = priceNgn * rate;
    return converted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Memoized sorting and filtering logic
  const filteredCourses = useMemo(() => {
    let courses = [...initialCourses];

    // Filter by search term
    if (searchTerm) {
      courses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort courses
    courses.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "duration-asc":
          return parseInt(a.duration) - parseInt(b.duration);
        case "duration-desc":
          return parseInt(b.duration) - parseInt(a.duration);
        case "title-asc":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return courses;
  }, [searchTerm, sortBy]);


  const handleEnroll = (course) => {
    navigate(`/checkout?course=${course.id}`);
  };

  return (
    <>
      <Helmet>
        <title>Courses | Taxly Academy</title>
        <meta
          name="description"
          content="Browse our online courses for virtual assistants, compliance officers, remote CFOs, and more."
        />
        <meta property="og:title" content="Courses | Taxly Academy" />
        <meta
          property="og:description"
          content="Job-ready courses for high-demand virtual roles."
        />
      </Helmet>

      <Hero
        backgroundImage="/images/courses-banner.jpg"
        title="Explore Our Virtual Courses"
        subtitle="Develop skills for in-demand virtual jobs—built for the African professional."
        ctaText="Enroll Now"
      />

      <section className="courses-section py-5">
        <div className="container">
          <div className="row mb-4 align-items-center">
            <div className="col-md-4">
               <input 
                type="text"
                className="form-control"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="none">Sort By</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
                <option value="duration-asc">Duration (Shortest First)</option>
                <option value="duration-desc">Duration (Longest First)</option>
                <option value="title-asc">Alphabetical (A-Z)</option>
              </select>
            </div>
            <div className="col-md-4 d-flex justify-content-end">
                <div className="btn-group me-2">
                    <button title="Grid View" className={`btn ${layoutView === 'grid-3' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setLayoutView('grid-3')}>Grid</button>
                    <button title="Table View" className={`btn ${layoutView === 'table' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setLayoutView('table')}>List</button>
                </div>
                {/* FIX: Add a badge to show the detected currency */}
                <span className="badge bg-info d-flex align-items-center">
                    Currency: {code || '...'}
                </span>
            </div>
          </div>

          <p className="text-center text-muted mb-5" data-aos="fade-up">
            Learn in-demand back-office and remote work skills tailored for
            African professionals.
          </p>
          
          {/* --- Conditional Layout Rendering --- */}
          {layoutView === 'grid-3' && (
            <div className="row">
              {filteredCourses.map((course, idx) => (
                <div
                  key={course.id}
                  className="col-md-4 mb-4"
                  data-aos="fade-up"
                  data-aos-delay={idx * 100}
                >
                  <div className="card course-card h-100 shadow-sm">
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{course.title}</h5>
                      <p className="card-text">{course.description}</p>
                      <p className="text-primary fw-bold mb-1">
                        {course.duration}
                      </p>
                      <p className="text-success fw-semibold">
                        {symbol}
                        {convert(course.price)}
                      </p>
                      <Link
                        to={`/courses/${course.id}`}
                        className="mt-auto btn btn-outline-primary"
                      >
                        View Details
                      </Link>
                      <button
                        className="mt-2 btn btn-primary"
                        onClick={() => handleEnroll(course)}
                      >
                        Enroll Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {layoutView === 'table' && (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Course Title</th>
                    <th scope="col">Duration</th>
                    <th scope="col">Price</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((course, idx) => (
                    <tr key={course.id}>
                      <th scope="row">{idx + 1}</th>
                      <td>
                        <Link to={`/courses/${course.id}`} className="text-decoration-none">{course.title}</Link>
                        <p className="text-muted small mb-0">{course.description}</p>
                      </td>
                      <td>{course.duration}</td>
                      <td>{symbol}{convert(course.price)}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleEnroll(course)}
                        >
                          Enroll
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredCourses.length === 0 && (
            <p className="text-center mt-5">No courses match your search.</p>
          )}

        </div>
      </section>
    </>
  );
};

export default Courses;
