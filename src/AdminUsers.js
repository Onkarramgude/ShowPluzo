import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUserAlt, FaEnvelope, FaShieldAlt } from "react-icons/fa";

function AdminUsers() {
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/user/all")
      .then((res) => {
        const all = res.data;
        const adminsOnly = all.filter((u) => u.role === "ADMIN");
        const usersOnly = all.filter((u) => u.role !== "ADMIN");
        setAdmins(adminsOnly);
        setUsers(usersOnly);
      })
      .catch(() => setError("❌ Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-danger";
      case "MODERATOR":
        return "bg-warning text-dark";
      default:
        return "bg-primary";
    }
  };

  const renderUserCard = (user) => (
    <div className="col" key={user.id}>
      <div className="card shadow-sm h-100 border-0 rounded-4 p-3 bg-light">
        <div className="card-body">
          <h5 className="card-title fw-bold mb-2 text-dark">
            <FaUserAlt className="me-2 text-secondary" />
            {user.username}
          </h5>
          <p className="card-text mb-2">
            <FaEnvelope className="me-2 text-muted" />
            {user.email}
          </p>
          <p className="card-text">
            <FaShieldAlt className="me-2 text-muted" />
            <span className={`badge ${getRoleBadgeClass(user.role)}`}>
              {user.role}
            </span>
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container my-5">
      <div className="text-center mb-4">
        <h2 className="text-primary fw-bold">👥 Registered Users</h2>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3">Loading users...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : (
        <>
          {/* 🔴 Admin Section */}
          <h4 className="fw-bold text-danger mb-3">🔒 Admins</h4>
          {admins.length === 0 ? (
            <div className="alert alert-warning text-center">No admins found.</div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-5">
              {admins.map(renderUserCard)}
            </div>
          )}

          {/* 🔵 Users Section */}
          <h4 className="fw-bold text-primary mb-3">🧑‍💻 Regular Users</h4>
          {users.length === 0 ? (
            <div className="alert alert-warning text-center">No users found.</div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {users.map(renderUserCard)}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminUsers;
