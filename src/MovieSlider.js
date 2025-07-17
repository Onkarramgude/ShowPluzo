// src/components/MovieSlider.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function MovieSlider() {
  const [featuredMovies, setFeaturedMovies] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/movies/all")
      .then((res) => {
        const topMovies = res.data.slice(0, 5); // show top 5
        setFeaturedMovies(topMovies);
      })
      .catch((err) => console.error("Failed to load featured movies", err));
  }, []);

  return (
    <div className="rounded-4 overflow-hidden shadow-lg mb-4">
      <Carousel fade interval={3000} indicators={true}>
        {featuredMovies.map((movie) => (
          <Carousel.Item key={movie.id}>
            <img
              className="d-block w-100"
              src={movie.posterUrl || "/default-poster.jpg"}
              alt={movie.title}
              style={{ height: "420px", objectFit: "cover" }}
              onError={(e) => (e.target.src = "/default-poster.jpg")}
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}

export default MovieSlider;
