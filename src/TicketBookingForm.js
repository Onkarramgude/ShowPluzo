// src/TicketBookingForm.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import SeatSelector from "./SeatSelector";

function TicketBookingForm() {
  const { user } = useAuth();
  const location = useLocation();
  const movie = location.state?.movie;
  const selectedTheater = location.state?.theater;
  const selectedShowtime = location.state?.showtime;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    movieName: "",
    theaterLocation: "",
    showTime: "",
    showDate: "",
    seatType: "front",
    ticketPrice: 0,
    username: user?.username || "",
  });

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [message, setMessage] = useState("");
  const [seatsLocked, setSeatsLocked] = useState(false);
  const [loading, setLoading] = useState(false);

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const getMaxDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 4);
    return today.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (movie && selectedTheater && selectedShowtime) {
      setFormData((prev) => ({
        ...prev,
        movieName: movie.title,
        theaterLocation: selectedTheater.name,
        showTime: selectedShowtime,
        ticketPrice: movie.price || 0,
        username: user?.username || "",
      }));
    }
  }, [movie, selectedTheater, selectedShowtime, user]);

  useEffect(() => {
    const fetchBookedSeats = async () => {
      if (
        formData.movieName &&
        formData.theaterLocation &&
        formData.showTime &&
        formData.showDate
      ) {
        try {
          const res = await axios.get("http://localhost:8080/user/booked-seats", {
            params: {
              movieName: formData.movieName,
              theaterLocation: formData.theaterLocation,
              showTime: `${formData.showDate}T${formData.showTime}`,
            },
          });
          setBookedSeats(res.data);
        } catch (err) {
          console.error("❌ Error fetching booked seats", err);
        }
      }
    };

    fetchBookedSeats();
  }, [
    formData.movieName,
    formData.theaterLocation,
    formData.showTime,
    formData.showDate,
  ]);

  const getSeatExtra = (type) => {
    switch (type) {
      case "middle":
        return 30;
      case "back":
        return 50;
      default:
        return 0;
    }
  };

  const basePrice = formData.ticketPrice;
  const seatExtra = getSeatExtra(formData.seatType);
  const totalPrice = selectedSeats.length * (basePrice + seatExtra);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.showDate) {
      setMessage("❌ Please select a date.");
      return;
    }

    if (selectedSeats.length === 0) {
      setMessage("❌ Please select at least one seat.");
      return;
    }

    setSeatsLocked(true);
    setLoading(true);

    const razorpayLoaded = await loadRazorpayScript();
    if (!razorpayLoaded) {
      setMessage("❌ Razorpay SDK failed to load.");
      setLoading(false);
      return;
    }

    try {
      const options = {
        key: "rzp_test_RM7QiQWWO1vZPx",
        amount: totalPrice * 100,
        currency: "INR",
        name: "Pluzo Movie Booking",
        description: "Movie Ticket Payment",
        handler: async function (response) {
          try {
            // TicketBookingForm.js → inside Razorpay success handler:
await axios.post("http://localhost:8080/user/book", {
  ...formData,
  showTime: `${formData.showDate}T${formData.showTime}`,
  selectedSeats,
  totalPrice,
  seatCount: selectedSeats.length,
  paymentId: response.razorpay_payment_id, // ✅ this line must be here
});


            setMessage("🎉 Payment successful! Ticket booked.");
            navigate("/tickets", {
  state: { justBookedPaymentId: response.razorpay_payment_id }
});

          } catch (err) {
            console.error("❌ Booking failed:", err);
            setMessage("❌ Payment succeeded, but booking failed.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user?.username || "Customer",
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#0d6efd",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function () {
        setLoading(false);
      });
    } catch (err) {
      console.error("❌ Razorpay error:", err);
      setMessage("❌ Payment initiation failed.");
      setLoading(false);
    }
  };

  if (!movie || !selectedTheater || !selectedShowtime) {
    return (
      <div className="container mt-5 alert alert-danger">
        ❌ Incomplete booking data. Please select movie, theater, and showtime again.
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">🎟️ Book Movie Ticket</h2>
      {message && <div className="alert alert-info">{message}</div>}
      {loading && (
        <div className="text-center mb-3">
          <div className="spinner-border text-primary" role="status" />
          <p>Processing payment...</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 border rounded shadow">
        <div className="mb-3">
          <label className="form-label">Movie Name</label>
          <input className="form-control" readOnly value={formData.movieName} />
        </div>

        <div className="mb-3">
          <label className="form-label">Theater Location</label>
          <input className="form-control" readOnly value={formData.theaterLocation} />
        </div>

        <div className="mb-3">
          <label className="form-label">Select Date</label>
          <input
            type="date"
            name="showDate"
            className="form-control"
            value={formData.showDate}
            onChange={handleChange}
            min={getMinDate()}
            max={getMaxDate()}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Show Time</label>
          <input type="text" className="form-control" readOnly value={formData.showTime} />
        </div>

        <div className="mb-3">
          <label className="form-label">Seat Type</label>
          <select
            name="seatType"
            className="form-select"
            value={formData.seatType}
            onChange={handleChange}
            disabled={seatsLocked}
          >
            <option value="front">Front</option>
            <option value="middle">Middle (+₹30)</option>
            <option value="back">Back (+₹50)</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Select Seats (Max 100)</label>
          <SeatSelector
            onSelectionChange={(seats) => {
              if (!seatsLocked) {
                setSelectedSeats(seats);
              }
            }}
            seatType={formData.seatType}
            bookedSeats={bookedSeats}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Base Price per Seat</label>
          <input className="form-control" readOnly value={`₹${formData.ticketPrice}`} />
        </div>

        <div className="alert alert-warning">
          <strong>Total Price:</strong> ₹{totalPrice}
        </div>

        <div className="mb-3">
          <strong>Selected Seats:</strong>{" "}
          {selectedSeats.length > 0 ? selectedSeats.length : "None"}
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Processing..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
}

export default TicketBookingForm;