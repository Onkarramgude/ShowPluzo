// src/Contact.js
import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", msg: "" });

    try {
      // ✅ Correct endpoint with /user/contact
      await axios.post("http://localhost:8080/user/contact", formData);
      setStatus({ type: "success", msg: "✅ Message sent successfully!" });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error(error);
      let errMsg = "❌ Failed to send message. Please try again later.";
      if (error.response && error.response.data) {
        errMsg =
          typeof error.response.data === "string"
            ? error.response.data
            : error.response.data.message || errMsg;
      }
      setStatus({ type: "error", msg: errMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg border-0 rounded-4 p-4 bg-white">
            <h3 className="text-center mb-4 text-primary">📬 Contact Us</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingName"
                  placeholder="Your Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="floatingName">Name</label>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="floatingEmail"
                  placeholder="name@example.com"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="floatingEmail">Email address</label>
              </div>

              <div className="form-floating mb-3">
                <textarea
                  className="form-control"
                  placeholder="Leave a message here"
                  id="floatingMessage"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  style={{ height: "120px" }}
                  required
                />
                <label htmlFor="floatingMessage">Message</label>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Sending..." : "📨 Send Message"}
              </button>
            </form>

            {status.msg && (
              <div
                className={`alert mt-3 text-center ${
                  status.type === "success" ? "alert-success" : "alert-danger"
                }`}
              >
                {status.msg}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
