// src/api/jobService.js
import axios from "axios";
import { normalizeJob } from "./jobNormalizer";

// --- API Keys ---
// We keep all keys here for future use.
const ADZUNA_APP_ID = process.env.REACT_APP_ADZUNA_APP_ID;
const ADZUNA_APP_KEY = process.env.REACT_APP_ADZUNA_APP_KEY;
// const JOOBLE_API_KEY = process.env.REACT_APP_JOOBLE_API_KEY;
// const MUSE_API_KEY = process.env.REACT_APP_MUSE_API_KEY;
const FINDWORK_API_KEY = process.env.REACT_APP_FINDWORK_API_KEY;


// --- Source-Specific Fetchers ---
// This section contains a dedicated function for each API.
// This keeps the logic for each source clean and separated.

/**
 * Fetches jobs specifically from the Adzuna API.
 * This function handles the detailed filtering that only Adzuna supports.
 * @param {object} filters - The filter state from the useJobSearch hook.
 * @returns {Promise<Array>} A promise that resolves to an array of normalized Adzuna jobs.
 */
const fetchFromAdzuna = async (filters) => {
  // Destructure all possible Adzuna-related filters
  const {
    country,
    page,
    keywords,
    location,
    category,
    salaryMin,
    contractType,
    contractTime,
    sortBy,
    max_days_old
  } = filters;
  

  // The API endpoint is dynamic based on the selected country
  const API_URL = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}`;

  // Construct the query parameters, omitting any that are empty or null
  const params = {
    app_id: ADZUNA_APP_ID,
    app_key: ADZUNA_APP_KEY,
    results_per_page: 20,
    what: keywords,
    where: location,
    category: category || undefined,
    salary_min: salaryMin || undefined,
    contract_type: contractType || undefined,
    full_time: contractTime === 'full_time' ? 1 : undefined,
    part_time: contractTime === 'part_time' ? 1 : undefined,
    sort_by: sortBy || 'relevance',
    max_days_old: max_days_old || undefined,
  };

  const { data } = await axios.get(API_URL, { params });
  
  // Pass the country code to the normalizer to get the correct currency
  // The 'Adzuna' string tells the normalizer which logic to use
  return data.results.map(job => normalizeJob(job, "Adzuna", { countryCode: country })).filter(Boolean);
};

// TODO: When you are ready to add Jooble, create its fetcher function here.
// const fetchFromJooble = async (filters) => { ... };

const fetchFromFindWork = async (filters) => {
  const { keywords, location, isRemote } = filters;
  const API_URL = "https://findwork.dev/api/jobs/";

  const params = {
    search: keywords,
    location: location,
    remote: isRemote, // FindWork uses a boolean `remote` parameter
  };

  // FindWork API requires the token in the Authorization header
  const config = {
    headers: {
      'Authorization': `Token ${FINDWORK_API_KEY}`
    },
    params: params
  };

  const { data } = await axios.get(API_URL, config);
  // The normalizer doesn't need a countryCode for FindWork
  return data.results.map(job => normalizeJob(job, "FindWork")).filter(Boolean);
};

// --- API Fetcher Configuration ---
// This object maps a source name to its dedicated fetching function.
// This is the key to making the system easily extensible.
const API_FETCHER_CONFIG = {
  Adzuna: fetchFromAdzuna,
  FindWork: fetchFromFindWork
};


// --- Main Exported Functions ---

/**
 * Fetches jobs from a list of specified sources by dispatching to the correct fetcher.
 * @param {Array<string>} sources - An array of source names (e.g., ['Adzuna']).
 * @param {object} filters - The global filter object passed to each fetcher.
 * @returns {Promise<Array>} A promise resolving to a flat array of all jobs from all sources.
 */
export const fetchJobsFromSources = async (sources, filters) => {
  // Create an array of promises, one for each requested source
  const promises = sources.map(source => {
    const fetcher = API_FETCHER_CONFIG[source];
    if (fetcher) {
      // Call the specific fetcher function for the source
      return fetcher(filters).catch(error => {
        console.error(`Error fetching from ${source}:`, error.message);
        return []; // Return an empty array on failure to prevent the whole search from failing
      });
    }
    // If the source is not configured, return a resolved promise with an empty array
    console.warn(`No fetcher configured for source: ${source}`);
    return Promise.resolve([]);
  });

  // Wait for all fetches to complete (or fail gracefully)
  const results = await Promise.allSettled(promises);
  
  // Flatten the arrays of jobs from all successful sources into a single array
  return results
    .filter(result => result.status === 'fulfilled')
    .flatMap(result => result.value);
};

/**
 * Fetches the available job categories specifically from Adzuna.
 * This is a source-specific utility function needed for the category filter.
 * @param {string} country - The ISO 3166-1 country code (e.g., 'gb').
 * @returns {Promise<Array>} A promise resolving to Adzuna's category list for that country.
 */
export const fetchAdzunaCategories = async (country) => {
    // A country code is required for this endpoint
    if (!country) return [];
    
    try {
        const { data } = await axios.get(`https://api.adzuna.com/v1/api/jobs/${country}/categories`, {
            params: { app_id: ADZUNA_APP_ID, app_key: ADZUNA_APP_KEY },
        });
        return data.results;
    } catch (error) {
        console.error(`Error fetching categories from Adzuna for country ${country}:`, error.message);
        return []; // Return an empty array on failure
    }
};
