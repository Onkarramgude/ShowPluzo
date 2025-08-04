// src/Login.js
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/auth/login", formData, {
        withCredentials: true,
      });
     const user = res.data?.user;

if (user && user.role) {
  login(user);
  if (user.role === "ADMIN") {
    navigate("/admin/dashboard");
  } else {
    navigate("/userdashboard");
  }
} else {
  setMessage("❌ Invalid response from server.");
}

    } catch (err) {
      console.error("Login error:", err);
      setMessage(err.response?.data?.message || "❌ Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow-lg rounded-4" style={{ maxWidth: "420px", width: "100%" }}>
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
          <p className="text-muted small">Please enter your credentials</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              name="email"
              type="email"
              className="form-control"
              id="floatingEmail"
              placeholder="Email"
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
              id="floatingPassword"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>

          <div className="text-end mb-3">
            <Link to="/forgot-password" className="text-decoration-none small text-primary">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
            disabled={loading}
          >
            {loading && (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            )}
            {loading ? "Logging in..." : "➡️ Login"}
          </button>
        </form>

        {message && (
          <div className="alert alert-danger mt-3 mb-0 text-center" role="alert">
            {message}
          </div>
        )}

        <div className="text-center mt-3">
          <p className="mb-0">
            Don’t have an account?{" "}
            <Link to="/register" className="text-decoration-none text-success fw-semibold">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
