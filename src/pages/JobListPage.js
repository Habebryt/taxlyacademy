import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useJobSearch } from "../hooks/useJobSearch"; 

// Import components
import SearchForm from "../components/JobSearch/SearchForm";
import JobCard from "../components/JobListings/JobCard";
import JobDetailModal from "../components/common/JobDetailModal";
import Pagination from "../components/common/Pagination";
import { Funnel, ExclamationCircle, Briefcase } from 'react-bootstrap-icons';

// --- NEW: Import the ApplicationModal and its save logic ---
import { ApplicationModal } from '../pages/dashboard/student/JobApplications';
import { useFirebase } from '../context/FirebaseContext';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";


// --- Skeleton Loader Component for a smoother loading experience ---
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

// --- A more engaging "No Results" component ---
const NoResults = () => (
    <div className="col-12">
        <div className="no-results-container">
            <Briefcase size={50} className="text-muted mb-3" />
            <h4 className="fw-bold">No Jobs Found</h4>
            <p className="text-muted">We couldn't find any jobs matching your current filters. Try broadening your search!</p>
        </div>
    </div>
);

// --- A clear error message component ---
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

  // --- NEW: Get Firebase services from the central context ---
  const { db, auth, appId } = useFirebase();

  const [selectedJob, setSelectedJob] = useState(null);
  // --- NEW: State to control the application tracking modal ---
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [jobToTrack, setJobToTrack] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenDetails = (job) => {
    setSelectedJob(job);
  };

  // --- NEW: Function to open the tracking modal with pre-filled data ---
  const handleTrackApplication = (job) => {
    // We need to map the job data to the format our ApplicationModal expects
    const applicationData = {
        jobTitle: job.title,
        company: job.company,
        jobUrl: job.url,
    };
    setJobToTrack(applicationData); // Set the job to be tracked
    setSelectedJob(null); // Close the details modal
    setIsTrackingModalOpen(true); // Open the tracking modal
  };

  // --- NEW: Function to save the tracked application to Firestore ---
  const handleSaveTrackedApplication = async (formData) => {
    if (!db || !auth.currentUser) {
        alert("Could not save. Please make sure you are logged in.");
        return;
    }
    setIsSubmitting(true);
    try {
        const userId = auth.currentUser.uid;
        const applicationsRef = collection(db, `users/${userId}/jobApplications`);
        await addDoc(applicationsRef, {
            ...formData,
            appliedAt: serverTimestamp(),
        });
        setIsTrackingModalOpen(false);
        setJobToTrack(null);
        alert("Application successfully tracked! You can view it in your dashboard.");
    } catch (error) {
        console.error("Error saving tracked application:", error);
        alert("Failed to save application. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Job Board | Find Your Next Opportunity</title>
        <meta name="description" content="Search thousands of jobs from around the world with our powerful job search engine." />
      </Helmet>

      <div className="job-list-page-wrapper">
        <div className="container-fluid px-4 py-5">
          <div className="row">
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
                           onSelectJob={() => handleOpenDetails(job)} 
                         />
                    </div>
                  ))
                )}
              </div>

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
      
      {/* --- Pass the new onTrackJob prop to the details modal --- */}
      <JobDetailModal 
        job={selectedJob} 
        onClose={() => setSelectedJob(null)} 
        onTrackJob={handleTrackApplication}
      />
      {selectedJob && <div className="modal-backdrop fade show"></div>}

      {/* --- Render the ApplicationModal for tracking --- */}
      <ApplicationModal 
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        onSave={handleSaveTrackedApplication}
        application={jobToTrack} // Pre-fills the form with this job's data
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default JobListPage;
