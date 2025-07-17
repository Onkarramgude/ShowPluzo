// src/Movies.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "./MovieCard";
import "bootstrap/dist/css/bootstrap.min.css";

function Movies({ searchTerm = "" }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/movies/all")
      .then((res) => {
        if (Array.isArray(res.data)) setMovies(res.data);
        else setError("Invalid movie data format.");
      })
      .catch((err) => {
        console.error("❌ Failed to fetch movies:", err);
        setError("Failed to load movies.");
      })
      .finally(() => setLoading(false));
  }, []);

  const genres = ["All", ...new Set(movies.map((m) => m.genre).filter(Boolean))];

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = searchTerm.trim()
      ? (movie?.title || "").toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesGenre =
      selectedGenre === "All" ||
      (movie?.genre || "").toLowerCase() === selectedGenre.toLowerCase();

    return matchesSearch && matchesGenre;
  });

  return (
    <div className="container mt-4 mb-5">
      <h2 className="mb-4 text-center text-danger fw-bold">🎞️ Browse All Movies</h2>

      <div className="d-flex justify-content-end align-items-center mb-3">
        <label className="me-2 fw-semibold">🎭 Filter by Genre:</label>
        <select
          className="form-select"
          style={{ maxWidth: "200px" }}
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          {genres.map((genre, i) => (
            <option key={i} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-danger" role="status" />
          <p className="mt-2">Loading movies...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : filteredMovies.length === 0 ? (
        <div className="alert alert-warning text-center">
          No movies found for: <strong>{searchTerm || selectedGenre}</strong>
        </div>
      ) : (
        <div className="row g-4">
          {filteredMovies.map((movie) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={movie.id}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Movies;
