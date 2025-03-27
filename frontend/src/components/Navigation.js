import React from 'react';
import './Navigation.css';

const Navigation = ({ activePage, setActivePage }) => {
  return (
    <nav className="navigation">
      <ul className="nav-links">
        <li className={activePage === 'booking' ? 'active' : ''}>
          <button onClick={() => setActivePage('booking')}>
            Book a Trip
          </button>
        </li>
        <li className={activePage === 'bookings' ? 'active' : ''}>
          <button onClick={() => setActivePage('bookings')}>
            View Bookings
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation; 