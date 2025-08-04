import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "USER",
  });

  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const otpInputRef = useRef(null);

  const allowedDomains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "icloud.com",
    "rediffmail.com",
    "protonmail.com",
    "zoho.com",
  ];

  const isValidEmailDomain = (email) => {
    const domain = email.split("@")[1];
    return allowedDomains.includes(domain);
  };

  useEffect(() => {
    if (showOtpField && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [showOtpField]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!isValidEmailDomain(formData.email)) {
      setMessage("❌ Please enter a valid email from a known provider (e.g., Gmail, Yahoo).");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/auth/register", formData);
      setMessage(response.data.message || "✅ Registered! OTP sent to your email.");
      setShowOtpField(true);
    } catch (error) {
      setMessage(error.response?.data?.message || "❌ Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) return;

    setLoading(true);
    try {
      await axios.post(`http://localhost:8080/auth/verify-email?email=${formData.email}&otp=${otp}`);
      setMessage("✅ Email verified! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      setMessage(error.response?.data || "❌ Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card p-4 shadow-lg rounded-4" style={{ width: "100%", maxWidth: "420px" }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-center mb-3">
            <span
              className="badge bg-gradient text-white fs-4 shadow-sm"
              style={{
                background: "linear-gradient(45deg, #007bff, #6610f2, #6f42c1)",
                padding: "10px 20px",
                borderRadius: "30px",
              }}
            >
              🎟️ <span className="text-warning">Show</span>.<span className="text-info">Pluzo</span>.com
            </span>
          </h2>
          <p className="text-muted small">
            {showOtpField ? "Enter the OTP sent to your email" : "Create your account below"}
          </p>
        </div>

        {!showOtpField ? (
          <form onSubmit={handleRegister}>
            <div className="form-floating mb-3">
              <input
                name="username"
                className="form-control"
                placeholder="Username"
                id="floatingUsername"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <label htmlFor="floatingUsername">Username</label>
            </div>

            <div className="form-floating mb-3">
              <input
                name="email"
                type="email"
                className="form-control"
                placeholder="Email"
                id="floatingEmail"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <label htmlFor="floatingEmail">Email address</label>
            </div>

            <div className="form-floating mb-3">
              <input
                name="password"
                type="password"
                className="form-control"
                placeholder="Password"
                id="floatingPassword"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <label htmlFor="floatingPassword">Password</label>
            </div>

            <button type="submit" className="btn btn-success w-100" disabled={loading}>
              {loading ? "Registering..." : "➕ Register"}
            </button>
          </form>
        ) : (
          <>
            <input
              ref={otpInputRef}
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="form-control mb-3"
              required
            />
            <button className="btn btn-primary w-100" onClick={handleVerifyOtp} disabled={loading || otp.trim() === ""}>
              {loading ? "Verifying..." : "✅ Verify Email"}
            </button>
          </>
        )}

        {message && (
          <div
            className={`alert mt-3 text-center ${
              message.includes("✅") ? "alert-success" : "alert-danger"
            }`}
            role="alert"
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;
