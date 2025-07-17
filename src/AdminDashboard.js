import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function AdminDashboard() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter((movie) =>
        movie.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
  }, [searchQuery, movies]);

  const fetchMovies = () => {
    axios
      .get("http://localhost:8080/api/movies/all")
      .then((res) => {
        setMovies(res.data);
        setFilteredMovies(res.data);
      })
      .catch((err) => {
        setError("❌ Failed to load movies");
        console.error(err);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      axios
        .delete(`http://localhost:8080/api/movies/${id}`)
        .then(() => fetchMovies())
        .catch(() => alert("❌ Failed to delete movie"));
    }
  };

  const renderTheaters = (locations) => {
    if (!Array.isArray(locations) || locations.length === 0) return "N/A";
    return locations.map((loc, i) => `${loc.name} (${loc.city})`).join(", ");
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold">🎬 Admin Movie Dashboard</h2>
        <Link to="/admin/add-movie" className="btn btn-success btn-lg shadow">
          ➕ Add New Movie
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control shadow-sm"
          placeholder="🔍 Search movies by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {filteredMovies.length === 0 ? (
        <div className="alert alert-info text-center">No movies found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-striped table-bordered shadow rounded-4 overflow-hidden">
            <thead className="table-dark text-center align-middle">
              <tr>
                <th>Poster</th>
                <th>Title & Info</th>
                <th>Theaters</th>
                <th>Show Times</th>
                <th>Year</th>
                <th>Prices (₹)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="align-middle">
              {filteredMovies.map((movie) => (
                <tr key={movie.id}>
                  <td className="text-center">
                    <img
                      src={movie.posterUrl || "/default-poster.jpg"}
                      alt="poster"
                      className="rounded shadow-sm"
                      style={{ width: "60px", height: "90px", objectFit: "cover" }}
                      onError={(e) => (e.target.src = "/default-poster.jpg")}
                    />
                  </td>

                  <td>
                    <strong className="text-dark fs-6">{movie.title || "Untitled"}</strong>
                    <div className="mt-1">
                      {movie.genre && (
                        <span className="badge bg-secondary me-1">{movie.genre}</span>
                      )}
                      {movie.languages?.map((lang, i) => (
                        <span key={i} className="badge bg-info text-dark me-1">{lang}</span>
                      ))}
                    </div>
                  </td>

                  <td className="text-muted small">{renderTheaters(movie.theaterLocations)}</td>

                  <td className="text-center">
                    {movie.showTimes?.map((time, i) => (
                      <span key={i} className="badge bg-light border text-dark me-1">
                        {time}
                      </span>
                    ))}
                  </td>

                  <td className="text-center fw-bold text-secondary">{movie.year || "N/A"}</td>

                  <td className="text-center">
                    <span className="badge bg-success d-block mb-1">
                      Front: ₹{movie.frontSeatPrice ?? "N/A"}
                    </span>
                    <span className="badge bg-warning text-dark d-block mb-1">
                      Middle: ₹{movie.middleSeatPrice ?? "N/A"}
                    </span>
                    <span className="badge bg-danger d-block">
                      Back: ₹{movie.backSeatPrice ?? "N/A"}
                    </span>
                  </td>

                  <td className="text-center">
                    <Link
                      to={`/admin/edit-movie/${movie.id}`}
                      className="btn btn-sm btn-warning me-2"
                    >
                      ✏️ Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(movie.id)}
                      className="btn btn-sm btn-danger"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
