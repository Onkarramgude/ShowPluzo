import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaUser,
  FaChair,
  FaClock,
  FaRupeeSign,
  FaMapMarkerAlt,
  FaFilm,
} from "react-icons/fa";

function AdminAllTickets() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [movieFilter, setMovieFilter] = useState("");
  const [theaterFilter, setTheaterFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    axios.get("http://localhost:8080/api/movies/admin/all-tickets").then((res) => {
      setTickets(res.data);
      setFilteredTickets(res.data);
    });
  }, []);

  useEffect(() => {
    let filtered = [...tickets];

    if (movieFilter) {
      filtered = filtered.filter((t) =>
        t.movieName?.toLowerCase().includes(movieFilter.toLowerCase())
      );
    }

    if (theaterFilter) {
      filtered = filtered.filter((t) =>
        t.theaterLocation?.toLowerCase().includes(theaterFilter.toLowerCase())
      );
    }

    if (statusFilter === "active") {
      filtered = filtered.filter((t) => t.showStatus === "active");
    } else if (statusFilter === "cancelled") {
      filtered = filtered.filter((t) => t.showStatus === "cancelled");
    } else if (statusFilter === "completed") {
      filtered = filtered.filter((t) => t.showStatus === "completed");
    }

    setCurrentPage(1);
    setFilteredTickets(filtered);
  }, [movieFilter, theaterFilter, statusFilter, tickets]);

  const resetFilters = () => {
    setMovieFilter("");
    setTheaterFilter("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const uniqueMovies = [...new Set(tickets.map((t) => t.movieName))];
  const uniqueTheaters = [...new Set(tickets.map((t) => t.theaterLocation))];

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

  const activeTickets = currentTickets.filter((t) => t.showStatus === "active");
  const historyTickets = currentTickets.filter((t) => t.showStatus === "completed");
  const cancelledTickets = currentTickets.filter((t) => t.showStatus === "cancelled");

  const renderCard = (ticket) => (
    <div className="col" key={ticket.id}>
      <div
        className={`card h-100 shadow-sm rounded-4 p-3 border-0 ${
          ticket.showStatus === "cancelled"
            ? "bg-light border border-danger text-muted"
            : "bg-white"
        }`}
      >
        <div className="card-body">
          <h5 className="card-title fw-bold text-success mb-3">
            <FaFilm className="me-2" />
            {ticket.movieName || "Untitled Movie"}
          </h5>

          <p>
            <FaUser className="me-2 text-secondary" /> <strong>User:</strong> {ticket.username}
          </p>
          <p>
            <FaMapMarkerAlt className="me-2 text-secondary" /> <strong>Theater:</strong>{" "}
            {ticket.theaterLocation}
          </p>
          <p>
            <FaClock className="me-2 text-secondary" /> <strong>Show Time:</strong>{" "}
            {ticket.showTime ? new Date(ticket.showTime).toLocaleString() : "N/A"}
          </p>
          <p>
            <FaChair className="me-2 text-secondary" /> <strong>Seats:</strong>{" "}
            <span className="badge bg-primary">
              {ticket.seatCount} ({ticket.seatType})
            </span>
          </p>
          <p>
            <strong>Seat Numbers:</strong>{" "}
            {Array.isArray(ticket.selectedSeats) && ticket.selectedSeats.length > 0 ? (
              <span className="badge bg-success">
                {ticket.selectedSeats
                  .map((seatId) => {
                    const [row, col] = seatId.split("-").map(Number);
                    const rowLetter = String.fromCharCode(65 + row);
                    return `${rowLetter}${col + 1}`;
                  })
                  .join(", ")}
              </span>
            ) : (
              <span className="badge bg-secondary">N/A</span>
            )}
          </p>
          <p>
            <FaRupeeSign className="me-2 text-secondary" /> <strong>Total Price:</strong> ₹
            {ticket.totalPrice}
          </p>
          <p>
            <strong>Payment ID:</strong> {ticket.paymentId || "N/A"}{" "}
            {ticket.paymentId ? (
              <span className="badge bg-success ms-2">✅ Paid</span>
            ) : (
              <span className="badge bg-warning text-dark ms-2">❌ Unpaid</span>
            )}
          </p>

          <div className="mt-2">
            {ticket.showStatus === "cancelled" ? (
              <span className="badge bg-danger">❌ Cancelled</span>
            ) : ticket.showStatus === "completed" ? (
              <span className="badge bg-secondary">📜 Completed</span>
            ) : (
              <span className="badge bg-success">✅ Active</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h2 className="text-primary fw-bold">
          🎫 All Booked Tickets <small className="text-muted fs-6">(Admin View)</small>
        </h2>
      </div>

      {/* Filters */}
      <div className="card p-3 shadow mb-4 bg-gradient rounded-4">
        <div className="row g-3 align-items-end">
          <div className="col-md-4">
            <label className="form-label">🎬 Filter by Movie</label>
            <select
              className="form-select"
              value={movieFilter}
              onChange={(e) => setMovieFilter(e.target.value)}
            >
              <option value="">All Movies</option>
              {uniqueMovies.map((movie, idx) => (
                <option key={idx} value={movie}>
                  {movie}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">🏢 Filter by Theater</label>
            <select
              className="form-select"
              value={theaterFilter}
              onChange={(e) => setTheaterFilter(e.target.value)}
            >
              <option value="">All Theaters</option>
              {uniqueTheaters.map((theater, idx) => (
                <option key={idx} value={theater}>
                  {theater}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">🗂 Filter by Status</label>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="active">✅ Active</option>
              <option value="completed">📜 Completed</option>
              <option value="cancelled">❌ Cancelled</option>
            </select>
          </div>

          <div className="col-md-1 d-grid">
            <button className="btn btn-outline-secondary mt-1" onClick={resetFilters}>
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Active Tickets */}
      {activeTickets.length > 0 && (
        <>
          <h4 className="text-success mb-3">✅ Active Tickets</h4>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-4">
            {activeTickets.map(renderCard)}
          </div>
        </>
      )}

      {/* Completed Tickets */}
      {historyTickets.length > 0 && (
        <>
          <h4 className="text-info mb-3">📜 Completed Tickets</h4>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-4">
            {historyTickets.map(renderCard)}
          </div>
        </>
      )}

      {/* Cancelled Tickets */}
      {cancelledTickets.length > 0 && (
        <>
          <h4 className="text-danger mb-3">❌ Cancelled Tickets</h4>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-4">
            {cancelledTickets.map(renderCard)}
          </div>
        </>
      )}

      {/* Pagination */}
      <div className="d-flex justify-content-center align-items-center gap-3">
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ◀ Prev
        </button>
        <span>
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </span>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}

export default AdminAllTickets;
