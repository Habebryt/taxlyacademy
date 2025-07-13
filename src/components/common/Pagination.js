import React from 'react';

const Pagination = ({ currentPage, onPageChange, loading, hasMorePages }) => {
  return (
    <div className="d-flex justify-content-center align-items-center mt-4">
      <button
        className="btn btn-warning me-3"
        onClick={() => onPageChange(currentPage - 1)}
        // Disable if on the first page or if loading
        disabled={currentPage === 1 || loading}
      >
        &larr; Previous
      </button>

      <span className="fw-bold">Page {currentPage}</span>

      <button
        className="btn btn-primary ms-3"
        onClick={() => onPageChange(currentPage + 1)}
        // Disable if there are no more pages or if loading
        disabled={!hasMorePages || loading}
      >
        Next &rarr;
      </button>
    </div>
  );
};

export default Pagination;