import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import './BookingList.css';

const GET_ACTIVE_BOOKINGS = gql`
  query GetActiveBookings {
    getActiveBookings {
      id
      name
      email
      destination
      date
    }
  }
`;

const DELETE_BOOKING = gql`
  mutation DeleteBooking($id: ID!) {
    deleteBooking(id: $id) {
      success
      message
    }
  }
`;

// Helper function to format dates
const formatDate = (dateString) => {
  try {
    // Check if dateString is valid
    if (!dateString) {
      console.error("Empty date string received");
      return 'No date available';
    }
    
    console.log("Formatting date string:", dateString);
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error("Invalid date:", dateString);
      return 'Invalid date';
    }
    
    // Format the date
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error, dateString);
    return 'Error formatting date';
  }
};

// Helper function to calculate days left
const calculateDaysLeft = (dateString) => {
  try {
    // Check if dateString is valid
    if (!dateString) {
      console.error("Empty date string received for days calculation");
      return 'N/A';
    }
    
    console.log("Calculating days left for date string:", dateString);
    
    const bookingDate = new Date(dateString);
    if (isNaN(bookingDate.getTime())) {
      console.error("Invalid date for days calculation:", dateString);
      return 'Invalid date';
    }
    
    // Set both dates to start of day for accurate calculation
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    bookingDate.setHours(0, 0, 0, 0);
    
    const diffTime = bookingDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  } catch (error) {
    console.error('Error calculating days left:', error, dateString);
    return 'Error';
  }
};

const BookingList = () => {
  const [deleteMessage, setDeleteMessage] = useState(null);
  const { loading, error, data, refetch } = useQuery(GET_ACTIVE_BOOKINGS);
  
  const [deleteBooking] = useMutation(DELETE_BOOKING, {
    onCompleted: (data) => {
      if (data.deleteBooking.success) {
        setDeleteMessage({
          type: 'success',
          text: 'Booking deleted successfully!'
        });
        // Refetch the bookings list
        refetch();
      } else {
        setDeleteMessage({
          type: 'error',
          text: data.deleteBooking.message || 'Failed to delete booking.'
        });
      }
      
      // Clear the message after 3 seconds
      setTimeout(() => {
        setDeleteMessage(null);
      }, 3000);
    },
    onError: (error) => {
      setDeleteMessage({
        type: 'error',
        text: `Error: ${error.message}`
      });
      
      // Clear the message after 3 seconds
      setTimeout(() => {
        setDeleteMessage(null);
      }, 3000);
    }
  });

  const handleRefresh = () => {
    refetch();
    setDeleteMessage(null);
  };
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      deleteBooking({ variables: { id } });
    }
  };

  if (loading) return (
    <div className="booking-list">
      <div className="booking-list-header">
        <h2>Your Bookings</h2>
        <button className="refresh-btn" onClick={handleRefresh} disabled>
          <span className="refresh-icon">↻</span> Refreshing...
        </button>
      </div>
      <p className="loading">Loading bookings...</p>
    </div>
  );

  if (error) return (
    <div className="booking-list">
      <div className="booking-list-header">
        <h2>Your Bookings</h2>
        <button className="refresh-btn" onClick={handleRefresh}>
          <span className="refresh-icon">↻</span> Refresh
        </button>
      </div>
      <div className="error">
        <p>Error loading bookings: {error.message}</p>
        <p>Please check if the backend server is running and try again.</p>
      </div>
    </div>
  );

  return (
    <div className="booking-list">
      <div className="booking-list-header">
        <h2>Your Active Bookings</h2>
        <button className="refresh-btn" onClick={handleRefresh}>
          <span className="refresh-icon">↻</span> Refresh
        </button>
      </div>
      
      {deleteMessage && (
        <div className={`message ${deleteMessage.type}`}>
          {deleteMessage.text}
        </div>
      )}

      {data.getActiveBookings.length === 0 ? (
        <div className="no-bookings">
          <p>No active bookings found.</p>
          <p>Book your first trip to get started!</p>
        </div>
      ) : (
        <>
          <p className="booking-count">Showing {data.getActiveBookings.length} active booking(s)</p>
          <div className="bookings-container">
            {data.getActiveBookings.map((booking) => {
              const daysLeft = calculateDaysLeft(booking.date);
              return (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <h3>{booking.destination}</h3>
                    <button 
                      className="delete-btn" 
                      onClick={() => handleDelete(booking.id)}
                      title="Delete booking"
                    >
                      ×
                    </button>
                  </div>
                  <div className="booking-details">
                    <p><strong>Traveler:</strong> {booking.name}</p>
                    <p><strong>Email:</strong> {booking.email}</p>
                    <p><strong>Date:</strong> {formatDate(booking.date)}</p>
                    <p className={`days-left ${daysLeft <= 3 ? 'urgent' : ''}`}>
                      <strong>Days left:</strong> {daysLeft}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      
      <div className="booking-note">
        <p><strong>Note:</strong> Bookings are automatically removed when their travel date has passed.</p>
      </div>
    </div>
  );
};

export default BookingList; 