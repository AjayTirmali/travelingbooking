import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import "./AddBooking.css";

const ADD_BOOKING = gql`
  mutation AddBooking($name: String!, $email: String!, $destination: String!, $date: String!) {
    addBooking(name: $name, email: $email, destination: $destination, date: $date) {
      id
      name
      email
      destination
      date
    }
  }
`;

// Helper function to format date in YYYY-MM-DD format
const formatDateForSubmission = (dateString) => {
  if (!dateString) return "";
  
  // If it's already in YYYY-MM-DD format, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error("Invalid date for formatting:", dateString);
      return "";
    }
    
    // Format as YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

const AddBooking = ({ onBookingAdded }) => {
  const [form, setForm] = useState({ name: "", email: "", destination: "", date: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  
  const [addBooking, { loading }] = useMutation(ADD_BOOKING, {
    onCompleted: () => {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      // Call the callback function if provided
      if (onBookingAdded) {
        onBookingAdded();
      }
    },
    onError: (error) => {
      console.error("GraphQL Error:", error);
      setErrors({ 
        submit: error.message.replace("Error adding booking: ", "") 
      });
    }
  });

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email is invalid";
    if (!form.destination.trim()) newErrors.destination = "Destination is required";
    if (!form.date) newErrors.date = "Date is required";
    else {
      // Validate that the date is not in the past
      const selectedDate = new Date(form.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = "Date cannot be in the past";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      // Format the date properly before submission
      const formattedDate = formatDateForSubmission(form.date);
      console.log("Original date:", form.date);
      console.log("Formatted date for submission:", formattedDate);
      
      if (!formattedDate) {
        setErrors({ date: "Invalid date format" });
        return;
      }
      
      const variables = {
        ...form,
        date: formattedDate
      };
      
      console.log("Submitting booking with variables:", variables);
      await addBooking({ variables });
      setForm({ name: "", email: "", destination: "", date: "" });
    } catch (err) {
      console.error("❌ Error submitting form:", err.message);
      setErrors({ submit: "Something went wrong. Please try again." });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="booking-form">
      <h2>Book Your Travel</h2>
      
      {success && (
        <div className="success-message">
          Booking successful! Your trip has been booked.
        </div>
      )}
      
      {errors.submit && (
        <div className="error-message">{errors.submit}</div>
      )}
      
    <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
      <input
        type="text"
            id="name"
            name="name"
            className="form-control"
            placeholder="Enter your full name"
        value={form.name}
            onChange={handleChange}
      />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
      <input
        type="email"
            id="email"
            name="email"
            className="form-control"
            placeholder="Enter your email"
        value={form.email}
            onChange={handleChange}
      />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="destination">Destination</label>
      <input
        type="text"
            id="destination"
            name="destination"
            className="form-control"
            placeholder="Where do you want to go?"
        value={form.destination}
            onChange={handleChange}
      />
          {errors.destination && <div className="error-message">{errors.destination}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="date">Travel Date</label>
      <input
        type="date"
            id="date"
            name="date"
            className="form-control"
        value={form.date}
            onChange={handleChange}
            min={today}
          />
          {errors.date && <div className="error-message">{errors.date}</div>}
        </div>
        
        <button 
          type="submit" 
          className="btn-submit"
          disabled={loading}
        >
          {loading ? "Booking..." : "Book Now"}
        </button>
    </form>
    </div>
  );
};

export default AddBooking;
