import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import "../styles/JobList.css";
import Hero from "../components/Hero";

// --- Job Detail Modal Component ---
const JobDetailModal = ({ job, onClose }) => {
  if (!job) return null;

  return (
    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{job.title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p><strong>Company:</strong> {job.company}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Source:</strong> {job.source}</p>
            <hr />
            <p
              dangerouslySetInnerHTML={{
                __html: job.description.replace(/\n/g, "<br />"),
              }}
            ></p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
            <a href={job.url} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
              Apply on {job.source}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- Normalizer Function with Improved Salary Parsing ---
const normalizeJob = (job, source) => {
  try {
    let postedDate = new Date();
    let salaryMin = null;
    let salaryMax = null;
    let salaryType = 'year'; // Default to yearly
    let currency = 'USD'; // Default currency

    const descriptionText = (job?.description || job?.snippet || job?.contents || '').replace(/<[^>]+>/g, "");

    // Helper function for generic parsing from text, used as a fallback
    const parseSalaryFromText = () => {
        const salaryRegex = /(?:£|\$|€)(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)(?:\s*-\s*(?:£|\$|€)?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?))?(?:\s*(?:per|an?)\s+(hour|day|week|month|year))?/i;
        const match = descriptionText.match(salaryRegex);
        if (match) {
            salaryMin = parseFloat(match[1].replace(/,/g, ''));
            salaryMax = match[2] ? parseFloat(match[2].replace(/,/g, '')) : salaryMin;
            salaryType = match[3] ? match[3].toLowerCase() : 'year';
            if (match[0].includes('£')) currency = 'GBP';
            if (match[0].includes('€')) currency = 'EUR';
            if (match[0].includes('$')) currency = 'USD';
        }
    };

    if (source === "adzuna") {
      if (job?.created) postedDate = new Date(job.created);
      // Prioritize direct API fields
      if (job?.salary_min) {
          salaryMin = job.salary_min;
          salaryMax = job.salary_max ?? job.salary_min;
          currency = 'GBP'; // Adzuna GB is GBP
      } else {
          parseSalaryFromText(); // Fallback to text parsing
      }
      
      return {
        id: job?.id,
        title: job?.title ?? "No Title Provided",
        company: job?.company?.display_name ?? "N/A",
        location: job?.location?.display_name ?? "N/A",
        description: job?.description ?? "",
        url: job?.redirect_url,
        source: "Adzuna",
        postedDate,
        salaryMin,
        salaryMax,
        salaryType,
        currency,
      };
    }
    if (source === "jooble") {
      if (job?.updated) postedDate = new Date(job.updated);
      // Jooble doesn't have dedicated salary fields, so we must parse
      parseSalaryFromText();
      return {
        id: job?.id,
        title: job?.title ?? "No Title Provided",
        company: job?.company ?? "N/A",
        location: job?.location ?? "N/A",
        description: job?.snippet ?? "",
        url: job?.link,
        source: "Jooble",
        postedDate,
        salaryMin,
        salaryMax,
        salaryType,
        currency,
      };
    }
    if (source === "muse") {
      if (job?.publication_date) postedDate = new Date(job.publication_date);
      // The Muse doesn't have dedicated salary fields
      parseSalaryFromText();
      return {
        id: job?.id,
        title: job?.name ?? "No Title Provided",
        company: job?.company?.name ?? "N/A",
        location: job?.locations?.[0]?.name ?? "N/A",
        description: descriptionText,
        url: job?.refs?.landing_page,
        source: "The Muse",
        postedDate,
        salaryMin,
        salaryMax,
        salaryType,
        currency,
      };
    }
    if (source === "findwork") {
      if (job?.date_posted) postedDate = new Date(job.date_posted);
      // Findwork doesn't have salary fields in the list view
      parseSalaryFromText();
      return {
        id: job?.id,
        title: job?.role ?? "No Title Provided",
        company: job?.company_name ?? "N/A",
        location: job?.location ?? "N/A",
        description: `This is a ${
          job?.remote ? "remote" : "on-site"
        } position. More details available on the job page.`,
        url: job?.url ?? "#",
        source: "FindWork",
        postedDate,
        salaryMin,
        salaryMax,
        salaryType,
        currency,
      };
    }
    return null;
  } catch (e) {
    console.error("Failed to normalize job:", job, "Source:", source, "Error:", e);
    return null;
  }
};

const RESULTS_PER_PAGE = 20;
const JOB_SOURCES = ["Adzuna", "Jooble", "The Muse", "FindWork"];

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [keywords, setKeywords] = useState("remote virtual");
  const [location, setLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  // --- Advanced Filter States ---
  const [isRemote, setIsRemote] = useState(true);
  const [sortBy, setSortBy] = useState("relevance");
  const [dateRange, setDateRange] = useState("3");
  const [selectedSources, setSelectedSources] = useState(JOB_SOURCES);
  const [availableLocations, setAvailableLocations] = useState([]);
  
  // --- State for Modal and Layout ---
  const [selectedJob, setSelectedJob] = useState(null);
  const [layoutView, setLayoutView] = useState('grid-2'); // 'grid-4', 'grid-3', 'grid-2', 'table'

  const fetchAllJobs = async (
    searchKeywords,
    searchLocation,
    page,
    remoteOnly,
    sortOrder,
    sources
  ) => {
    setLoading(true);
    setError("");

    const adzunaAppId = process.env.REACT_APP_ADZUNA_APP_ID;
    const adzunaAppKey = process.env.REACT_APP_ADZUNA_APP_KEY;
    const joobleApiKey = process.env.REACT_APP_JOOBLE_API_KEY;
    const museApiKey = process.env.REACT_APP_MUSE_API_KEY;
    const findworkApiKey = "7bfa21d3e55ecfbcb9a0593d6f5f41a39eef1389";

    let effectiveKeywords = searchKeywords;
    if (remoteOnly && !effectiveKeywords.toLowerCase().includes("remote")) {
      effectiveKeywords = `remote ${effectiveKeywords}`.trim();
    }

    const apiPromises = [];

    if (sources.includes("Adzuna")) {
      apiPromises.push(axios.get(`https://api.adzuna.com/v1/api/jobs/gb/search/${page}`, {
        params: { app_id: adzunaAppId, app_key: adzunaAppKey, what: effectiveKeywords, where: searchLocation, results_per_page: RESULTS_PER_PAGE, sort_by: sortOrder, remote: remoteOnly ? 1 : 0, "content-type": "application/json" },
      }));
    }
    if (sources.includes("Jooble")) {
      apiPromises.push(axios.post(`https://jooble.org/api/${joobleApiKey}`, { keywords: effectiveKeywords, location: searchLocation, page }));
    }
    if (sources.includes("The Muse")) {
      apiPromises.push(axios.get("https://www.themuse.com/api/public/jobs", {
        params: { api_key: museApiKey, page, location: remoteOnly ? "Flexible / Remote" : searchLocation },
      }));
    }
    if (sources.includes("FindWork")) {
      apiPromises.push(axios.get("https://findwork.dev/api/jobs/", {
        headers: { Authorization: `Token ${findworkApiKey}` },
        params: { search: searchKeywords, location: searchLocation, remote: remoteOnly, sort_by: sortOrder === "date" ? "date_posted" : "relevance", page },
      }));
    }

    try {
      const results = await Promise.allSettled(apiPromises);
      let allJobs = [];
      let sourceIndex = 0;

      if (sources.includes("Adzuna")) {
        if (results[sourceIndex]?.status === "fulfilled" && results[sourceIndex].value.data.results) {
          allJobs.push(...results[sourceIndex].value.data.results.map((job) => normalizeJob(job, "adzuna")));
        }
        sourceIndex++;
      }
      if (sources.includes("Jooble")) {
        if (results[sourceIndex]?.status === "fulfilled" && results[sourceIndex].value.data.jobs) {
          allJobs.push(...results[sourceIndex].value.data.jobs.map((job) => normalizeJob(job, "jooble")));
        }
        sourceIndex++;
      }
      if (sources.includes("The Muse")) {
        if (results[sourceIndex]?.status === "fulfilled" && results[sourceIndex].value.data.results) {
          allJobs.push(...results[sourceIndex].value.data.results.map((job) => normalizeJob(job, "muse")));
        }
        sourceIndex++;
      }
      if (sources.includes("FindWork")) {
        if (results[sourceIndex]?.status === "fulfilled" && results[sourceIndex].value.data.results) {
          allJobs.push(...results[sourceIndex].value.data.results.map((job) => normalizeJob(job, "findwork")));
        }
      }

      let validJobs = allJobs.filter((job) => job !== null);

      if (dateRange !== "all") {
        const daysToFilter = parseInt(dateRange, 10);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToFilter);
        validJobs = validJobs.filter(job => job.postedDate >= cutoffDate);
      }
      
      if (sortOrder === 'salary') {
          validJobs.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0));
      }

      const locations = [...new Set(validJobs.map(job => job.location).filter(Boolean))].sort();
      setAvailableLocations(locations);

      setJobs(validJobs);
    } catch (err) {
      setError("An error occurred while fetching jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllJobs("remote virtual", "", 1, isRemote, sortBy, selectedSources);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchAllJobs(keywords, location, 1, isRemote, sortBy, selectedSources);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1) return;
    setCurrentPage(newPage);
    fetchAllJobs(keywords, location, newPage, isRemote, sortBy, selectedSources);
    window.scrollTo(0, 0);
  };
  
  const handleSourceChange = (source) => {
      setSelectedSources(prev => 
        prev.includes(source) 
        ? prev.filter(s => s !== source)
        : [...prev, source]
      );
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
  };

  // --- Helper to determine column class for grid layouts ---
  const getColumnClass = () => {
    switch (layoutView) {
      case 'grid-4': return 'col-lg-3 col-md-4 col-sm-6';
      case 'grid-3': return 'col-md-4 col-sm-6';
      case 'grid-2': return 'col-md-6';
      default: return 'col-md-6';
    }
  };

  return (
    <>
      <Helmet>
        <title>Job Board | Taxly Academy</title>
        <meta name="description" content="Discover remote job opportunities for virtual professionals." />
        <meta property="og:title" content="Job Board | Taxly Academy" />
        <meta property="og:description" content="Latest remote jobs from trusted platforms like Adzuna, Jooble, The Muse, and FindWork." />
      </Helmet>

      <Hero
        backgroundImage="/images/jobs-banner.jpg"
        title="Browse Remote Jobs"
        subtitle="Find freelance, remote, and virtual job opportunities for African professionals."
        ctaText={null}
      />

      <div className="job-list-section py-5">
        <div className="container">
          <h2 className="text-center mb-4">Find Your Next Opportunity</h2>

          {/* --- Search Form with Advanced Filters --- */}
          <form onSubmit={handleSearch} className="mb-5 p-4 border rounded shadow-sm">
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label htmlFor="keywords-input" className="form-label">Keywords</label>
                <input id="keywords-input" type="text" className="form-control" placeholder="Job title or keywords..." value={keywords} onChange={(e) => setKeywords(e.target.value)} />
              </div>
              <div className="col-md-6">
                <label htmlFor="location-select" className="form-label">Location</label>
                <select id="location-select" className="form-select" value={location} onChange={(e) => setLocation(e.target.value)}>
                    <option value="">All Locations</option>
                    {availableLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>
            </div>
            
            <div className="row g-3 mb-3">
               <div className="col-md-4">
                <label htmlFor="sort-by-select" className="form-label">Sort By</label>
                <select id="sort-by-select" className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="relevance">Relevance</option>
                  <option value="date">Date</option>
                  <option value="salary">Salary</option>
                </select>
              </div>
              <div className="col-md-4">
                <label htmlFor="date-range-select" className="form-label">Date Posted</label>
                <select id="date-range-select" className="form-select" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                  <option value="3">Last 3 days</option>
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="all">All time</option>
                </select>
              </div>
              <div className="col-md-4 d-flex align-items-end">
                 <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="remote-only-check" checked={isRemote} onChange={(e) => setIsRemote(e.target.checked)} />
                    <label className="form-check-label" htmlFor="remote-only-check">Remote Only</label>
                 </div>
              </div>
            </div>

            <div className="row mb-3">
                <div className="col-12">
                    <label className="form-label">Job Boards</label>
                    <div className="d-flex flex-wrap">
                        {JOB_SOURCES.map(source => (
                            <div key={source} className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id={`source-${source}`} checked={selectedSources.includes(source)} onChange={() => handleSourceChange(source)} />
                                <label className="form-check-label" htmlFor={`source-${source}`}>{source}</label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? "Searching..." : "Apply Filters & Search"}
                    </button>
                </div>
            </div>
          </form>

          {/* --- Layout Switcher --- */}
          <div className="d-flex justify-content-end align-items-center mb-4">
              <span className="me-2 text-muted">View:</span>
              <div className="btn-group">
                  <button title="4-Column Grid" className={`btn btn-sm ${layoutView === 'grid-4' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setLayoutView('grid-4')}>4</button>
                  <button title="3-Column Grid" className={`btn btn-sm ${layoutView === 'grid-3' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setLayoutView('grid-3')}>3</button>
                  <button title="2-Column Grid" className={`btn btn-sm ${layoutView === 'grid-2' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setLayoutView('grid-2')}>2</button>
                  <button title="Table View" className={`btn btn-sm ${layoutView === 'table' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setLayoutView('table')}>List</button>
              </div>
          </div>

          {/* --- Display Logic --- */}
          {loading && <p className="text-center mt-5">Loading job listings...</p>}
          {error && <p className="text-danger text-center mt-5">{error}</p>}
          {!loading && !error && jobs.length === 0 && <p className="text-center mt-5">No job listings found. Try adjusting your filters.</p>}

          {/* --- Conditional Job Listing --- */}
          {layoutView.startsWith('grid') && (
            <div className="row">
              {jobs.map((job) => (
                <div key={`${job.source}-${job.id}`} className={`${getColumnClass()} mb-4`}>
                  <div className="card shadow-sm h-100">
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{job.title}</h5>
                      <p className="card-text text-muted"><strong>{job.company}</strong> ({job.location})</p>
                      {job.salaryMin && (
                          <p className="card-text">
                              <span className="badge bg-success">
                                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: job.currency, maximumFractionDigits: 0 }).format(job.salaryMin)}
                                  {job.salaryMax > job.salaryMin && ` - ${new Intl.NumberFormat('en-US', { style: 'currency', currency: job.currency, maximumFractionDigits: 0 }).format(job.salaryMax)}`}
                                  {' / '}{job.salaryType}
                              </span>
                          </p>
                      )}
                      <p className="card-text flex-grow-1">{job.description?.slice(0, 150) ?? ""}...</p>
                      <button onClick={() => handleViewDetails(job)} className="btn btn-outline-primary mt-auto">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {layoutView === 'table' && (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Company</th>
                    <th>Location</th>
                    <th>Salary</th>
                    <th>Source</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={`${job.source}-${job.id}`}>
                      <td>{job.title}</td>
                      <td>{job.company}</td>
                      <td>{job.location}</td>
                      <td>
                        {job.salaryMin ? (
                          `${new Intl.NumberFormat('en-US', { style: 'currency', currency: job.currency, maximumFractionDigits: 0 }).format(job.salaryMin)}`
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td>{job.source}</td>
                      <td>
                        <button onClick={() => handleViewDetails(job)} className="btn btn-sm btn-outline-primary">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* --- Pagination Controls --- */}
          {!loading && !error && jobs.length > 0 && (
            <div className="d-flex justify-content-center align-items-center mt-4">
              <button className="btn btn-warning me-3" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1 || loading}>&larr; Previous</button>
              <span className="fw-bold">Page {currentPage}</span>
              <button className="btn btn-primary ms-3" onClick={() => handlePageChange(currentPage + 1)} disabled={jobs.length < RESULTS_PER_PAGE || loading}>Next &rarr;</button>
            </div>
          )}
        </div>
      </div>
      
      {/* --- Render Modal --- */}
      <JobDetailModal job={selectedJob} onClose={handleCloseModal} />
      {selectedJob && <div className="modal-backdrop fade show"></div>}
    </>
  );
};

export default JobList;
