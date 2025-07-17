import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function EditMovie() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState({
    title: "",
    description: "",
    languages: [],
    director: "",
    genre: "",
    releaseDate: "",
    year: "",
    duration: "",
    showTimes: [],
    theaterLocations: [],
    frontSeatPrice: 0,
    middleSeatPrice: 0,
    backSeatPrice: 0,
    frontSeatLimit: 0,
    middleSeatLimit: 0,
    backSeatLimit: 0,
    posterUrl: "",
  });

  const [allTheaters, setAllTheaters] = useState([]);
  const [newShowTime, setNewShowTime] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/movies/${id}`)
      .then((res) => {
        const data = res.data;
        setMovie({
          ...data,
          languages: data.languages || [],
          showTimes: data.showTimes || [],
          theaterLocations: data.theaterLocations || [],
        });
      })
      .catch(() => setError("❌ Failed to load movie"));

    axios.get("http://localhost:8080/api/movies/admin/all-theaters", {
      withCredentials: true,
    })
      .then((res) => setAllTheaters(res.data))
      .catch(() => setError("❌ Failed to load theaters"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovie((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddItem = (item, setItem, listName) => {
    if (item && !movie[listName].includes(item)) {
      setMovie((prev) => ({ ...prev, [listName]: [...prev[listName], item] }));
      setItem("");
    }
  };

  const handleRemoveItem = (item, listName) => {
    setMovie((prev) => ({
      ...prev,
      [listName]: prev[listName].filter((i) => i !== item),
    }));
  };

  const handleAddTheater = (e) => {
    const selectedId = e.target.value;
    const selected = allTheaters.find((t) => t.id.toString() === selectedId);
    if (selected && !movie.theaterLocations.some((t) => t.id === selected.id)) {
      setMovie((prev) => ({
        ...prev,
        theaterLocations: [...prev.theaterLocations, selected],
      }));
    }
  };

  const handleRemoveTheater = (id) => {
    setMovie((prev) => ({
      ...prev,
      theaterLocations: prev.theaterLocations.filter((t) => t.id !== id),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...movie,
      theaterIds: movie.theaterLocations.map((t) => t.id),
    };
    axios
      .put(`http://localhost:8080/api/movies/update/${id}`, payload)
      .then(() => {
        alert("✅ Movie updated successfully");
        navigate("/dashboard");
      })
      .catch(() => alert("❌ Failed to update movie"));
  };

  if (loading) return <div className="text-center mt-4">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4 text-primary fw-bold">✏️ Edit Movie</h2>
      <form onSubmit={handleSubmit} className="shadow-sm p-4 bg-light rounded-4">
        <div className="mb-3">
          <label className="form-label fw-semibold">Title *</label>
          <input type="text" name="title" className="form-control" value={movie.title} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Description</label>
          <textarea name="description" className="form-control" rows="3" value={movie.description} onChange={handleChange} />
        </div>

        {/* Languages Section */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Languages</label>
          <div className="input-group">
            <input className="form-control" value={newLanguage} onChange={(e) => setNewLanguage(e.target.value)} />
            <button type="button" className="btn btn-outline-secondary" onClick={() => handleAddItem(newLanguage, setNewLanguage, "languages")}>Add</button>
          </div>
          <div className="mt-2">
            {movie.languages.map((lang, i) => (
              <span key={`lang-${i}`} className="badge bg-info text-dark me-2 mb-1">
                {lang} <span role="button" onClick={() => handleRemoveItem(lang, "languages")}>❌</span>
              </span>
            ))}
          </div>
        </div>

        {/* Show Times Section */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Show Times</label>
          <div className="input-group">
            <input type="time" className="form-control" value={newShowTime} onChange={(e) => setNewShowTime(e.target.value)} />
            <button type="button" className="btn btn-outline-secondary" onClick={() => handleAddItem(newShowTime, setNewShowTime, "showTimes")}>Add</button>
          </div>
          <div className="mt-2">
            {movie.showTimes.map((time, i) => (
              <span key={`time-${i}`} className="badge bg-secondary me-2 mb-1">
                {time} <span role="button" onClick={() => handleRemoveItem(time, "showTimes")}>❌</span>
              </span>
            ))}
          </div>
        </div>

        {/* Director, Genre, Duration */}
        <div className="row">
          <div className="mb-3 col-md-4">
            <label className="form-label fw-semibold">Director</label>
            <input type="text" name="director" className="form-control" value={movie.director} onChange={handleChange} />
          </div>
          <div className="mb-3 col-md-4">
            <label className="form-label fw-semibold">Genre</label>
            <input type="text" name="genre" className="form-control" value={movie.genre} onChange={handleChange} />
          </div>
          <div className="mb-3 col-md-4">
            <label className="form-label fw-semibold">Duration (min)</label>
            <input type="number" name="duration" className="form-control" value={movie.duration} onChange={handleChange} />
          </div>
        </div>

        {/* Release Date and Year */}
        <div className="row">
          <div className="mb-3 col-md-6">
            <label className="form-label fw-semibold">Release Date</label>
            <input type="date" name="releaseDate" className="form-control" value={movie.releaseDate} onChange={handleChange} />
          </div>
          <div className="mb-3 col-md-6">
            <label className="form-label fw-semibold">Year</label>
            <input type="number" name="year" className="form-control" value={movie.year} onChange={handleChange} />
          </div>
        </div>

        {/* Theater Locations */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Theater Locations</label>
          <select className="form-select" onChange={handleAddTheater}>
            <option value="">-- Select Theater --</option>
            {allTheaters.map((t) => (
              <option key={t.id} value={t.id}>{t.name} ({t.city})</option>
            ))}
          </select>
          <div className="mt-2">
            {movie.theaterLocations.map((t) => (
              <span key={t.id} className="badge bg-primary me-2 mb-1">
                {t.name} ({t.city}) <span role="button" onClick={() => handleRemoveTheater(t.id)}>❌</span>
              </span>
            ))}
          </div>
        </div>

        {/* Prices and Limits */}
        <div className="row">
          <div className="mb-3 col-md-4">
            <label className="form-label fw-semibold">Front Seat Price</label>
            <input type="number" name="frontSeatPrice" className="form-control" value={movie.frontSeatPrice} onChange={handleChange} />
          </div>
          <div className="mb-3 col-md-4">
            <label className="form-label fw-semibold">Middle Seat Price</label>
            <input type="number" name="middleSeatPrice" className="form-control" value={movie.middleSeatPrice} onChange={handleChange} />
          </div>
          <div className="mb-3 col-md-4">
            <label className="form-label fw-semibold">Back Seat Price</label>
            <input type="number" name="backSeatPrice" className="form-control" value={movie.backSeatPrice} onChange={handleChange} />
          </div>
        </div>

        <div className="row">
          <div className="mb-3 col-md-4">
            <label className="form-label fw-semibold">Front Seat Limit</label>
            <input type="number" name="frontSeatLimit" className="form-control" value={movie.frontSeatLimit} onChange={handleChange} />
          </div>
          <div className="mb-3 col-md-4">
            <label className="form-label fw-semibold">Middle Seat Limit</label>
            <input type="number" name="middleSeatLimit" className="form-control" value={movie.middleSeatLimit} onChange={handleChange} />
          </div>
          <div className="mb-3 col-md-4">
            <label className="form-label fw-semibold">Back Seat Limit</label>
            <input type="number" name="backSeatLimit" className="form-control" value={movie.backSeatLimit} onChange={handleChange} />
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Poster URL</label>
          <input type="text" name="posterUrl" className="form-control" value={movie.posterUrl} onChange={handleChange} />
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-success btn-lg">
            💾 Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditMovie;
