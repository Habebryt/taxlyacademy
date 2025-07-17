import React, { useState, useContext, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { CurrencyContext } from "../context/CurrencyContext";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Courses.css";
import Hero from "../components/Hero";
import COURSES from "../data/courses";

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("none");
  const [layoutView, setLayoutView] = useState("grid-3");
  const { symbol, rate, code } = useContext(CurrencyContext);
  const navigate = useNavigate();

  const calculateCertFee = (priceNgn) => {
    if (!rate) return "...";
    const fee = (priceNgn / 10) * rate;
    return fee.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const filteredCourses = useMemo(() => {
    if (!Array.isArray(COURSES)) {
      return [];
    }
    let courses = [...COURSES];

    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      courses = courses.filter(
        (course) =>
          (course.title &&
            course.title.toLowerCase().includes(lowercasedFilter)) ||
          (course.description &&
            course.description.toLowerCase().includes(lowercasedFilter)) ||
          (Array.isArray(course.keywords) &&
            course.keywords.some((k) =>
              k.toLowerCase().includes(lowercasedFilter)
            ))
      );
    }

    courses.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price / 10 - b.price / 10;
        case "price-desc":
          return b.price / 10 - a.price / 10;
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

  return (
    <>
      <Helmet>
        <title>Courses | Taxly Academy</title>
        <meta
          name="description"
          content="Enroll in our online courses for free. Optional certificates available. Learn skills for virtual assistants, compliance officers, remote CFOs, and more."
        />
      </Helmet>

      <Hero
        backgroundImage="/images/courses-banner.jpg"
        title="Explore Our Virtual Courses"
        subtitle="Enroll for free and master in-demand skills. Optional professional certificates available."
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
                <option value="price-asc">Certificate Fee (Low to High)</option>
                <option value="price-desc">
                  Certificate Fee (High to Low)
                </option>
                <option value="duration-asc">Duration (Shortest First)</option>
                <option value="duration-desc">Duration (Longest First)</option>
                <option value="title-asc">Alphabetical (A-Z)</option>
              </select>
            </div>
            <div className="col-md-4 d-flex justify-content-end">
              <div className="btn-group me-2">
                <button
                  title="Grid View"
                  className={`btn ${
                    layoutView === "grid-3"
                      ? "btn-primary"
                      : "btn-outline-secondary"
                  }`}
                  onClick={() => setLayoutView("grid-3")}
                >
                  Grid
                </button>
                <button
                  title="Table View"
                  className={`btn ${
                    layoutView === "table"
                      ? "btn-primary"
                      : "btn-outline-secondary"
                  }`}
                  onClick={() => setLayoutView("table")}
                >
                  List
                </button>
              </div>
              <span className="badge bg-info d-flex align-items-center">
                Currency: {code || "..."}
              </span>
            </div>
          </div>

          {layoutView === "grid-3" && (
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
                      <div className="mt-auto">
                        <p className="text-primary fw-bold mb-1">
                          {course.duration}
                        </p>
                        <div className="mb-3">
                          <span className="badge bg-success-subtle text-success-emphasis fs-6 me-2">
                            Free to Enroll
                          </span>
                          <span className="badge bg-primary-subtle text-primary-emphasis fs-6">
                            Cert. Fee: {symbol}
                            {calculateCertFee(course.price)}
                          </span>
                        </div>
                        <Link
                          to={`/courses/${course.id}`}
                          className="btn btn-primary w-100"
                        >
                          View Details & Enroll
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {layoutView === "table" && (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th scope="col">Course Title</th>
                    <th scope="col">Duration</th>
                    <th scope="col">Enrollment</th>
                    <th scope="col">Certificate Fee</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((course) => (
                    <tr key={course.id}>
                      <td>
                        <Link
                          to={`/courses/${course.id}`}
                          className="text-decoration-none fw-bold"
                        >
                          {course.title}
                        </Link>
                        <p className="text-muted small mb-0">
                          {course.description}
                        </p>
                      </td>
                      <td>{course.duration}</td>
                      <td>
                        <span className="badge bg-success-subtle text-success-emphasis">
                          Free
                        </span>
                      </td>
                      <td>
                        {symbol}
                        {calculateCertFee(course.price)}
                      </td>
                      <td>
                        <Link
                          to={`/courses/${course.id}`}
                          className="btn btn-primary btn-sm"
                        >
                          Details
                        </Link>
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
