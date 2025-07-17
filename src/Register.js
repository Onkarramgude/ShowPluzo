// src/Register.js
import React, { useState } from "react";
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

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post("http://localhost:8080/auth/register", formData);
      setMessage(res.data.message || "Registered successfully!");
      setFormData({ username: "", email: "", password: "", role: "USER" });
      navigate("/login");
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card p-4 shadow-lg rounded-4" style={{ width: "100%", maxWidth: "420px" }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-center mb-3">
            <span className="badge bg-gradient text-white fs-4 shadow-sm" style={{ background: "linear-gradient(45deg, #007bff, #6610f2, #6f42c1)", padding: "10px 20px", borderRadius: "30px" }}>
              🎟️ <span className="text-warning">Show</span>.<span className="text-info">Pluzo</span>.com
            </span>
          </h2>
          <p className="text-muted small">Create your account below</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input name="username" className="form-control" placeholder="Username" id="floatingUsername" value={formData.username} onChange={handleChange} required />
            <label htmlFor="floatingUsername">Username</label>
          </div>

          <div className="form-floating mb-3">
            <input name="email" type="email" className="form-control" placeholder="Email" id="floatingEmail" value={formData.email} onChange={handleChange} required />
            <label htmlFor="floatingEmail">Email address</label>
          </div>

          <div className="form-floating mb-3">
            <input name="password" type="password" className="form-control" placeholder="Password" id="floatingPassword" value={formData.password} onChange={handleChange} required />
            <label htmlFor="floatingPassword">Password</label>
          </div>

          <div className="form-floating mb-3">
            <select name="role" className="form-select" id="floatingRole" value={formData.role} onChange={handleChange}>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
            <label htmlFor="floatingRole">Select Role</label>
          </div>

          <button type="submit" className="btn btn-success w-100">
            ➕ Register
          </button>
        </form>

        {message && (
          <div className={`alert mt-3 text-center ${message.toLowerCase().includes("success") ? "alert-success" : "alert-danger"}`} role="alert">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;