import React, { useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Overlay, Popover } from "react-bootstrap";
import SearchBar from "./Search";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

function Navbar({ onSearch }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [showPopover, setShowPopover] = useState(false);
  const target = useRef(null);

  const toggleNavbar = () => setIsNavCollapsed((prev) => !prev);

  const handleLogout = () => {
    logout();
    setShowPopover(false);
    navigate("/");
  };

  const handleNavigate = (path) => {
    setShowPopover(false);
    navigate(path);
  };

  const getInitials = (name) => {
    if (!name) return "👤";
    const parts = name.trim().split(" ");
    return parts.length > 1
      ? parts[0][0].toUpperCase() + parts[1][0].toUpperCase()
      : parts[0][0].toUpperCase();
  };

  const hideSearch = location.pathname === "/book-ticket";

  return (
    <>
      {/* Top Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
        <div className="container-fluid px-4">
          {/* Brand / Logo */}
          <Link
            className="navbar-brand d-flex align-items-center gap-2"
            to="/"
          >
            <img
              src="/ShowPluzo.png"
              alt="Show.Pluzo Logo"
              style={{ height: "40px", width: "auto" }}
            />
            <span className="fw-bold fs-4 text-danger">
              Show<span className="text-warning">.Pluzo</span>
            </span>
          </Link>

          {/* Toggler */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleNavbar}
            aria-controls="navbarNav"
            aria-expanded={!isNavCollapsed}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          {/* Collapse */}
          <div
            className={`collapse navbar-collapse ${
              !isNavCollapsed ? "show" : ""
            }`}
            id="navbarNav"
          >
            {/* Search in center (BookMyShow style) */}
            {!hideSearch && (
              <div className="mx-auto my-2 my-lg-0" style={{ width: "40%" }}>
                <SearchBar onSearch={onSearch} />
              </div>
            )}

            {/* Right side */}
            <ul className="navbar-nav ms-auto align-items-center mb-0">
              {!user ? (
                <>
                  <li className="nav-item me-2">
                    <Link className="btn btn-outline-light" to="/login">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="btn btn-danger" to="/register">
                      Register
                    </Link>
                  </li>
                </>
              ) : (
                <li
                  className="nav-item position-relative"
                  onMouseEnter={() => setShowPopover(true)}
                  onMouseLeave={() => setShowPopover(false)}
                >
                  <button
                    ref={target}
                    className="btn btn-light rounded-circle d-flex align-items-center justify-content-center fw-bold text-dark"
                    style={{ width: "42px", height: "42px" }}
                  >
                    {getInitials(user.username)}
                  </button>

                  <Overlay
                    target={target.current}
                    show={showPopover}
                    placement="bottom"
                  >
                    <Popover className="bg-dark text-light border-0 shadow-lg rounded-3">
                      <Popover.Body className="p-0">
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item bg-dark text-light">
                            <button
                              className="btn w-100 text-start text-light"
                              onClick={() => handleNavigate("/profile")}
                            >
                              📄 Profile
                            </button>
                          </li>
                          <li className="list-group-item bg-dark text-light">
                            <button
                              className="btn w-100 text-start text-light"
                              onClick={() => handleNavigate("/tickets")}
                            >
                              🎟️ View Tickets
                            </button>
                          </li>

                          {user.role === "ADMIN" && (
                            <>
                              <li className="list-group-item bg-dark text-light">
                                <button
                                  className="btn w-100 text-start text-light"
                                  onClick={() => handleNavigate("/admin")}
                                >
                                  🛠 Dashboard
                                </button>
                              </li>
                              <li className="list-group-item bg-dark text-light">
                                <button
                                  className="btn w-100 text-start text-light"
                                  onClick={() =>
                                    handleNavigate("/admin/contact-messages")
                                  }
                                >
                                  📥 Contact Messages
                                </button>
                              </li>
                              <li className="list-group-item bg-dark text-light">
                                <button
                                  className="btn w-100 text-start text-light"
                                  onClick={() =>
                                    handleNavigate("/admin/add-movie")
                                  }
                                >
                                  ➕ Add Movie
                                </button>
                              </li>
                              <li className="list-group-item bg-dark text-light">
                                <button
                                  className="btn w-100 text-start text-light"
                                  onClick={() =>
                                    handleNavigate("/admin/add-theater")
                                  }
                                >
                                  🏢 Add Theater
                                </button>
                              </li>
                              <li className="list-group-item bg-dark text-light">
                                <button
                                  className="btn w-100 text-start text-light"
                                  onClick={() => handleNavigate("/admin/tickets")}
                                >
                                  📋 All Tickets
                                </button>
                              </li>
                              <li className="list-group-item bg-dark text-light">
                                <button
                                  className="btn w-100 text-start text-light"
                                  onClick={() => handleNavigate("/admin/users")}
                                >
                                  👥 Users
                                </button>
                              </li>
                            </>
                          )}

                          <li className="list-group-item bg-dark text-light">
                            <button
                              className="btn w-100 text-start text-danger fw-semibold"
                              onClick={handleLogout}
                            >
                              🚪 Logout
                            </button>
                          </li>
                        </ul>
                      </Popover.Body>
                    </Popover>
                  </Overlay>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Secondary Navbar (like BookMyShow categories) */}
      <div className="bg-light border-bottom">
        <div className="container d-flex flex-wrap justify-content-center py-2">
          <Link className="nav-link px-3 fw-semibold text-dark" to="/movies">
            Movies
          </Link>
          <Link className="nav-link px-3 fw-semibold text-dark" to="/events">
            Events
          </Link>
          <Link className="nav-link px-3 fw-semibold text-dark" to="/plays">
            Plays
          </Link>
          <Link className="nav-link px-3 fw-semibold text-dark" to="/sports">
            Sports
          </Link>
          <Link className="nav-link px-3 fw-semibold text-dark" to="/activities">
            Activities
          </Link>
        </div>
      </div>
    </>
  );
}

export default Navbar;
