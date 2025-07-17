import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

function UserDashboard({ searchTerm = "" }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      axios
        .get("http://localhost:8080/api/movies/all")
        .then((res) => setMovies(res.data || []))
        .catch(() => setError("❌ Failed to load movies."))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const filteredMovies = searchTerm.trim()
    ? movies.filter((movie) =>
        (movie?.title || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    : movies;

  const handleClick = (movie) => {
    if (!movie?.id) return;
    navigate(`/movie/${movie.id}`);
  };

  if (!user) {
    return (
      <div className="container mt-5 text-center">
        <p className="alert alert-danger">⚠️ Please log in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">👋 Welcome, {user.username}</h2>
        <p className="text-muted mb-0">📧 {user.email}</p>
        {user?.role === "ADMIN" && (
          <div className="alert alert-info mt-3">
            ✅ You are logged in as <strong>Admin</strong>.
          </div>
        )}
      </div>

      <h3 className="mb-4">🎬 Available Movies</h3>

      {loading ? (
        <div className="text-center text-primary">⏳ Loading movies...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : filteredMovies.length === 0 ? (
        <div className="alert alert-warning">📭 No movies found.</div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="col"
              onClick={() => handleClick(movie)}
              style={{ cursor: "pointer" }}
            >
              <div className="card h-100 shadow-sm border-0 rounded-4 movie-card">
                {movie.posterUrl ? (
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="card-img-top rounded-top"
                    style={{ height: "280px", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-movie.jpg";
                    }}
                  />
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center bg-light text-muted"
                    style={{ height: "280px" }}
                  >
                    No Image
                  </div>
                )}
                <div className="card-body text-center">
                  <h5 className="card-title text-truncate fw-semibold mb-0">
                    {movie.title || "Untitled Movie"}
                  </h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
