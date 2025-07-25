import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function AdminContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/movies/contact/messages");
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/movies/contact/delete/${id}`);
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
      alert("✅ Message deleted successfully.");
    } catch (err) {
      console.error("Error deleting message", err);
      alert("❌ Failed to delete message.");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary mb-4">📩 Contact Messages</h2>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : messages.length === 0 ? (
        <div className="alert alert-warning text-center">No messages found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg, idx) => (
                <tr key={msg.id}>
                  <td>{idx + 1}</td>
                  <td>{msg.name}</td>
                  <td>{msg.email}</td>
                  <td>{msg.message}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(msg.id)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminContactMessages;
