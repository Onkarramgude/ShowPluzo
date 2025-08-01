// ✅ src/App.js
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useAuth } from "./AuthContext";

import Navbar from "./Navbar";
import Footer from "./Footer";

import Home from "./Home";
import Movies from "./Movies";
import MovieDetails from "./MovieDetails";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import Profile from "./Profile";
import Tickets from "./Tickets";
import Contact from "./Contact";
import TicketBookingForm from "./TicketBookingForm";
import TheaterSelection from "./TheaterSelection";
import UserDashboard from "./UserDashboard";

import AdminDashboard from "./AdminDashboard";
import AdminMovies from "./AdminMovies";
import AdminAddMovie from "./AdminAddMovie";
import EditMovie from "./EditMovie";
import AdminAllTickets from "./AdminAllTickets";
import AdminUsers from "./AdminUsers";
import AdminContactMessages from "./AdminContactMessages";
import AddTheater from "./AddTheater";

function App() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const isAdmin = user?.role === "ADMIN";

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar onSearch={setSearchTerm} />

        <div className="flex-grow-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home searchTerm={searchTerm} />} />
            <Route path="/movies" element={<Movies searchTerm={searchTerm} />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/contact" element={<Contact />} />

            {/* User Routes */}
            <Route
              path="/select-theater"
              element={user ? <TheaterSelection /> : <Navigate to="/login" />}
            />
            <Route
              path="/book-ticket"
              element={user ? <TicketBookingForm /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile"
              element={user ? <Profile /> : <Navigate to="/login" />}
            />
            <Route
              path="/tickets"
              element={user ? <Tickets /> : <Navigate to="/login" />}
            />
            <Route
              path="/userdashboard"
              element={user ? <UserDashboard /> : <Navigate to="/login" />}
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />}
            />
            <Route
              path="/admin/dashboard"
              element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />}
            />
            <Route
              path="/admin/movies"
              element={isAdmin ? <AdminMovies /> : <Navigate to="/" />}
            />
            <Route
              path="/admin/add-movie"
              element={isAdmin ? <AdminAddMovie /> : <Navigate to="/" />}
            />
            <Route
              path="/admin/edit-movie/:id"
              element={isAdmin ? <EditMovie /> : <Navigate to="/" />}
            />
            <Route
              path="/admin/tickets"
              element={isAdmin ? <AdminAllTickets /> : <Navigate to="/" />}
            />
            <Route
              path="/admin/users"
              element={isAdmin ? <AdminUsers /> : <Navigate to="/" />}
            />
            <Route
              path="/admin/contact-messages"
              element={isAdmin ? <AdminContactMessages /> : <Navigate to="/" />}
            />
            <Route
              path="/admin/add-theater"
              element={isAdmin ? <AddTheater /> : <Navigate to="/" />}
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
