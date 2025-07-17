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
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow sticky-top">
      <div className="container-fluid px-4">
        <Link className="navbar-brand fw-bold fs-3 text-danger" to="/">
          🎬 Show<span className="text-warning">.Pluzo</span>
        </Link>

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

        <div
          className={`collapse navbar-collapse ${
            !isNavCollapsed ? "show" : ""
          }`}
          id="navbarNav"
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/">
                🏠 Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/movies">
                🎞️ Movies
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            {!hideSearch && (
              <div className="position-relative d-none d-md-block">
                <div className="input-group input-group-sm">
                  <SearchBar onSearch={onSearch} />
                </div>
              </div>
            )}

            <ul className="navbar-nav align-items-center mb-0">
              {!user ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link fw-semibold" to="/login">
                      🔐 Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link fw-semibold" to="/register">
                      📝 Register
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
                    className="btn btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "42px", height: "42px", fontWeight: "bold" }}
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
                                  onClick={() => handleNavigate("/admin/contact-messages")}
                                >
                                  📥 Contact Messages
                                </button>
                              </li>
                              <li className="list-group-item bg-dark text-light">
                                <button
                                  className="btn w-100 text-start text-light"
                                  onClick={() => handleNavigate("/admin/add-movie")}
                                >
                                  ➕ Add Movie
                                </button>
                              </li>
                              <li className="list-group-item bg-dark text-light">
                                <button
                                  className="btn w-100 text-start text-light"
                                  onClick={() => handleNavigate("/admin/add-theater")}
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
      </div>
    </nav>
  );
}

export default Navbar;
