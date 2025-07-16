import React from "react";

/**
 * @param {Date} date
 * @returns {string}
 */
const timeAgo = (date) => {
  if (!date) return "N/A";
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  let interval = seconds / 31536000; // 1 year
  if (interval > 1) return Math.floor(interval) + " years ago";

  interval = seconds / 2592000; // 1 month
  if (interval > 1) return Math.floor(interval) + " months ago";

  interval = seconds / 86400; // 1 day
  if (interval > 1) return Math.floor(interval) + " days ago";

  return "Today";
};

/**
 * @param {object} job
 * @returns {string}
 */
const formatSalary = (job) => {
  if (!job.salaryMin) {
    return "N/A";
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

  return salaryText;
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
 */
const JobTableRow = ({ job, onSelectJob }) => {
  const contractInfo = [
    job.contractType ? capitalize(job.contractType) : "",
    job.contractTime ? capitalize(job.contractTime) : "",
  ]
    .filter(Boolean)
    .join(" / ");

  return (
    <tr>
      <td>
        <div className="fw-bold">{job.title}</div>
        <div className="text-muted small">{job.company}</div>
      </td>
      <td>{job.location}</td>
      <td>{formatSalary(job)}</td>
      <td>{contractInfo || "N/A"}</td>
      <td className="text-muted">{timeAgo(job.postedDate)}</td>
      <td>
        <button
          onClick={() => onSelectJob(job)}
          className="btn btn-sm btn-outline-primary"
        >
          View
        </button>
      </td>
    </tr>
  );
};

export default JobTableRow;
