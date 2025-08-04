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
      const res = await axios.post("http://localhost:8080/user/reset-password", {
  email,
  otp,
  newPassword,
});

      setMessage(res.data); // success string from backend
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Something went wrong");
    }
  };

  return (
    <div className="container mt-5 col-md-6">
      <h2 className="mb-3">🔄 Reset Password</h2>
      <input
        type="email"
        className="form-control mb-3"
        placeholder="Enter your registered email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <input
        type="password"
        className="form-control mb-3"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button className="btn btn-success mb-3" onClick={handleReset}>
        Reset Password
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
    </div>
  );
}

export default ResetPassword;
