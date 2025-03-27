import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client';
import AddBooking from './components/AddBooking';
import BookingList from './components/BookingList';
import Navigation from './components/Navigation';
import './App.css';

// Determine the GraphQL endpoint based on environment
const getGraphQLEndpoint = () => {
  // In production, use relative URL that will be proxied to the backend
  if (process.env.NODE_ENV === 'production') {
    return '/graphql';
  }
  // In development, use the full URL
  return 'http://localhost:5000/graphql';
};

// Initialize Apollo Client
const client = new ApolloClient({
  link: new HttpLink({
    uri: getGraphQLEndpoint(),
    credentials: 'same-origin'
  }),
  cache: new InMemoryCache()
});

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [activePage, setActivePage] = useState('booking');

  const handleBookingAdded = () => {
    // Increment the key to force a refresh of the BookingList component
    setRefreshKey(prevKey => prevKey + 1);
    
    // Automatically switch to the bookings page after successful booking
    setActivePage('bookings');
  };

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App-header">
          <h1>Travel Booking System</h1>
          <p>Book your next adventure with us!</p>
        </header>
        
        <main className="App-main">
          <Navigation activePage={activePage} setActivePage={setActivePage} />
          
          {activePage === 'booking' ? (
            <AddBooking onBookingAdded={handleBookingAdded} />
          ) : (
            <BookingList key={refreshKey} />
          )}
        </main>
        
        <footer className="App-footer">
          <p>&copy; {new Date().getFullYear()} Travel Booking System. All rights reserved.</p>
        </footer>
      </div>
    </ApolloProvider>
  );
}

export default App;
