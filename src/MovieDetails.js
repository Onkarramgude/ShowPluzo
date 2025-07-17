import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Invalid movie ID.");
      return;
    }

    axios
      .get(`http://localhost:8080/api/movies/${id}`)
      .then((res) => {
        setMovie(res.data);
      })
      .catch((err) => {
        console.error("❌ Failed to load movie details", err);
        setError("Could not load movie details.");
      });
  }, [id]);

  const handleBookNow = () => {
    if (movie && movie.id) {
      navigate("/select-theater", { state: { movie } });
    } else {
      alert("Something went wrong. Movie ID is missing.");
    }
  };

  if (error) {
    return <div className="container mt-4 alert alert-danger">{error}</div>;
  }

  if (!movie) {
    return <div className="container mt-4 text-center">⏳ Loading movie details...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">{movie.title || "Untitled Movie"}</h2>
        <button className="btn btn-outline-dark" onClick={() => navigate("/movies")}>
          ← Back to Movies
        </button>
      </div>

      <div className="row g-4">
        <div className="col-md-5">
          <img
            src={movie.posterUrl || "/default-movie.jpg"}
            alt={movie.title}
            className="img-fluid rounded shadow"
            style={{ maxHeight: "420px", objectFit: "contain" }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default-movie.jpg";
            }}
          />
        </div>

        <div className="col-md-7">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <p><strong>Description:</strong> {movie.description || "N/A"}</p>
            <p><strong>Director:</strong> {movie.director || "N/A"}</p>
            <p><strong>Release Date:</strong> {movie.releaseDate || "N/A"}</p>
            <p><strong>Year:</strong> {movie.year || "N/A"}</p>
            <p><strong>Duration:</strong> {movie.duration || "N/A"} min</p>

            <div className="mb-3">
              <span className="badge bg-info text-dark me-2">🎞 {movie.genre || "Unknown Genre"}</span>
              {movie.languages?.length > 0 ? (
                movie.languages.map((lang, i) => (
                  <span key={i} className="badge bg-warning text-dark me-2">
                    🌐 {lang}
                  </span>
                ))
              ) : (
                <span className="badge bg-secondary">🌐 No Languages</span>
              )}
            </div>

            <h5 className="text-success fw-bold">
              🎟 Ticket Price: ₹{movie.price || "0"}
            </h5>

            <div className="text-end mt-4">
              <button className="btn btn-primary px-4 rounded-pill" onClick={handleBookNow}>
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
