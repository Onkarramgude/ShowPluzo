// src/ForgotPassword.js
import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSendOtp = async () => {
    try {
      const res = await axios.post("http://localhost:8080/user/forgot-password", null, {
        params: { email },
      });
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
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="btn btn-primary mb-3" onClick={handleSendOtp}>
        Send OTP
      </button>
      <div>{message && <p className="text-info">{message}</p>}</div>
    </div>
  );
}

export default ForgotPassword;
