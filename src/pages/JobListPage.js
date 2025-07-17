import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useJobSearch } from "../hooks/useJobSearch";
import '../styles/JobList.css';
import SearchForm from "../components/JobSearch/SearchForm";
import JobCard from "../components/JobListings/JobCard";
import JobDetailModal from "../components/common/JobDetailModal";
import Pagination from "../components/common/Pagination";
import { Funnel, ExclamationCircle, Briefcase } from 'react-bootstrap-icons';
const SkeletonLoader = () => (
    Array.from({ length: 6 }).map((_, index) => (
        <div className="col-12 col-lg-6" key={index}>
            <div className="skeleton-card">
                <div className="d-flex align-items-center mb-3">
                    <div className="skeleton-avatar"></div>
                    <div style={{ flex: 1 }}>
                        <div className="skeleton-line" style={{ width: '70%', height: '1.2rem' }}></div>
                        <div className="skeleton-line skeleton-line-short" style={{ height: '0.8rem' }}></div>
                    </div>
                </div>
                <div className="skeleton-line skeleton-line-long"></div>
                <div className="skeleton-line"></div>
                <div className="skeleton-line skeleton-line-short"></div>
            </div>
        </div>
    ))
);
const NoResults = () => (
    <div className="col-12">
        <div className="no-results-container">
            <Briefcase size={50} className="text-muted mb-3" />
            <h4 className="fw-bold">No Jobs Found</h4>
            <p className="text-muted">We couldn't find any jobs matching your current filters. Try broadening your search!</p>
        </div>
    </div>
);
const ErrorDisplay = ({ message }) => (
     <div className="col-12">
        <div className="alert alert-danger d-flex align-items-center">
            <ExclamationCircle size={24} className="me-3" />
            <div>
                <h5 className="alert-heading">An Error Occurred</h5>
                {message}
            </div>
        </div>
    </div>
);


const JobListPage = () => {
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
    categories, 
    loadingCategories,
  } = useJobSearch();

  const [selectedJob, setSelectedJob] = useState(null);

  return (
    <>
      <Helmet>
        <title>Job Board | Find Your Next Opportunity</title>
        <meta name="description" content="Search thousands of jobs from around the world with our powerful job search engine." />
      </Helmet>

      {/* --- Main Page Container with a modern background color --- */}
      <div className="job-list-page-wrapper">
        <div className="container-fluid px-4 py-5">
          <div className="row">

            {/* --- Left Column: Filters (Sticky) --- */}
            <div className="col-lg-4 col-xl-3">
              <aside className="filters-sidebar">
                <h4 className="fw-bold mb-4 d-flex align-items-center">
                    <Funnel className="me-2" /> Filters
                </h4>
                <SearchForm 
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onSearch={handleSearch}
                  loading={loading}
                  categories={categories}
                  loadingCategories={loadingCategories}
                />
              </aside>
            </div>

            {/* --- Right Column: Job Results --- */}
            <main className="col-lg-8 col-xl-9 job-results-column">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-0">Job Listings</h2>
                    <p className="text-muted mb-0">
                        {loading ? 'Searching for the best opportunities...' : `${jobs.length} jobs found.`}
                    </p>
                </div>
              </div>

              <div className="row">
                {loading ? (
                  <SkeletonLoader />
                ) : error ? (
                  <ErrorDisplay message={error} />
                ) : jobs.length === 0 ? (
                  <NoResults />
                ) : (
                  jobs.map(job => (
                    <div className="col-12 col-xl-6" key={`${job.source}-${job.id}`}>
                         <JobCard 
                           job={job} 
                           onSelectJob={() => setSelectedJob(job)} 
                         />
                    </div>
                  ))
                )}
              </div>

              {/* --- Pagination --- */}
              {!loading && !error && jobs.length > 0 && (
                <div className="mt-4 d-flex justify-content-center">
                    <Pagination
                      currentPage={currentPage}
                      onPageChange={handlePageChange}
                      loading={loading}
                      hasMorePages={hasMorePages}
                    />
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
      
      {/* --- Modal remains the same --- */}
      <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      {selectedJob && <div className="modal-backdrop fade show"></div>}
    </>
  );
};

export default JobListPage;
