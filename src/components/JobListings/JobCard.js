import React from "react";

/**
 * @param {Date} date
 * @returns {string}
 */
const timeAgo = (date) => {
  if (!date) return "";
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000; // 1 year in seconds
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000; // 1 month in seconds
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400; // 1 day in seconds
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600; // 1 hour in seconds
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60; // 1 minute in seconds
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return "Just now";
};

/**
 * @param {object} job
 * @returns {string|null}
 */
const formatSalary = (job) => {
  if (!job.salaryMin) {
    return null;
  }

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: job.currency || "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  let salaryText = formatter.format(job.salaryMin);

  if (job.salaryMax && job.salaryMax > job.salaryMin) {
    salaryText += ` - ${formatter.format(job.salaryMax)}`;
  }

  return `${salaryText} a year`;
};

/**
 * @param {string} s
 * @returns {string}
 */
const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1).replace("_", " ");
};

/**
 * @param {object} props
 * @param {object} props.job
 * @param {function} props.onSelectJob
 * @param {string} props.columnClass
 */
const JobCard = ({ job, onSelectJob, columnClass }) => {
  const salaryString = formatSalary(job);
  const postedString = timeAgo(job.postedDate);

  const contractInfo = [
    job.contractType ? capitalize(job.contractType) : "",
    job.contractTime ? capitalize(job.contractTime) : "",
  ]
    .filter(Boolean)
    .join(" / ");

  return (
    <div className={`${columnClass} mb-4`}>
      <div className="card shadow-sm h-100">
        <div className="card-body d-flex flex-column">
          {/* Category Badge */}
          {job.category && (
            <p className="text-muted small mb-1">{job.category}</p>
          )}

          {/* Job Title */}
          <h5 className="card-title fw-bold">{job.title}</h5>

          {/* Company and Location */}
          <p className="card-text text-muted mb-2">
            {job.company} &middot; {job.location}
          </p>

          {/* Salary Information */}
          {salaryString && (
            <p className="card-text mb-3">
              <span className="badge bg-success-subtle text-success-emphasis rounded-pill px-3 py-2 fs-6">
                {salaryString}
              </span>
            </p>
          )}

          {/* Job Description Snippet */}
          <p className="card-text small flex-grow-1">
            {job.description?.slice(0, 120) ?? ""}...
          </p>

          {/* Footer with Contract Info and Posted Date */}
          <div className="card-footer bg-transparent border-0 p-0 mt-3">
            <div className="d-flex justify-content-between align-items-center">
              <button
                onClick={() => onSelectJob(job)}
                className="btn btn-outline-primary"
              >
                View Details
              </button>
              <div className="text-end">
                {contractInfo && (
                  <div className="text-muted small">{contractInfo}</div>
                )}
                {postedString && (
                  <div className="text-muted small fst-italic">
                    {postedString}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
