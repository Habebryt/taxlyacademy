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
 * Parses a salary string (e.g., "$50k", "£30000") into structured data.
 * @param {string} salaryStr - The salary string from the API.
 * @returns {object} An object with salaryMin, salaryMax, and currency.
 */
const parseSalaryString = (salaryStr) => {
  if (!salaryStr || typeof salaryStr !== "string") {
    return { salaryMin: null, salaryMax: null, currency: "USD" };
  }

  let currency = "USD";
  if (salaryStr.includes("£")) currency = "GBP";
  if (salaryStr.includes("€")) currency = "EUR";
  if (salaryStr.includes("$")) currency = "USD";

  // Remove currency symbols, commas, and get the number part
  const numericPart = salaryStr.replace(/[^0-9.kK]/g, "");
  let value = parseFloat(numericPart);

  // Handle 'k' for thousands
  if (salaryStr.toLowerCase().includes("k")) {
    value *= 1000;
  }

  if (isNaN(value)) {
    return { salaryMin: null, salaryMax: null, currency: "USD" };
  }

  return { salaryMin: value, salaryMax: value, currency: currency };
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
  try {
    if (!job || (!job.id && !job.jobId)) {
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
          currency: "USD", // Default currency as it's not provided
          category: "Tech", // Default category
          contractTime: null,
        };

      case "Jooble":
        const { salaryMin, salaryMax, currency } = parseSalaryString(
          job.salary
        );
        return {
          id: job.id,
          title: job.title,
          company: job.company || "N/A",
          location: job.location,
          // Clean the HTML from the snippet for the description
          description:
            job.snippet?.replace(/<[^>]+>/g, "") || "No description available.",
          url: job.link,
          source: "Jooble", // We label it as Jooble for our UI
          postedDate: new Date(job.updated),
          contractType: job.type,
          salaryMin: salaryMin,
          salaryMax: salaryMax,
          currency: currency,
          category: "General", // Jooble doesn't provide a category
          contractTime: null, // Not provided
        };

      case "Reed":
        return {
          id: job.jobId, // Use `jobId` for Reed
          title: job.jobTitle,
          company: job.employerName || "N/A",
          location: job.locationName,
          description: job.jobDescription,
          url: job.jobUrl,
          source: "Reed",
          postedDate: new Date(job.date),
          salaryMin: job.minimumSalary,
          salaryMax: job.maximumSalary,
          currency: job.currency,
          category: "General",
          contractType: null,
          contractTime: null,
        };

      // TODO: Add cases for "The Muse" and "FindWork" here later.
      case "The Muse":
        // The Muse has a unique structure
        return {
          id: job.id,
          title: job.name,
          company: job.company.name,
          // Location is an array, take the first one
          location: job.locations.length > 0 ? job.locations[0].name : "N/A",
          // Description is HTML content
          description: job.contents.replace(/<[^>]+>/g, ""), // Strip HTML for snippet
          url: job.refs.landing_page,
          source: "The Muse",
          postedDate: new Date(job.publication_date),
          // Category is an array, take the first one
          category:
            job.categories.length > 0 ? job.categories[0].name : "General",
          // Other fields are not directly available in the same format
          salaryMin: null,
          salaryMax: null,
          currency: "USD",
          contractType: null,
          contractTime: null,
        };

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
