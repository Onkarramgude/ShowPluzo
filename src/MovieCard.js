// src/MovieCard.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function MovieCard({ movie }) {
  const navigate = useNavigate();

  if (!movie || typeof movie !== "object" || !("posterUrl" in movie)) {
    console.warn("⚠️ Invalid movie object:", movie);
    return null;
  }

  const handleBookNow = () => {
    if (!movie?.id) {
      console.warn("⚠️ Movie ID missing for booking", movie);
      return;
    }

    navigate("/select-theater", {
      state: { movie },
    });
  };

  const goToMovieDetails = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="card h-100 shadow-sm rounded-4">
      <img
        src={movie.posterUrl || "/default-poster.jpg"}
        className="card-img-top rounded-top-4"
        alt={movie.title || "Movie Poster"}
        onClick={goToMovieDetails}
        onError={(e) => (e.target.src = "/default-poster.jpg")}
        style={{
          width: "100%",
          height: "350px",
          objectFit: "cover",
          borderRadius: "1rem 1rem 0 0",
          cursor: "pointer",
          backgroundColor: "#f0f0f0",
        }}
      />

      <div className="card-body d-flex flex-column">
        <h5 className="card-title fw-bold">{movie.title || "Untitled"}</h5>

        <p className="card-text text-muted">
          {movie.description?.substring(0, 80) || "No description available"}...
        </p>

        <p className="card-text mb-1">
          <strong>🎬 Director:</strong> {movie.director || "N/A"}
        </p>
        <p className="card-text mb-1">
          <strong>📅 Release:</strong> {movie.releaseDate || "N/A"}
        </p>
        <p className="card-text mb-1">
          <strong>🕐 Duration:</strong> {movie.duration || "N/A"} min
        </p>

        <div className="mb-3">
          <span className="badge bg-info text-dark me-2">
            🎭 {movie.genre || "Genre N/A"}
          </span>
          <span className="badge bg-warning text-dark">
            🌐 {Array.isArray(movie.languages)
              ? movie.languages.join(", ")
              : movie.languages || "Language N/A"}
          </span>
        </div>

        <h6 className="mb-3 text-success">
          🎟️ Price: ₹{movie.price !== undefined ? movie.price : "N/A"}
        </h6>

        <button
          className="btn btn-primary mt-auto w-100 rounded-pill"
          onClick={handleBookNow}
        >
          🎫 Book Now
        </button>
      </div>
    </div>
  );
}

export default MovieCard;
