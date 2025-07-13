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
    // A new filter to control which APIs are called
    selectedSources: ["Adzuna", "FindWork", "Jooble", "Reed"],
    // Common filters
    keywords: "remote virtual assistant",
    location: "",
    isRemote: true, // A common flag for remote jobs
    // Adzuna-specific filters
    country: "gb",
    sortBy: "relevance",
    dateRange: "30",
    category: "",
    salaryMin: "",
    contractType: "",
    contractTime: "",
  });

  useEffect(() => {
    const getCategories = async () => {
      // Only fetch Adzuna categories if Adzuna is a selected source
      if (filters.selectedSources.includes("Adzuna")) {
        setLoadingCategories(true);
        setCategories([]);
        const fetchedCategories = await fetchAdzunaCategories(filters.country);
        setCategories(fetchedCategories);
        setLoadingCategories(false);
      } else {
        // If Adzuna is not selected, clear categories
        setCategories([]);
      }
    };
    getCategories();
  }, [filters.country, filters.selectedSources]);

  const executeSearch = useCallback(
    async (page = 1) => {
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
          max_days_old:
            filters.dateRange !== "all"
              ? parseInt(filters.dateRange, 10)
              : undefined,
        };
        const fetchedJobs = await fetchJobsFromSources(
          filters.selectedSources,
          apiParams
        );
        // Simple sort to bring jobs with salary info to the top
        fetchedJobs.sort(
          (a, b) => (b.salaryMin ? 1 : 0) - (a.salaryMin ? 1 : 0)
        );
        setJobs(fetchedJobs);
      } catch (err) {
        setError("An error occurred while fetching jobs.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    executeSearch(1);
  }, [executeSearch]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters };
      if (newFilters.country && newFilters.country !== prev.country) {
        updated.category = "";
      }
      return updated;
    });
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    executeSearch(1);
  };
  const handlePageChange = (newPage) => {
    if (newPage > 0) {
      executeSearch(newPage);
      window.scrollTo(0, 0);
    }
  };

  return {
    jobs,
    loading,
    error,
    filters,
    handleFilterChange,
    handleSearch,
    currentPage,
    handlePageChange,
    categories,
    loadingCategories,
    hasMorePages: jobs.length >= 20,
  };
};
