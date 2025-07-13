// src/api/jobNormalizer.js

// This file should be placed alongside a new file: `src/constants/countries.js`
// For this example, we'll define the countries constant here.
// In a real project, you would: import { COUNTRIES } from '../constants/countries';
const COUNTRIES = [
  { name: "United Kingdom", code: "gb", currency: "GBP" },
  { name: "United States", code: "us", currency: "USD" },
  { name: "Nigeria", code: "ng", currency: "NGN" },
  { name: "Canada", code: "ca", currency: "CAD" },
  { name: "Australia", code: "au", currency: "AUD" },
  { name: "Germany", code: "de", currency: "EUR" },
  { name: "France", code: "fr", currency: "EUR" },
  { name: "India", code: "in", currency: "INR" },
  { name: "South Africa", code: "za", currency: "ZAR" },
];

/**
 * A helper function to get the correct currency code for a given country.
 * @param {string} countryCode - The ISO 3166-1 country code (e.g., 'gb').
 * @returns {string} The three-letter currency code (e.g., 'GBP'). Defaults to 'USD'.
 */
const getCurrencyForCountry = (countryCode) => {
  const country = COUNTRIES.find((c) => c.code === countryCode);
  return country ? country.currency : "USD";
};

/**
 * Transforms a raw job object from a specific API source into a consistent,
 * standardized format that the rest of the application can use.
 * @param {object} job - The raw job object from the API.
 * @param {string} source - The name of the API source (e.g., "Adzuna").
 * @param {object} options - An optional object for passing extra data, like the countryCode.
 * @returns {object|null} A standardized job object, or null if normalization fails.
 */
export const normalizeJob = (job, source, options = {}) => {
  // Always wrap in a try...catch to prevent a single bad job object
  // from crashing the entire application.
  try {
    // Return null if the job object is invalid
    if (!job || !job.id) {
      return null;
    }

    // Use a switch statement for clarity and easy extension in the future.
    switch (source) {
      case "Adzuna":
        return {
          id: job.id,
          title: job.title ?? "No Title Provided",
          company: job.company?.display_name ?? "N/A",
          location: job.location?.display_name ?? "N/A",
          description: job.description ?? "No description available.",
          url: job.redirect_url,
          source: "Adzuna", // Hardcode the source name
          postedDate: new Date(job.created),

          // Use the structured salary data provided by Adzuna
          salaryMin: job.salary_min,
          salaryMax: job.salary_max,

          // Determine currency from the country code passed in options
          currency: getCurrencyForCountry(options.countryCode),

          // Extract other valuable, structured data
          category: job.category?.label ?? "General",
          contractType: job.contract_type, // e.g., 'permanent', 'contract'
          contractTime: job.contract_time, // e.g., 'full_time', 'part_time'
        };

      case "FindWork":
        return {
          id: job.id,
          title: job.role,
          company: job.company_name || "N/A",
          location: job.location || (job.remote ? "Remote" : "N/A"),
          description: job.text || "No description available.",
          url: job.url,
          source: job.source || "FindWork",
          postedDate: new Date(job.date_posted || job.created_at),
          // FindWork provides employment_type which maps well to our contractType
          contractType: job.employment_type,
          // Other fields are not provided by FindWork in the same way as Adzuna
          salaryMin: null,
          salaryMax: null,
          currency: 'USD', // Default currency as it's not provided
          category: "Tech", // Default category
          contractTime: null,
        };

      // TODO: When you're ready to add Jooble, add its case here.
      // case "Jooble":
      //   return {
      //     id: job.id,
      //     title: job.title,
      //     // ... and so on for all Jooble fields
      //   };

      // TODO: Add cases for "The Muse" and "FindWork" here later.

      default:
        // If the source is unknown, log a warning and return null.
        console.warn(`Normalization not implemented for source: ${source}`);
        return null;
    }
  } catch (error) {
    console.error(`Failed to normalize job from source ${source}:`, {
      job,
      error: error.message,
    });
    return null; // Ensure function returns null on error
  }
};
