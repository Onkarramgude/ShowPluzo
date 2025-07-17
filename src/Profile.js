import React from "react";
import { useAuth } from "./AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaUserCircle,
  FaEnvelope,
  FaIdBadge,
  FaSignOutAlt,
} from "react-icons/fa";

function Profile() {
  const { user, logout } = useAuth();

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
        className="card shadow-lg p-4 mx-auto rounded-4 bg-light animate__animated animate__fadeIn"
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

        <div className="text-center mt-4">
          <button
            className="btn btn-outline-danger rounded-pill px-4 py-2"
            onClick={logout}
          >
            <FaSignOutAlt className="me-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
