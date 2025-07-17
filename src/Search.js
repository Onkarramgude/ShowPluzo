// src/Search.js
import React, { useState, useMemo, useEffect } from "react";
import debounce from "lodash.debounce";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        if (typeof onSearch === "function") {
          onSearch(value);
        }
      }, 300),
    [onSearch]
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <div className="position-relative w-100">
      <input
        type="search"
        className="form-control rounded-pill px-4 py-2 shadow-sm"
        placeholder=" Search movies..."
        value={query}
        onChange={handleChange}
        style={{ fontSize: "0.95rem" }}
      />

      {query && (
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary position-absolute top-50 end-0 translate-middle-y me-2 rounded-circle"
          onClick={() => {
            setQuery("");
            debouncedSearch("");
          }}
          aria-label="Clear search"
          style={{ width: "30px", height: "30px", lineHeight: "1" }}
        >
          &times;
        </button>
      )}
    </div>
  );
}

export default SearchBar;
