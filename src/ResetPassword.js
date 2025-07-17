// src/ResetPassword.js
import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    try {
      const res = await axios.put("http://localhost:8080/user/reset-password", {
        email,
        otp,
        newPassword,
      });
      setMessage(res.data);
    } catch (err) {
      setMessage(err.response?.data || "❌ Something went wrong");
    }
  };

  return (
    <div className="container mt-5 col-md-6">
      <h2 className="mb-3">🔄 Reset Password</h2>
      <input
        type="email"
        className="form-control mb-3"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        className="form-control mb-3"
        placeholder="OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <input
        type="password"
        className="form-control mb-3"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button className="btn btn-success mb-3" onClick={handleReset}>
        Reset Password
      </button>
      <div>{message && <p className="text-info">{message}</p>}</div>
    </div>
  );
}

export default ResetPassword;
