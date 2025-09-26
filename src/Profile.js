import React from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaUserCircle,
  FaEnvelope,
  FaIdBadge,
  FaSignOutAlt,
  FaTrash,
} from "react-icons/fa";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete your account?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `http://localhost:8080/auth/delete/${user.email}`,
        { withCredentials: true }
      );

      alert(response.data || "Your account has been deleted.");
      logout();
      navigate("/");
    } catch (error) {
      console.error("❌ Error deleting account", error);
      if (error.response && error.response.data) {
        alert(`Error: ${error.response.data}`);
      } else {
        alert("Something went wrong. Account not deleted.");
      }
    }
  };

  if (!user) {
    return (
      <div className="container text-center mt-5">
        <div className="alert alert-warning shadow-sm">
          🚫 Please log in to view your profile.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      {/* BookMyShow style header */}
      <div className="text-center mb-4">
        <h2 className="fw-bold text-danger">🎟️ My Profile</h2>
        <p className="text-muted">Manage your account & bookings</p>
      </div>

      <div
        className="card border-0 shadow-lg mx-auto rounded-4"
        style={{
          maxWidth: "650px",
          background:
            "linear-gradient(135deg, #ffffff, #f9f9f9, #f1f1f1)",
        }}
      >
        <div className="card-body p-5">
          {/* Profile Header */}
          <div className="text-center mb-4">
            <FaUserCircle className="text-danger" size={90} />
            <h3 className="mt-3 fw-bold text-dark">{user.username}</h3>
            <span className="badge bg-danger px-3 py-2 rounded-pill">
              {user.role?.toUpperCase() || "USER"}
            </span>
          </div>

          {/* Profile Info */}
          <div className="row g-3">
            <div className="col-md-12">
              <div className="p-3 rounded bg-light d-flex align-items-center">
                <FaIdBadge className="me-3 text-secondary" />
                <span>
                  <strong>User ID:</strong> {user.id || "N/A"}
                </span>
              </div>
            </div>
            <div className="col-md-12">
              <div className="p-3 rounded bg-light d-flex align-items-center">
                <FaUserCircle className="me-3 text-secondary" />
                <span>
                  <strong>Username:</strong> {user.username || "N/A"}
                </span>
              </div>
            </div>
            <div className="col-md-12">
              <div className="p-3 rounded bg-light d-flex align-items-center">
                <FaEnvelope className="me-3 text-secondary" />
                <span>
                  <strong>Email:</strong> {user.email || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center mt-5 d-flex flex-column gap-3">
            <button
              className="btn btn-outline-danger rounded-pill px-4 py-2 fw-semibold"
              onClick={logout}
            >
              <FaSignOutAlt className="me-2" />
              Logout
            </button>

            <button
              className="btn btn-danger rounded-pill px-4 py-2 fw-semibold"
              onClick={handleDeleteAccount}
            >
              <FaTrash className="me-2" />
              Delete My Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
