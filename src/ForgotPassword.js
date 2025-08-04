import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSendOtp = async () => {
  try {
    const res = await axios.post(
      `http://localhost:8080/auth/forgot-password`,
      null, // no request body
      {
        params: { email }, // attach email as query param
        withCredentials: true, // optional: needed if you use cookies
      }
    );
    setMessage(res.data);
  } catch (err) {
    setMessage(err.response?.data || "❌ Something went wrong");
  }
};


  return (
    <div className="container mt-5 col-md-6">
      <h2 className="mb-3">🔐 Forgot Password</h2>
      <input
        type="email"
        className="form-control mb-3"
        placeholder="Enter your registered email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="btn btn-primary mb-3" onClick={handleSendOtp}>
        Send OTP
      </button>

      {message && (
        <div
          className={`alert ${
            message.startsWith("❌") ? "alert-danger" : "alert-success"
          }`}
          role="alert"
        >
          {message}
        </div>
      )}

      <p>
        🔁 Already have OTP? <a href="/reset-password">Reset here</a>
      </p>
    </div>
  );
}

export default ForgotPassword;
