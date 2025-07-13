// src/components/JobListings/JobTableRow.js
import React from 'react';

/**
 * A helper function to format a date object into a "time ago" string.
 * @param {Date} date - The date to format.
 * @returns {string} A human-readable time difference.
 */
const timeAgo = (date) => {
  if (!date) return 'N/A';
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
 * A helper function to format salary data into a readable string.
 * @param {object} job - The normalized job object.
 * @returns {string} The formatted salary string or 'N/A'.
 */
const formatSalary = (job) => {
  if (!job.salaryMin) {
    return 'N/A';
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: job.currency || 'USD',
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
 * A helper function to capitalize the first letter and replace underscores.
 * @param {string} s - The string to format.
 * @returns {string} The formatted string.
 */
const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ');
};

/**
 * Renders a single row in the table view for a job listing.
 * @param {object} props - The component props.
 * @param {object} props.job - The normalized job data object.
 * @param {function} props.onSelectJob - Callback to open the details modal.
 */
const JobTableRow = ({ job, onSelectJob }) => {
  // Combine contract type and time for a cleaner display
  const contractInfo = [
    job.contractType ? capitalize(job.contractType) : '',
    job.contractTime ? capitalize(job.contractTime) : ''
  ].filter(Boolean).join(' / ');

  return (
    // The `key` prop should be applied in the parent component where .map() is called.
    <tr>
      <td>
        <div className="fw-bold">{job.title}</div>
        <div className="text-muted small">{job.company}</div>
      </td>
      <td>{job.location}</td>
      <td>{formatSalary(job)}</td>
      <td>{contractInfo || 'N/A'}</td>
      <td className="text-muted">{timeAgo(job.postedDate)}</td>
      <td>
        <button onClick={() => onSelectJob(job)} className="btn btn-sm btn-outline-primary">
          View
        </button>
      </td>
    </tr>
  );
};

export default JobTableRow;
