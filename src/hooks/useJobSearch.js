// src/hooks/useJobSearch.js
import { useState, useEffect, useCallback } from "react";
import { fetchJobsFromSources, fetchAdzunaCategories } from "../api/jobService";

export const useJobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [filters, setFilters] = useState({
    selectedSources: ['Adzuna', 'FindWork', 'Jooble', 'Reed', 'The Muse'],
    keywords: "remote developer",
    location: "london",
    isRemote: true,
    country: "gb",
    sortBy: "relevance", // NEW: Added sortBy to the filter state
    dateRange: "30",
    category: "",
    salaryMin: "",
    contractType: "",
    contractTime: "",
  });

  useEffect(() => {
    const getCategories = async () => {
      if (filters.selectedSources.includes("Adzuna")) {
        setLoadingCategories(true);
        setCategories([]);
        const fetchedCategories = await fetchAdzunaCategories(filters.country);
        setCategories(fetchedCategories);
        setLoadingCategories(false);
      } else {
        setCategories([]);
      }
    };
    getCategories();
  }, [filters.country, filters.selectedSources]);

  const executeSearch = useCallback(async (page = 1) => {
    if (filters.selectedSources.length === 0) {
        setJobs([]);
        setLoading(false);
        return;
    }
    setLoading(true);
    setError("");
    setCurrentPage(page);

    try {
      const apiParams = {
        ...filters,
        page,
        max_days_old: filters.dateRange !== "all" ? parseInt(filters.dateRange, 10) : undefined,
      };
      
      let fetchedJobs = await fetchJobsFromSources(filters.selectedSources, apiParams);
      if (filters.sortBy === 'date') {
        fetchedJobs.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
      } else if (filters.sortBy === 'salary') {
        fetchedJobs.sort((a, b) => (b.salaryMax || b.salaryMin || 0) - (a.salaryMax || a.salaryMin || 0));
      }

      setJobs(fetchedJobs);
    } catch (err) {
      setError("An error occurred while fetching jobs.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { executeSearch(1); }, [executeSearch]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSearch = (e) => { e?.preventDefault(); executeSearch(1); };
  const handlePageChange = (newPage) => { if (newPage > 0) { executeSearch(newPage); window.scrollTo(0, 0); } };

  return {
    jobs, loading, error, filters, handleFilterChange, handleSearch,
    currentPage, handlePageChange, categories, loadingCategories,
    hasMorePages: jobs.length >= 20,
  };
};
