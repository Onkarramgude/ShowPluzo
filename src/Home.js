// src/Home.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

function Home({ searchTerm = "" }) {
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/movies/all")
      .then((res) => setMovies(res.data || []))
      .catch(() => setError("❌ Failed to load movies."))
      .finally(() => setLoading(false));
  }, []);

  const genres = ["All", ...new Set(movies.map((m) => m.genre).filter(Boolean))];

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = searchTerm
      ? (movie?.title || "").toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesGenre =
      selectedGenre === "All" ||
      (movie?.genre || "").toLowerCase() === selectedGenre.toLowerCase();

    return matchesSearch && matchesGenre;
  });

  const handleClick = (movie) => {
    if (movie?.id) navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="bg-light py-3">
      <div className="container">
        {user && (
          <div className="bg-white p-4 rounded shadow-sm border mb-4">
            <h5 className="mb-1">
              👋 Welcome, <span className="text-primary">{user.username}</span>
            </h5>
            <small className="text-muted">📧 {user.email}</small>
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="text-danger fw-bold mb-0">🎬 Now Showing</h3>
          <div className="d-flex align-items-center gap-2">
            <label className="fw-semibold">🎭 Filter by Genre:</label>
            <select
              className="form-select"
              style={{ maxWidth: "200px" }}
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              {genres.map((g, i) => (
                <option key={i} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-4 fs-5">⏳ Loading movies...</div>
        ) : error ? (
          <div className="alert alert-danger text-center">{error}</div>
        ) : filteredMovies.length === 0 ? (
          <div className="alert alert-warning text-center">
            No movies found for: <strong>{searchTerm || selectedGenre}</strong>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {filteredMovies.map((movie, index) => (
              <div
                className="col"
                key={movie.id || `${movie.title}-${index}`}
                onClick={() => handleClick(movie)}
                style={{ cursor: "pointer" }}
              >
                <div className="card border-0 shadow-sm h-100 rounded-4">
                  <img
                    src={movie.posterUrl || "/default-poster.jpg"}
                    alt={movie.title}
                    className="card-img-top rounded-top-4 home-movie-img"
                    style={{
                      height: "350px",
                      objectFit: "cover",
                      borderTopLeftRadius: "1rem",
                      borderTopRightRadius: "1rem",
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-poster.jpg";
                    }}
                  />
                  <div className="card-body text-center d-flex flex-column">
                    <h5 className="card-title fw-bold">{movie.title}</h5>
                    <div className="mb-2">
                      {movie.genre && (
                        <span className="badge bg-secondary me-1">{movie.genre}</span>
                      )}
                      {movie.languages?.slice(0, 2).map((lang, i) => (
                        <span key={i} className="badge bg-info text-dark me-1">
                          {lang}
                        </span>
                      ))}
                    </div>
                    <p className="text-muted small mt-auto">
                      🕐 {movie.duration || "N/A"} min
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
