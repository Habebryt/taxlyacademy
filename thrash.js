import React from "react";

// This should be imported from a central constants file in a real app
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
 * @param {object} props
 * @param {object} props.filters
 * @param {function} props.onFilterChange
 * @param {function} props.onSearch
 * @param {boolean} props.loading
 * @param {Array} props.categories
 * @param {boolean} props.loadingCategories
 */
const SearchForm = ({
  filters,
  onFilterChange,
  onSearch,
  loading,
  categories,
  loadingCategories,
}) => {
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    onFilterChange({ [name]: newValue });
  };

  const handleSourceChange = (source) => {
    const newSources = filters.selectedSources.includes(source)
      ? filters.selectedSources.filter((s) => s !== source)
      : [...filters.selectedSources, source];
    onFilterChange({ selectedSources: newSources });
  };

  const JOB_SOURCES = ["Adzuna", "FindWork", "Jooble", "Reed", "The Muse"];

  return (
    <form onSubmit={onSearch} className="bg-white p-4 rounded">
      {/* --- Job Boards --- */}     {" "}
      <div className="mb-3">
                <label className="form-label fw-bold">Job Boards</label>       {" "}
        <div className="d-flex flex-wrap gap-3">
                   {" "}
          {JOB_SOURCES.map((source) => (
            <div key={source} className="form-check form-check-inline">
                           {" "}
              <input
                className="form-check-input"
                type="checkbox"
                id={`source-${source}`}
                checked={filters.selectedSources.includes(source)}
                onChange={() => handleSourceChange(source)}
              />
                           {" "}
              <label className="form-check-label" htmlFor={`source-${source}`}>
                {source}
              </label>
                           {" "}
            </div>
          ))}
                   {" "}
        </div>
             {" "}
      </div>
      {/* --- Common Filters --- */}     {" "}
      <div className="row g-3 mb-3">
               {" "}
        <div className="col-md-12">
                   {" "}
          <label htmlFor="keywords-input" className="form-label fw-bold">
            Keywords
          </label>
                   {" "}
          <input
            id="keywords-input"
            name="keywords"
            type="text"
            className="form-control"
            value={filters.keywords}
            onChange={handleInputChange}
          />
                 {" "}
        </div>
             {" "}
      </div>
      <div className="row g-3 mb-3">
        <div className="col-md-8">
          <label htmlFor="location" className="form-label fw-bold">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            className="form-control"
            value={filters.location}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-4 d-flex align-items-end">
                   {" "}
          <div className="form-check form-switch">
                         
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="isRemote"
              name="isRemote"
              checked={filters.isRemote}
              onChange={handleInputChange}
            />
                         
            <label className="form-check-label" htmlFor="isRemote">
              Remote Only
            </label>
                     {" "}
          </div>
                 {" "}
        </div>
      </div>
      {/* --- Sorting Filter --- */}
      <div className="mb-3">
        <label htmlFor="sortBy" className="form-label fw-bold">
          Sort By
        </label>
        <select
          id="sortBy"
          name="sortBy"
          className="form-select"
          value={filters.sortBy}
          onChange={handleInputChange}
        >
          <option value="relevance">Relevance</option>
          <option value="date">Date (Newest First)</option>
          <option value="salary">Salary (Highest First)</option>
        </select>
      </div>
                  <hr />     {" "}
      <p className="text-muted small">
        Adzuna-specific filters (only apply when Adzuna is selected)
      </p>
            {/* Adzuna-specific filters */}     {" "}
      <div className="row g-3 mb-3">
               {" "}
        <div className="col-md-6">
                   {" "}
          <label htmlFor="country-select" className="form-label fw-bold">
            Country
          </label>
                   {" "}
          <select
            id="country-select"
            name="country"
            className="form-select"
            value={filters.country}
            onChange={handleInputChange}
            disabled={!filters.selectedSources.includes("Adzuna")}
          >
                       {" "}
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
                     {" "}
          </select>
                 {" "}
        </div>
               {" "}
        <div className="col-md-6">
                   {" "}
          <label htmlFor="category-select" className="form-label fw-bold">
            Category
          </label>
                   {" "}
          <select
            id="category-select"
            name="category"
            className="form-select"
            value={filters.category}
            onChange={handleInputChange}
            disabled={
              !filters.selectedSources.includes("Adzuna") ||
              loadingCategories ||
              categories.length === 0
            }
          >
                        <option value="">All Categories</option>           {" "}
            {loadingCategories ? (
              <option disabled>Loading...</option>
            ) : (
              categories.map((cat) => (
                <option key={cat.tag} value={cat.tag}>
                  {cat.label}
                </option>
              ))
            )}
                     {" "}
          </select>
                 {" "}
        </div>
             {" "}
      </div>
           {" "}
      <button
        type="submit"
        className="btn btn-primary w-100 fw-bold py-2"
        disabled={loading || filters.selectedSources.length === 0}
      >
                {loading ? "Searching..." : "Find Jobs"}     {" "}
      </button>
         {" "}
    </form>
  );
};

export default SearchForm;
