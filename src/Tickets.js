// 🎟 BookMyShow-style Tickets Page (Bootstrap only)
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaTicketAlt,
  FaTheaterMasks,
  FaClock,
  FaChair,
  FaRupeeSign,
  FaTrash,
} from "react-icons/fa";

function Tickets() {
  const { user } = useAuth();
  const location = useLocation();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const justBookedPaymentId = location.state?.justBookedPaymentId;
  const [justBookedVisible, setJustBookedVisible] = useState(!!justBookedPaymentId);

  useEffect(() => {
    if (justBookedVisible) {
      const timer = setTimeout(() => {
        setJustBookedVisible(false);
      }, 5 * 60 * 1000);
      return () => clearTimeout(timer);
    }
  }, [justBookedVisible]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchTickets = useCallback(() => {
    if (!user?.username) return;

    setLoading(true);
    axios
      .get(`http://localhost:8080/user/tickets/${user.username}?t=${Date.now()}`)
      .then((res) => {
        setTickets(res.data || []);
        setError("");
      })
      .catch(() => setError("❌ Failed to load tickets."))
      .finally(() => setLoading(false));
  }, [user?.username]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const cancelTicket = async (ticketId) => {
    const confirmCancel = window.confirm(
      "⚠️ Are you sure you want to cancel this ticket?\n💸 Refund will be processed within 3–5 business days."
    );
    if (!confirmCancel) return;

    try {
      const response = await axios.delete(
        `http://localhost:8080/user/cancel-ticket/${ticketId}`,
        { params: { username: user.username } }
      );

      if (response.data?.includes("✅")) {
        setMessage("✅ Ticket cancelled successfully.");
        setTickets((prev) =>
          prev.map((t) =>
            t.id === ticketId ? { ...t, status: "cancelled" } : t
          )
        );
        setTimeout(() => fetchTickets(), 300);
      } else {
        setError("⚠️ Ticket cancellation response was not successful.");
      }
    } catch (err) {
      console.error("❌ Cancel Error:", err);
      setError("❌ Failed to cancel the ticket. Please try again.");
    }
  };

  const renderSeatNumbers = (seats = []) => {
    return seats
      .map((seatId) => {
        const [row, col] = seatId.split("-").map(Number);
        const rowLetter = String.fromCharCode(65 + row);
        return `${rowLetter}${col + 1}`;
      })
      .join(", ");
  };

  const now = new Date();
  const activeTickets = tickets.filter(
    (t) => t.status !== "cancelled" && new Date(t.showTime) > now
  );
  const historyTickets = tickets.filter(
    (t) => t.status !== "cancelled" && new Date(t.showTime) <= now
  );
  const cancelledTickets = tickets.filter((t) => t.status === "cancelled");

  // 🎟 Styled Ticket Card
  const renderTicketCard = (ticket) => {
    const isCancelled = ticket.status === "cancelled";
    const isJustBooked =
      ticket.paymentId === justBookedPaymentId && justBookedVisible;

    return (
      <div className="col" key={ticket.id}>
        <div
          className={`card h-100 border-0 shadow-lg rounded-4 overflow-hidden ${
            isCancelled
              ? "bg-light text-muted border border-danger"
              : isJustBooked
              ? "border border-success border-3"
              : ""
          }`}
        >
          <div className="card-header bg-danger text-white fw-bold d-flex justify-content-between">
            <span>🎬 {ticket.movieName || "Untitled Movie"}</span>
            <span className="badge bg-light text-dark">
              {ticket.seatType || "Seat"}
            </span>
          </div>
          <div className="card-body">
            <p className="mb-2">
              <FaTheaterMasks className="me-2 text-secondary" />
              <strong>Theater:</strong> {ticket.theaterLocation || "N/A"}
            </p>

            <p className="mb-2">
              <FaClock className="me-2 text-secondary" />
              <strong>Show Time:</strong>{" "}
              {ticket.showTime
                ? new Date(ticket.showTime).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "N/A"}
            </p>

            <p className="mb-2">
              <FaChair className="me-2 text-secondary" />
              <strong>Seats:</strong>{" "}
              <span
                className={`badge ${
                  isCancelled ? "bg-secondary" : "bg-primary"
                }`}
              >
                {ticket.seatCount || 0}
              </span>
            </p>

            <p className="mb-2">
              <strong>Seat Numbers:</strong>{" "}
              {ticket.selectedSeats?.length ? (
                <span
                  className={`badge ${
                    isCancelled ? "bg-secondary" : "bg-success"
                  }`}
                >
                  {renderSeatNumbers(ticket.selectedSeats)}
                </span>
              ) : (
                <span className="badge bg-secondary">N/A</span>
              )}
            </p>

            <p className="mb-2">
              <FaRupeeSign className="me-2 text-secondary" />
              <strong>Total Price:</strong>{" "}
              ₹
              <span
                className={isCancelled ? "text-decoration-line-through" : ""}
              >
                {ticket.totalPrice || 0}
              </span>
            </p>

            <p className="small text-muted">
              <strong>Payment ID:</strong> {ticket.paymentId || "N/A"}
            </p>

            {isJustBooked && !isCancelled && (
              <div className="alert alert-success py-1 mb-2 small">
                ✅ Just Booked!
              </div>
            )}

            {isCancelled ? (
              <span className="badge bg-danger mt-2">❌ Cancelled</span>
            ) : (
              <>
                <button
                  className="btn btn-outline-danger btn-sm mt-3 rounded-pill"
                  onClick={() => cancelTicket(ticket.id)}
                >
                  <FaTrash className="me-1" /> Cancel Ticket
                </button>
                <p className="text-muted mt-2 small mb-0">
                  💸 Refund within 3–5 business days.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="text-danger fw-bold mb-4 d-flex align-items-center">
        <FaTicketAlt className="me-2" />
        My Tickets
      </h2>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="alert alert-info">⏳ Loading your tickets...</div>
      ) : tickets.length === 0 ? (
        <div className="alert alert-warning">
          📭 You haven't booked any tickets yet.
        </div>
      ) : (
        <>
          {activeTickets.length > 0 && (
            <>
              <h4 className="text-success mt-4 mb-3">🎟 Active Tickets</h4>
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {activeTickets.map(renderTicketCard)}
              </div>
            </>
          )}

          {historyTickets.length > 0 && (
            <>
              <h4 className="text-secondary mt-5 mb-3">📜 Ticket History</h4>
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {historyTickets.map(renderTicketCard)}
              </div>
            </>
          )}

          {cancelledTickets.length > 0 && (
            <>
              <h4 className="text-danger mt-5 mb-3">❌ Cancelled Tickets</h4>
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {cancelledTickets.map(renderTicketCard)}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Tickets;
