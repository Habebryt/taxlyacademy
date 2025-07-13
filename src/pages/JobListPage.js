// src/pages/JobListPage.js
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useJobSearch } from "../hooks/useJobSearch";

// Import all the UI components
import Hero from "../components/Hero"; // Assuming this already exists
import SearchForm from "../components/JobSearch/SearchForm";
import LayoutSwitcher from "../components/JobSearch/LayoutSwitcher";
import JobCard from "../components/JobListings/JobCard";
import JobTableRow from "../components/JobListings/JobTableRow";
import JobDetailModal from "../components/common/JobDetailModal";
import Pagination from "../components/common/Pagination";

/**
 * The main page component that assembles the entire job search interface.
 * It uses the `useJobSearch` hook to manage all application state and logic,
 * and passes that state down to the presentational UI components.
 */
const JobListPage = () => {
  // The custom hook provides all the state and logic needed for the page.
  const {
    jobs,
    loading,
    error,
    filters,
    handleFilterChange,
    handleSearch,
    currentPage,
    handlePageChange,
    hasMorePages,
    categories, // New state for Adzuna categories
    loadingCategories, // New state to track if categories are loading
  } = useJobSearch();

  // Local UI state for this page component
  const [layoutView, setLayoutView] = useState('grid-2');
  const [selectedJob, setSelectedJob] = useState(null);

  /**
   * Determines the correct Bootstrap column class based on the selected layout view.
   * @returns {string} The Bootstrap column class (e.g., 'col-lg-3 col-md-4').
   */
  const getColumnClass = () => {
    switch (layoutView) {
      case 'grid-4': return 'col-lg-3 col-md-4 col-sm-6';
      case 'grid-3': return 'col-md-4 col-sm-6';
      default: return 'col-md-6';
    }
  };

  return (
    <>
      <Helmet>
        <title>Job Board | Find Your Next Opportunity</title>
        <meta name="description" content="Search thousands of jobs from around the world with our powerful job search engine." />
        <meta property="og:title" content="Job Board | Powered by Adzuna" />
        <meta property="og:description" content="Use our powerful filters to find your next role by country, category, salary, and more." />
      </Helmet>

      <Hero
        backgroundImage="/images/jobs-banner.jpg" // Example image
        title="Find Your Next Opportunity"
        subtitle="Our job board is now powered by a more precise search experience."
        ctaText={null}
      />

      <div className="job-list-section py-5">
        <div className="container">
          <h2 className="text-center mb-4">Search For Jobs</h2>

          {/* The SearchForm now receives the new category-related props */}
          <SearchForm 
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            loading={loading}
            categories={categories}
            loadingCategories={loadingCategories}
          />
          
          <LayoutSwitcher currentView={layoutView} onViewChange={setLayoutView} />

          {/* --- Display Logic for Loading, Errors, and No Results --- */}
          {loading && <p className="text-center mt-5">Loading job listings...</p>}
          {error && <p className="alert alert-danger text-center mt-5">{error}</p>}
          {!loading && !error && jobs.length === 0 && (
            <p className="text-center mt-5">No job listings found. Try adjusting your filters.</p>
          )}

          {/* --- Conditional Rendering for Job Listings (Grid or Table) --- */}
          {!loading && !error && jobs.length > 0 && (
            layoutView.startsWith('grid') ? (
              <div className="row">
                {jobs.map(job => (
                  <JobCard 
                    key={job.id} // Use job.id as it's unique from the API
                    job={job} 
                    onSelectJob={setSelectedJob} 
                    columnClass={getColumnClass()} 
                  />
                ))}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Job Title / Company</th>
                      <th>Location</th>
                      <th>Salary</th>
                      <th>Contract</th>
                      <th>Posted</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map(job => (
                      <JobTableRow 
                        key={job.id} // Use job.id as it's unique
                        job={job} 
                        onSelectJob={setSelectedJob} 
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {/* --- Pagination Controls --- */}
          {!loading && !error && jobs.length > 0 && (
            <Pagination
              currentPage={currentPage}
              onPageChange={handlePageChange}
              loading={loading}
              hasMorePages={hasMorePages}
            />
          )}
        </div>
      </div>
      
      {/* --- Render Modal and Backdrop --- */}
      <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      {selectedJob && <div className="modal-backdrop fade show"></div>}
    </>
  );
};

export default JobListPage;
