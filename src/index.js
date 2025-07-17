// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./AuthContext"; // ✅ Auth Context Provider
import "bootstrap/dist/css/bootstrap.min.css"; // ✅ Bootstrap CSS
import "./index.css"; // ✅ Custom styles


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
