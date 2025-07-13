// src/components/common/JobDetailModal.js
import React from 'react';

// --- Helper Functions for consistent data formatting ---

/**
 * A helper function to format salary data into a readable string.
 * @param {object} job - The normalized job object.
 * @returns {string|null} The formatted salary string or null if no data.
 */
const formatSalary = (job) => {
  if (!job.salaryMin) {
    return null;
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
  return `${salaryText} a year`;
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
 * Displays the full details of a selected job in a scrollable pop-up modal.
 * @param {object} props - The component props.
 * @param {object} props.job - The selected job object to display.
 * @param {function} props.onClose - The function to close the modal.
 */
const JobDetailModal = ({ job, onClose }) => {
  // Don't render anything if no job is selected
  if (!job) {
    return null;
  }

  // Pre-format the data for cleaner JSX
  const salaryString = formatSalary(job);
  const contractInfo = [
    job.contractType ? capitalize(job.contractType) : '',
    job.contractTime ? capitalize(job.contractTime) : ''
  ].filter(Boolean).join(' / ');

  return (
    // The `modal-dialog-scrollable` class from Bootstrap makes the modal body scrollable
    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            {/* Grouped Title, Company, and Location */}
            <div>
              <h5 className="modal-title fw-bold mb-1">{job.title}</h5>
              <p className="text-muted mb-0">{job.company} &middot; {job.location}</p>
            </div>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {/* --- Job Details Badges --- */}
            <div className="d-flex flex-wrap gap-2 mb-4">
              {salaryString && (
                <span className="badge bg-success-subtle text-success-emphasis rounded-pill fs-6 px-3 py-2">
                  {salaryString}
                </span>
              )}
              {contractInfo && (
                <span className="badge bg-primary-subtle text-primary-emphasis rounded-pill fs-6 px-3 py-2">
                  {contractInfo}
                </span>
              )}
              {job.category && (
                <span className="badge bg-secondary-subtle text-secondary-emphasis rounded-pill fs-6 px-3 py-2">
                  {job.category}
                </span>
              )}
            </div>

            {/* --- Full Job Description --- */}
            <h6 className="fw-bold">Job Description</h6>
            <div dangerouslySetInnerHTML={{ __html: job.description?.replace(/\n/g, "<br />") }} />
          </div>
          <div className="modal-footer justify-content-between">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            <a href={job.url} className="btn btn-primary fw-bold" target="_blank" rel="noopener noreferrer">
              View and Apply on {job.source}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;
