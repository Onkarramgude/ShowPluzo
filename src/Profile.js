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
      <div
        className="card shadow-lg p-4 mx-auto rounded-4 bg-light"
        style={{ maxWidth: "500px" }}
      >
        <div className="text-center mb-4">
          <FaUserCircle className="text-primary" size={72} />
          <h3 className="mt-2 fw-bold">User Profile</h3>
          <span className="badge bg-success">
            {user.role?.toUpperCase() || "USER"}
          </span>
        </div>

        <hr />

        <ul className="list-group list-group-flush mb-3">
          <li className="list-group-item bg-light d-flex align-items-center">
            <FaIdBadge className="me-2 text-secondary" />
            <span>
              <strong>User ID:</strong> {user.id || "N/A"}
            </span>
          </li>
          <li className="list-group-item bg-light d-flex align-items-center">
            <FaUserCircle className="me-2 text-secondary" />
            <span>
              <strong>Username:</strong> {user.username || "N/A"}
            </span>
          </li>
          <li className="list-group-item bg-light d-flex align-items-center">
            <FaEnvelope className="me-2 text-secondary" />
            <span>
              <strong>Email:</strong> {user.email || "N/A"}
            </span>
          </li>
        </ul>

        <div className="text-center mt-4 d-flex flex-column gap-2">
          <button
            className="btn btn-outline-danger rounded-pill px-4 py-2"
            onClick={logout}
          >
            <FaSignOutAlt className="me-2" />
            Logout
          </button>

          <button
            className="btn btn-danger rounded-pill px-4 py-2"
            onClick={handleDeleteAccount}
          >
            <FaTrash className="me-2" />
            Delete My Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
