import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import COURSES from "../../data/courses";
import { getCourseRecommendationsForJob } from "../../api/geminiService";

import { Openai } from "react-bootstrap-icons";

const JobDetailModal = ({ job, onClose }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);
  const [hasRequestedRecs, setHasRequestedRecs] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (job) {
      setRecommendations([]);
      setIsLoadingRecs(false);
      setHasRequestedRecs(false);
      setError(null);
    }
  }, [job]);

  if (!job) return null;

  const handleGetRecommendations = async () => {
    setIsLoadingRecs(true);
    setHasRequestedRecs(true);
    setError(null);

    try {
      const courseIds = await getCourseRecommendationsForJob(job);

      if (courseIds && courseIds.length > 0) {
        const recommendedCourses = courseIds
          .map((id) => COURSES.find((c) => c.id === id))
          .filter(Boolean);
        setRecommendations(recommendedCourses);
      } else {
        setRecommendations([]);
      }
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError(
        "Sorry, we couldn't get recommendations at this time. Please try again."
      );
      setRecommendations([]);
    } finally {
      setIsLoadingRecs(false);
    }
  };

  const renderRecommendationState = () => {
    if (!hasRequestedRecs) {
      return (
        <button className="btn btn-info" onClick={handleGetRecommendations}>
          <Openai className="me-2" /> Get Course Recommendations
        </button>
      );
    }
    if (isLoadingRecs) {
      return (
        <div className="d-flex align-items-center text-muted">
          <div
            className="spinner-border spinner-border-sm me-2"
            role="status"
          ></div>
          <span>Analyzing job for course recommendations...</span>
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center">
          <p className="text-danger mb-2">{error}</p>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={handleGetRecommendations}
          >
            Try Again
          </button>
        </div>
      );
    }
    if (recommendations.length > 0) {
      return (
        <div className="d-flex flex-wrap gap-2">
          {recommendations.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="btn btn-outline-success btn-sm"
              onClick={onClose}
            >
              {course.title}
            </Link>
          ))}
        </div>
      );
    }
    return (
      <div>
        <p className="text-muted small mb-1">
          Our System couldn't find a strong course match for this specific job.
        </p>
        <p className="text-muted small mb-0">
          This can happen with highly specialized or vaguely described roles.
        </p>
      </div>
    );
  };

  return (
    <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            {/* Modal Header Content */}
            <div>
              <h5 className="modal-title fw-bold mb-1">{job.title}</h5>
              <p className="text-muted mb-0">
                {job.company} &middot; {job.location}
              </p>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-4 p-3 bg-light border rounded">
              <h6 className="fw-bold">Course Recommendations</h6>
              <p className="text-muted small mt-n1 mb-3">
                Let our System analyze this job and suggest relevant courses from
                our catalog.
              </p>
              {renderRecommendationState()}
            </div>
            <h6 className="fw-bold">Job Description</h6>
            <div
              dangerouslySetInnerHTML={{
                __html: job.description?.replace(/\n/g, "<br />"),
              }}
            />
          </div>
          <div className="modal-footer justify-content-between">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
            <a
              href={job.url}
              className="btn btn-primary fw-bold"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apply on {job.source}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;
