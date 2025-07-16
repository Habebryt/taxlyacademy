import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchJobsFromSources } from '../api/jobService';
import JobCard from './JobListings/JobCard';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";


const FeaturedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFeaturedJobs = async () => {
      
      if (jobs.length === 0) {
        setLoading(true);
      }

      const sourcesToFeature = ['Adzuna', 'FindWork', 'Jooble', 'Reed', 'The Muse'];
      
      const filters = {
        keywords: 'remote',
        location: '',
        page: 1,
        country: 'gb',
        isRemote: true,
      };

      try {
        const fetchedJobs = await fetchJobsFromSources(sourcesToFeature, filters);
        const oneHourAgo = new Date();
        oneHourAgo.setHours(oneHourAgo.getHours() - 1);
        const recentJobs = fetchedJobs.filter(job => {
          return job.postedDate && new Date(job.postedDate) > oneHourAgo;
        });
        const uniqueJobs = Array.from(
          recentJobs.reduce((map, job) => {
            if (job && job.url) {
              map.set(job.url, job);
            }
            return map;
          }, new Map()).values()
        );

        uniqueJobs.sort((a, b) => (b.salaryMin ? 1 : 0) - (a.salaryMin ? 1 : 0));

        setJobs(uniqueJobs.slice(0, 10));

      } catch (err) {
        console.error("Failed to fetch featured jobs:", err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    getFeaturedJobs();


    const intervalId = setInterval(getFeaturedJobs, 600000);

    return () => clearInterval(intervalId);
    
  }, []); // The empty dependency array ensures this setup runs only once.

  const sliderSettings = {
    dots: true,
    infinite: jobs.length > 3,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } }
    ]
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <p>Loading latest opportunities...</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
        <div className="job-list-section py-5 bg-light">
            <div className="container text-center">
                <h2 className="text-center mb-4">Latest Opportunities</h2>
                <p className="text-muted">No new jobs posted in the last hour. Check back soon!</p>
                <div className="mt-4">
                    <Link to="/joblistpage" className="btn btn-primary btn-lg">
                        View All Jobs
                    </Link>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="job-list-section py-5 bg-light">
      <div className="container">
        <h2 className="text-center mb-4">Latest Opportunities</h2>
        <Slider {...sliderSettings}>
          {jobs.map((job) => (
            <div key={`${job.source}-${job.id}`} className="p-2">
              <JobCard
                job={job}
                onSelectJob={() => window.open(job.url, '_blank')}
              />
            </div>
          ))}
        </Slider>
        <div className="text-center mt-5">
          <Link to="/joblistpage" className="btn btn-primary btn-lg">
            View All Jobs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedJobs;
