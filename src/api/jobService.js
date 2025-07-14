// src/api/jobService.js
import axios from "axios";
import { normalizeJob } from "./jobNormalizer";

// --- API Keys ---
// We keep all keys here for future use.
const ADZUNA_APP_ID = process.env.REACT_APP_ADZUNA_APP_ID;
const ADZUNA_APP_KEY = process.env.REACT_APP_ADZUNA_APP_KEY;
const JOOBLE_API_KEY = process.env.REACT_APP_JOOBLE_API_KEY;
const REED_API_KEY = process.env.REACT_APP_REED_API_KEY;
const MUSE_API_KEY = process.env.REACT_APP_MUSE_API_KEY;
const FINDWORK_API_KEY = process.env.REACT_APP_FINDWORK_API_KEY;


// --- Source-Specific Fetchers ---
// This section contains a dedicated function for each API.
// This keeps the logic for each source clean and separated.

/**
 * 
 * 
 * @param {object} filters 
 * @returns {Promise<Array>} 
 */
const fetchFromAdzuna = async (filters) => {
  // Destructure Adzuna-related filters
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
  

  const API_URL = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}`;

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
  
  return data.results.map(job => normalizeJob(job, "Adzuna", { countryCode: country })).filter(Boolean);
};

const fetchFromFindWork = async (filters) => {
  // const { keywords, location, isRemote } = filters;
  // const API_URL = "https://findwork.dev/api/jobs/";
  const { keywords, location, isRemote } = filters;
  // Use the local proxy path
  const API_URL = "/api/findwork/jobs/";

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

const fetchFromJooble = async (filters) => {
  const { keywords, location, page } = filters;
  const API_URL = `https://jooble.org/api/${JOOBLE_API_KEY}`;
  
  const payload = {
    keywords: keywords,
    location: location,
    page: page
  };

  const { data } = await axios.post(API_URL, payload);
  return data.jobs.map(job => normalizeJob(job, "Jooble")).filter(Boolean);
};
/**
 * 
 * @param {object} filters 
 * @returns {Promise<Array>} 
 */
const fetchFromReed = async (filters) => {
  // const { keywords, location, page } = filters;
  // const API_URL = "https://www.reed.co.uk/api/1.0/search";
  const { keywords, location, page } = filters;
  // Use the local proxy path
  const API_URL = "/api/reed/search"; 

  const params = {
    keywords: keywords,
    locationName: location,
    resultsToSkip: (page - 1) * 20, 
    resultsToTake: 20,
  };

  const config = {
    auth: {
      username: REED_API_KEY,
      password: ''
    },
    params: params
  };

  const { data } = await axios.get(API_URL, config);
  return data.results.map(job => normalizeJob(job, "Reed")).filter(Boolean);
};

const fetchFromMuse = async (filters) => {
  const { keywords, location, page } = filters;
  const API_URL = "https://www.themuse.com/api/public/jobs";

  const params = {
    api_key: MUSE_API_KEY,
    page: page,
    // The Muse API uses 'location' and a general text query parameter
    location: location,
    // The Muse doesn't have a direct keyword search, but we can filter by category or level if needed.
    // For now, we'll rely on location and manual filtering of results.
  };

  const { data } = await axios.get(API_URL, { params });
  
  // Manually filter results by keywords since the API doesn't have a 'q' or 'what' param
  const filteredResults = data.results.filter(job => 
    job.name.toLowerCase().includes(keywords.toLowerCase()) || 
    job.contents.toLowerCase().includes(keywords.toLowerCase())
  );

  return filteredResults.map(job => normalizeJob(job, "The Muse")).filter(Boolean);
};


const API_FETCHER_CONFIG = {
  Adzuna: fetchFromAdzuna,
  FindWork: fetchFromFindWork,
  Jooble: fetchFromJooble,
  Reed: fetchFromReed,
  "The Muse": fetchFromMuse,
};

/**
 * 
 * @param {Array<string>} sources 
 * @param {object} filters 
 * @returns {Promise<Array>} 
 */
export const fetchJobsFromSources = async (sources, filters) => {
  const promises = sources.map(source => {
    const fetcher = API_FETCHER_CONFIG[source];
    if (fetcher) {
      return fetcher(filters).catch(error => {
        if (error.response) {
            console.error(`HTTP Error ${error.response.status} fetching from ${source}:`, error.response.data);
        } else {
            console.error(`Error fetching from ${source}:`, error.message);
        }
        return [];
      });
    }
    console.warn(`No fetcher configured for source: ${source}`);
    return Promise.resolve([]);
  });


  const results = await Promise.allSettled(promises);
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
