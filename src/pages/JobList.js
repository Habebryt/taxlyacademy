import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import "../styles/JobList.css";
import Hero from "../components/Hero";

// --- Normalizer Function with Defensive Checks ---
const normalizeJob = (job, source) => {
  try {
    if (source === "adzuna") {
      return {
        id: job?.id,
        title: job?.title ?? "No Title Provided",
        company: job?.company?.display_name ?? "N/A",
        location: job?.location?.display_name ?? "N/A",
        description: job?.description ?? "",
        url: job?.redirect_url,
        source: "Adzuna",
      };
    }
    if (source === "reed") {
      return {
        id: job?.jobId,
        title: job?.jobTitle ?? "No Title Provided",
        company: job?.employerName ?? "N/A",
        location: job?.locationName ?? "N/A",
        description: job?.jobDescription ?? "",
        url: job?.jobUrl ? `https://www.reed.co.uk${job.jobUrl}` : "#",
        source: "Reed.co.uk",
      };
    }
    if (source === "jooble") {
      return {
        id: job?.id,
        title: job?.title ?? "No Title Provided",
        company: job?.company ?? "N/A",
        location: job?.location ?? "N/A",
        description: job?.snippet ?? "",
        url: job?.link,
        source: "Jooble",
      };
    }
    // --- NEW: Add normalizer for The Muse ---
    if (source === "muse") {
      // The Muse description contains HTML, so we strip it for a clean preview.
      const descriptionText = job?.contents?.replace(/<[^>]+>/g, "") ?? "";
      return {
        id: job?.id,
        title: job?.name ?? "No Title Provided",
        company: job?.company?.name ?? "N/A",
        location: job?.locations?.[0]?.name ?? "N/A", // Safely access the first location
        description: descriptionText,
        url: job?.refs?.landing_page,
        source: "The Muse",
      };
    }
    return null;
  } catch (e) {
    console.error(
      "Failed to normalize job:",
      job,
      "Source:",
      source,
      "Error:",
      e
    );
    return null;
  }
};

const RESULTS_PER_PAGE = 20;

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [keywords, setKeywords] = useState("remote virtual");
  const [location, setLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchAllJobs = async (searchKeywords, searchLocation, page) => {
    setLoading(true);
    setError("");

    const adzunaAppId = process.env.REACT_APP_ADZUNA_APP_ID;
    const adzunaAppKey = process.env.REACT_APP_ADZUNA_APP_KEY;
    const joobleApiKey = process.env.REACT_APP_JOOBLE_API_KEY;
    const museApiKey = process.env.REACT_APP_MUSE_API_KEY; // Get The Muse API Key

    // --- API Fetch Functions with The Muse Added ---
    const fetchAdzuna = axios.get(
      `https://api.adzuna.com/v1/api/jobs/gb/search/${page}`,
      {
        params: {
          app_id: adzunaAppId,
          app_key: adzunaAppKey,
          what: searchKeywords,
          where: searchLocation,
          results_per_page: RESULTS_PER_PAGE,
          "content-type": "application/json",
        },
      }
    );
    const fetchReed = axios.get("http://localhost:3001/api/reed", {
      params: {
        keywords: searchKeywords,
        locationName: searchLocation,
        resultsToTake: RESULTS_PER_PAGE,
        resultsToSkip: (page - 1) * RESULTS_PER_PAGE,
      },
    });
    const fetchJooble = axios.post(`https://jooble.org/api/${joobleApiKey}`, {
      keywords: searchKeywords,
      location: searchLocation,
      page: page,
    });

    // --- NEW: API call for The Muse ---
    const fetchMuse = axios.get("https://www.themuse.com/api/public/jobs", {
      params: {
        api_key: museApiKey,
        page: page,
        location: searchLocation,
        // Note: The Muse API doesn't have a general 'keywords' search,
        // so we filter by location primarily. We can add 'category' if needed.
      },
    });

    try {
      // Add the new fetchMuse promise to the array
      const results = await Promise.allSettled([
        fetchAdzuna,
        fetchReed,
        fetchJooble,
        fetchMuse,
      ]);
      let allJobs = [];

      if (results[0].status === "fulfilled" && results[0].value.data.results) {
        allJobs.push(
          ...results[0].value.data.results.map((job) =>
            normalizeJob(job, "adzuna")
          )
        );
      }
      if (results[1].status === "fulfilled" && results[1].value.data.results) {
        allJobs.push(
          ...results[1].value.data.results.map((job) =>
            normalizeJob(job, "reed")
          )
        );
      }
      if (results[2].status === "fulfilled" && results[2].value.data.jobs) {
        allJobs.push(
          ...results[2].value.data.jobs.map((job) =>
            normalizeJob(job, "jooble")
          )
        );
      }
      // --- NEW: Process results from The Muse ---
      if (results[3].status === "fulfilled" && results[3].value.data.results) {
        allJobs.push(
          ...results[3].value.data.results.map((job) =>
            normalizeJob(job, "muse")
          )
        );
      }

      const validJobs = allJobs.filter((job) => job !== null);
      setJobs(validJobs);
    } catch (err) {
      setError("An error occurred while fetching jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllJobs("remote virtual", "", 1);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchAllJobs(keywords, location, 1);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1) return;
    setCurrentPage(newPage);
    fetchAllJobs(keywords, location, newPage);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Helmet>
        <title>Job Board | Taxly Academy</title>
        <meta
          name="description"
          content="Discover remote job opportunities curated for virtual professionals across Africa."
        />
        <meta property="og:title" content="Job Board | Taxly Academy" />
        <meta
          property="og:description"
          content="Latest remote jobs from trusted platforms like Reed, Adzuna, and Jooble."
        />
      </Helmet>

      <Hero
        backgroundImage="/images/jobs-banner.jpg"
        title="Browse Remote Jobs"
        subtitle="Find freelance, remote, and virtual job opportunities for African professionals."
        ctaText="Start Searching"
      />

      <div className="job-list-section py-5">
        <div className="container">
          <h2 className="text-center mb-4">Find Your Next Opportunity</h2>

          {/* --- THIS IS THE RESTORED SEARCH FORM --- */}
          <form onSubmit={handleSearch} className="mb-5">
            <div className="row">
              <div className="col-md-5">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Job title or keywords..."
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
              </div>
              <div className="col-md-5">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Location..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>
            </div>
          </form>

          {/* --- Display Logic --- */}
          {loading && (
            <p className="text-center mt-5">Loading job listings...</p>
          )}
          {error && <p className="text-danger text-center mt-5">{error}</p>}
          {!loading && !error && jobs.length === 0 && (
            <p className="text-center mt-5">
              No job listings found. Try a new search.
            </p>
          )}

          {/* --- Job Card Mapping --- */}
          <div className="row">
            {jobs.map((job) => (
              <div key={`${job.source}-${job.id}`} className="col-md-6 mb-4">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title">{job.title}</h5>
                    <p className="card-text text-muted">
                      <strong>{job.company}</strong> ({job.location})
                    </p>
                    <p className="card-text">
                      {job.description?.slice(0, 150) ?? ""}...
                    </p>
                    <a
                      href={job.url}
                      className="btn btn-outline-primary mt-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Job on {job.source}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* --- Pagination Controls --- */}
          {!loading && !error && jobs.length > 0 && (
            <div className="d-flex justify-content-center align-items-center mt-4">
              <button
                className="btn btn-warning me-3"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
              >
                &larr; Previous
              </button>
              <span className="fw-bold">Page {currentPage}</span>
              <button
                className="btn btn-primary ms-3"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={jobs.length < RESULTS_PER_PAGE || loading}
              >
                Next &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default JobList;
