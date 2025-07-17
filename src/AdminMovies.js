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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/movies/admin/all-tickets")
      .then((res) => {
        console.log("🎟️ Tickets from server:", res.data);
        setTickets(res.data);
      })
      .catch(() => setError("❌ Failed to load tickets."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container my-5">
      <div className="text-center mb-4">
        <h2 className="text-primary">
          🎫 All Booked Tickets <span className="text-muted">(Admin View)</span>
        </h2>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2">Loading tickets...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : tickets.length === 0 ? (
        <div className="alert alert-warning text-center">No tickets found.</div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {tickets.map((ticket) => {
            const isCancelled = ticket.status === "cancelled";
            const cardClass = `card border-0 h-100 shadow-sm rounded-4 p-3 ${
              isCancelled ? "bg-light text-muted border border-danger" : ""
            }`;

            return (
              <div className="col" key={ticket.id}>
                <div className={cardClass}>
                  <div className="card-body">
                    <h5 className="card-title fw-bold text-success mb-3">
                      <FaFilm className="me-2" />
                      {ticket.movieName || "Untitled Movie"}
                    </h5>

                    <p className="mb-2">
                      <FaUser className="me-2 text-secondary" />
                      <strong>User:</strong> {ticket.username}
                    </p>

                    <p className="mb-2">
                      <FaMapMarkerAlt className="me-2 text-secondary" />
                      <strong>Theater:</strong> {ticket.theaterLocation}
                    </p>

                    <p className="mb-2">
                      <FaClock className="me-2 text-secondary" />
                      <strong>Show Time:</strong>{" "}
                      {ticket.showTime ? new Date(ticket.showTime).toLocaleString() : "N/A"}
                    </p>

                    <p className="mb-2">
                      <FaChair className="me-2 text-secondary" />
                      <strong>Seats:</strong>{" "}
                      <span className="badge bg-primary me-2">
                        {ticket.seatCount} ({ticket.seatType})
                      </span>
                    </p>

                    <p className="mb-2">
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

                    <p className="mb-2">
                      <FaRupeeSign className="me-2 text-secondary" />
                      <strong>Total Price:</strong> ₹{ticket.totalPrice}
                    </p>

                    <div className="mt-2">
                      {isCancelled ? (
                        <span className="badge bg-danger">Cancelled</span>
                      ) : (
                        <span className="badge bg-success">Active</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminAllTickets;
