import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Footer() {
  return (
    <footer className="bg-dark text-light pt-5 pb-3 mt-5">
      <div className="container">
        <div className="row text-start">
          {/* Movie info columns */}
          <div className="col-md-3 col-sm-6 mb-4">
            <h6 className="text-uppercase text-warning">🎬 Now Showing in Pune</h6>
            <ul className="list-unstyled small">
              <li>Superman</li>
              <li>Maalik</li>
              <li>Jurassic World</li>
              <li>Metro... In Dino</li>
              <li>F1: The Movie</li>
            </ul>
          </div>
          <div className="col-md-3 col-sm-6 mb-4">
            <h6 className="text-uppercase text-warning">🎥 Upcoming Movies</h6>
            <ul className="list-unstyled small">
              <li>Smurfs</li>
              <li>Ekka</li>
              <li>I Know What You Did</li>
              <li>Tanvi: The Great</li>
              <li>Chaatar</li>
            </ul>
          </div>
          <div className="col-md-3 col-sm-6 mb-4">
            <h6 className="text-uppercase text-warning">🧩 Movies by Genre</h6>
            <ul className="list-unstyled small">
              <li>Action</li>
              <li>Comedy</li>
              <li>Drama</li>
              <li>Sci-Fi</li>
              <li>Romantic</li>
            </ul>
          </div>
          <div className="col-md-3 col-sm-6 mb-4">
            <h6 className="text-uppercase text-warning">🌐 Movies by Language</h6>
            <ul className="list-unstyled small">
              <li>English</li>
              <li>Hindi</li>
              <li>Marathi</li>
              <li>Telugu</li>
              <li>Tamil</li>
            </ul>
          </div>
        </div>

        <hr className="border-secondary" />

        {/* Contact Button Row */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small text-muted">
          <div>
            © {new Date().getFullYear()} <span className="text-danger fw-semibold">Show</span>.
            <span className="text-warning fw-semibold">Pluzo</span> — All Rights Reserved
          </div>
          <div className="mt-3 mt-md-0">
            <Link to="/contact" className="btn btn-outline-warning btn-sm">
              📞 Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
