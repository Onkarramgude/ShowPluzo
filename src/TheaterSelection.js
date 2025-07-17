import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function TheaterSelection() {
  const [allTheaters, setAllTheaters] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [groupedShowtimes, setGroupedShowtimes] = useState({});

  const navigate = useNavigate();
  const location = useLocation();
  const selectedMovie = location.state?.movie;

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/movies/locations")
      .then((res) => {
        const data = res.data || [];
        setAllTheaters(data);
        const uniqueCities = [...new Set(data.map((theater) => theater.city))];
        setCities(uniqueCities);
      })
      .catch((err) => console.error("❌ Failed to load theater locations", err));
  }, []);

  useEffect(() => {
    if (selectedMovie?.id) {
      axios
        .get(`http://localhost:8080/api/movies/${selectedMovie.id}/showtimes/grouped`)
        .then((res) => setGroupedShowtimes(res.data || {}))
        .catch((err) => console.error("❌ Failed to load showtimes", err));
    }
  }, [selectedMovie]);

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const handleShowtimeClick = (theater, showtime) => {
    navigate("/book-ticket", {
      state: { movie: selectedMovie, theater, showtime },
    });
  };

  const formatTime24to12 = (timeStr) => {
    try {
      const [hour, minute] = timeStr.split(":").map(Number);
      const date = new Date();
      date.setHours(hour);
      date.setMinutes(minute);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return timeStr;
    }
  };

  if (!selectedMovie?.id) {
    return (
      <div className="container mt-4 alert alert-danger">
        ❌ Movie data is missing. Please go back and select a movie again.
      </div>
    );
  }

  // ✅ Filter only admin-assigned theaters for selected movie & city
  const filteredTheaters = allTheaters.filter(
    (t) => t.city === selectedCity && groupedShowtimes.hasOwnProperty(t.id)
  );

  return (
    <div className="container mt-4 mb-5">
      <h2 className="mb-4 text-primary fw-bold">🎭 Select Theater & Showtime</h2>

      <div className="mb-3">
        <label htmlFor="citySelect" className="form-label fw-semibold">
          📍 Choose a City
        </label>
        <select
          id="citySelect"
          className="form-select"
          value={selectedCity}
          onChange={handleCityChange}
        >
          <option value="">-- Select City --</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {filteredTheaters.length > 0 ? (
        <div className="mt-4">
          <h5 className="fw-semibold mb-3">🎬 Theaters in {selectedCity}:</h5>
          <ul className="list-group">
            {filteredTheaters.map((theater) => {
              const showtimes = groupedShowtimes[theater.id] || [];

              return (
                <li key={theater.id} className="list-group-item">
                  <div className="mb-2">
                    <strong>{theater.name}</strong>
                    <br />
                    <small className="text-muted">
                      📍 {theater.address}, {theater.city}
                    </small>
                    <br />
                    <small>🪑 Total Seats: {theater.totalSeats || "N/A"}</small>
                  </div>

                  <div className="mt-2">
                    {showtimes.length > 0 ? (
                      showtimes.map((time, index) => (
                        <button
                          key={`${theater.id}-${time}-${index}`}
                          className="btn btn-outline-primary btn-sm me-2 mb-2"
                          onClick={() => handleShowtimeClick(theater, time)}
                        >
                          {formatTime24to12(time)}
                        </button>
                      ))
                    ) : (
                      <span className="badge bg-secondary">No showtimes available</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : selectedCity ? (
        <div className="alert alert-info mt-4">
          No theaters assigned for this movie in {selectedCity}.
        </div>
      ) : null}
    </div>
  );
}

export default TheaterSelection;
