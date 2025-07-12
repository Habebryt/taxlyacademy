import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import axios from 'axios';
import '../styles/JobList.css'; // We can reuse the same styles

// --- Normalizer Function (reused from JobList.js) ---
// For a larger app, you would move this to a separate utility file
const normalizeJob = (job, source) => {
  try {
    if (source === 'adzuna') {
      return { id: job?.id, title: job?.title ?? 'No Title Provided', company: job?.company?.display_name ?? 'N/A', location: job?.location?.display_name ?? 'N/A', description: job?.description ?? '', url: job?.redirect_url, source: 'Adzuna' };
    }
    if (source === 'reed') {
      return { id: job?.jobId, title: job?.jobTitle ?? 'No Title Provided', company: job?.employerName ?? 'N/A', location: job?.locationName ?? 'N/A', description: job?.jobDescription ?? '', url: job?.jobUrl ? `https://www.reed.co.uk${job.jobUrl}` : '#', source: 'Reed.co.uk' };
    }
    if (source === 'jooble') {
      return { id: job?.id, title: job?.title ?? 'No Title Provided', company: job?.company ?? 'N/A', location: job?.location ?? 'N/A', description: job?.snippet ?? '', url: job?.link, source: 'Jooble' };
    }
    if (source === 'muse') {
      const descriptionText = job?.contents?.replace(/<[^>]+>/g, '') ?? '';
      return { id: job?.id, title: job?.name ?? 'No Title Provided', company: job?.company?.name ?? 'N/A', location: job?.locations?.[0]?.name ?? 'N/A', description: descriptionText, url: job?.refs?.landing_page, source: 'The Muse' };
    }
    return null;
  } catch (e) {
    console.error("Failed to normalize job:", job, "Source:", source, "Error:", e);
    return null;
  }
};


const LatestJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestJobs = async () => {
            setLoading(true);
            
            // We fetch a small number from each to ensure we have enough to display
            const adzunaAppId = process.env.REACT_APP_ADZUNA_APP_ID;
            const adzunaAppKey = process.env.REACT_APP_ADZUNA_APP_KEY;
            const joobleApiKey = process.env.REACT_APP_JOOBLE_API_KEY;
            const museApiKey = process.env.REACT_APP_MUSE_API_KEY;

            const fetchAdzuna = axios.get(`https://api.adzuna.com/v1/api/jobs/gb/search/1`, { params: { app_id: adzunaAppId, app_key: adzunaAppKey, what: 'remote', results_per_page: 5, 'content-type': 'application/json' }});
            const fetchReed = axios.get('http://localhost:3001/api/reed', { params: { keywords: 'developer', resultsToTake: 5 }});
            const fetchJooble = axios.post(`https://jooble.org/api/${joobleApiKey}`, { keywords: 'remote developer', page: 1 });
            const fetchMuse = axios.get('https://www.themuse.com/api/public/jobs', { params: { api_key: museApiKey, page: 1 } });

            try {
                const results = await Promise.allSettled([fetchAdzuna, fetchReed, fetchJooble, fetchMuse]);
                let allJobs = [];

                if (results[0].status === 'fulfilled' && results[0].value.data.results) { allJobs.push(...results[0].value.data.results.map(job => normalizeJob(job, 'adzuna'))); }
                if (results[1].status === 'fulfilled' && results[1].value.data.results) { allJobs.push(...results[1].value.data.results.map(job => normalizeJob(job, 'reed'))); }
                if (results[2].status === 'fulfilled' && results[2].value.data.jobs) { allJobs.push(...results[2].value.data.jobs.map(job => normalizeJob(job, 'jooble'))); }
                if (results[3].status === 'fulfilled' && results[3].value.data.results) { allJobs.push(...results[3].value.data.results.map(job => normalizeJob(job, 'muse'))); }
                
                const validJobs = allJobs.filter(job => job !== null);
                setJobs(validJobs);

            } catch (err) {
                console.error("Failed to fetch latest jobs:", err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchLatestJobs();
    }, []); // Runs only once on component mount

    if (loading) {
        return <p className="text-center mt-5">Loading latest jobs...</p>;
    }

    if (jobs.length === 0) {
        return null; // Don't render anything if no jobs were found
    }

    return (
        <div className="job-list-section py-5 bg-light">
            <div className="container">
                <h2 className="text-center mb-4">Latest Opportunities</h2>
                <div className="row">
                    {/* We use .slice(0, 4) to only show the first 4 jobs */}
                    {jobs.slice(0, 4).map((job) => (
                        <div key={`${job.source}-${job.id}`} className="col-md-6 mb-4">
                            <div className="card shadow-sm h-100">
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{job.title}</h5>
                                    <p className="card-text text-muted"><strong>{job.company}</strong> ({job.location})</p>
                                    <p className="card-text flex-grow-1">
                                        {job.description?.slice(0, 100) ?? ''}...
                                    </p>
                                    <a href={job.url} className="btn btn-outline-primary mt-auto" target="_blank" rel="noopener noreferrer">
                                        View Job on {job.source}
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-4">
                    <Link to="/joblist" className="btn btn-primary btn-lg">
                        View All Jobs
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LatestJobs;
