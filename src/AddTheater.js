// src/pages/AddTheater.js

import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert } from 'react-bootstrap';

function AddTheater() {
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    address: '',
    totalSeats: '',
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:8080/api/movies/admin/add-theater', formData);
      setMessage({ type: 'success', text: '✅ Theater added successfully!' });
      setFormData({ name: '', city: '', address: '', totalSeats: '' });
    } catch (err) {
      setMessage({ type: 'danger', text: '❌ Failed to add theater. Check the console.' });
      console.error(err);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Add New Theater</h2>
      {message.text && <Alert variant={message.type}>{message.text}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="theaterName" className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter theater name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="city" className="mb-3">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="address" className="mb-3">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="totalSeats" className="mb-3">
          <Form.Label>Total Seats</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter number of seats"
            name="totalSeats"
            value={formData.totalSeats}
            onChange={handleChange}
            required
            min={1}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Add Theater
        </Button>
      </Form>
    </Container>
  );
}

export default AddTheater;
