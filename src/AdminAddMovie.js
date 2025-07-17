// src/AdminAddMovie.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function AdminAddMovie() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const defaultForm = {
    title: "",
    description: "",
    director: "",
    genre: "",
    releaseDate: "",
    year: "",
    duration: "",
    posterUrl: "",
    frontSeatPrice: "",
    middleSeatPrice: "",
    backSeatPrice: "",
    price: "",
    frontSeatLimit: "",
    middleSeatLimit: "",
    backSeatLimit: "",
  };

  const [form, setForm] = useState(defaultForm);
  const [languages, setLanguages] = useState([]);
  const [newLanguage, setNewLanguage] = useState("");
  const [showTimes, setShowTimes] = useState([]);
  const [newShowTime, setNewShowTime] = useState("");
  const [allTheaters, setAllTheaters] = useState([]);
  const [selectedTheaters, setSelectedTheaters] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "ADMIN") navigate("/");

    axios
      .get("http://localhost:8080/api/movies/locations")
      .then((res) => setAllTheaters(res.data || []))
      .catch(() => setError("❌ Failed to load theaters"));
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddToList = (item, list, setter) => {
    if (item && !list.includes(item)) setter([...list, item]);
  };

  const handleRemoveFromList = (item, list, setter) => {
    setter(list.filter((i) => i !== item));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        year: Number(form.year),
        duration: Number(form.duration),
        frontSeatPrice: Number(form.frontSeatPrice),
        middleSeatPrice: Number(form.middleSeatPrice),
        backSeatPrice: Number(form.backSeatPrice),
        price: Number(form.price),
        frontSeatLimit: Number(form.frontSeatLimit),
        middleSeatLimit: Number(form.middleSeatLimit),
        backSeatLimit: Number(form.backSeatLimit),
        languages,
        showTimes,
        theaterIds: selectedTheaters.map((t) => t.id),
      };

      await axios.post("http://localhost:8080/api/movies/add", payload);

      // ✅ Soft refresh: Reset form and state
      setForm(defaultForm);
      setLanguages([]);
      setShowTimes([]);
      setSelectedTheaters([]);
      setNewLanguage("");
      setNewShowTime("");
      setMessage("✅ Movie added successfully!");
      setError("");
    } catch (err) {
      console.error(err);
      setError("❌ Failed to add movie.");
      setMessage("");
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow-lg border-0 p-4 bg-light rounded-4">
        <h2 className="text-center text-danger fw-bold mb-4">🎬 Add New Movie</h2>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Movie Details */}
          <h5 className="mb-3 text-primary">🎞️ Movie Details</h5>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Title *</label>
              <input className="form-control" name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Director</label>
              <input className="form-control" name="director" value={form.director} onChange={handleChange} />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea className="form-control" name="description" rows="3" value={form.description} onChange={handleChange} />
          </div>

          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label">Genre</label>
              <input className="form-control" name="genre" value={form.genre} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Release Date</label>
              <input type="date" className="form-control" name="releaseDate" value={form.releaseDate} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Year</label>
              <input type="number" className="form-control" name="year" value={form.year} onChange={handleChange} />
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-6">
              <label className="form-label">Duration (minutes)</label>
              <input type="number" className="form-control" name="duration" value={form.duration} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Poster URL</label>
              <input className="form-control" name="posterUrl" value={form.posterUrl} onChange={handleChange} />
            </div>
          </div>

          {/* Languages */}
          <h5 className="mb-2 text-primary">🌐 Languages</h5>
          <div className="input-group mb-2">
            <input className="form-control" placeholder="Add language" value={newLanguage} onChange={(e) => setNewLanguage(e.target.value)} />
            <button type="button" className="btn btn-outline-primary" onClick={() => {
              handleAddToList(newLanguage, languages, setLanguages);
              setNewLanguage("");
            }}>Add</button>
          </div>
          <div className="mb-3">
            {languages.map((lang) => (
              <span key={lang} className="badge bg-info text-dark me-2 mb-1">
                {lang} <span role="button" onClick={() => handleRemoveFromList(lang, languages, setLanguages)}>❌</span>
              </span>
            ))}
          </div>

          {/* Show Timings */}
          <h5 className="mb-2 text-primary">⏰ Show Timings</h5>
          <div className="input-group mb-2">
            <input type="time" className="form-control" value={newShowTime} onChange={(e) => setNewShowTime(e.target.value)} />
            <button type="button" className="btn btn-outline-primary" onClick={() => {
              handleAddToList(newShowTime, showTimes, setShowTimes);
              setNewShowTime("");
            }}>Add</button>
          </div>
          <div className="mb-3">
            {showTimes.map((t) => (
              <span key={t} className="badge bg-secondary me-2 mb-1">
                {t} <span role="button" onClick={() => handleRemoveFromList(t, showTimes, setShowTimes)}>❌</span>
              </span>
            ))}
          </div>

          {/* Theater selection */}
          <h5 className="mb-2 text-primary">🏢 Theaters</h5>
          <select className="form-select mb-2" onChange={(e) => {
            const selected = allTheaters.find(t => t.id.toString() === e.target.value);
            if (selected && !selectedTheaters.some(t => t.id === selected.id)) {
              setSelectedTheaters([...selectedTheaters, selected]);
            }
          }}>
            <option value="">-- Select Theater --</option>
            {allTheaters.map((t) => (
              <option key={t.id} value={t.id}>{t.name} ({t.city})</option>
            ))}
          </select>
          <div className="mb-3">
            {selectedTheaters.map((t) => (
              <span key={t.id} className="badge bg-success me-2 mb-1">
                {t.name} <span role="button" onClick={() => handleRemoveFromList(t, selectedTheaters, setSelectedTheaters)}>❌</span>
              </span>
            ))}
          </div>

          {/* Pricing & Limits */}
          <h5 className="mb-2 text-primary">💰 Pricing & Seats</h5>
          <div className="row mb-3">
            {["frontSeatPrice", "middleSeatPrice", "backSeatPrice", "price"].map((field) => (
              <div className="col-md-3" key={field}>
                <label className="form-label">{field.replace(/([A-Z])/g, " $1")}</label>
                <input type="number" className="form-control" name={field} value={form[field]} onChange={handleChange} />
              </div>
            ))}
          </div>
          <div className="row mb-4">
            {["frontSeatLimit", "middleSeatLimit", "backSeatLimit"].map((field) => (
              <div className="col-md-4" key={field}>
                <label className="form-label">{field.replace(/([A-Z])/g, " ")}</label>
                <input type="number" className="form-control" name={field} value={form[field]} onChange={handleChange} />
              </div>
            ))}
          </div>

          <button type="submit" className="btn btn-danger w-100 fw-bold py-2 fs-5">
            ➕ Add Movie
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminAddMovie;
