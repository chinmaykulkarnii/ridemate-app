import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          RideMate
        </Link>

        {isAuthenticated ? (
          <>
            <div className={`nav-menu ${menuOpen ? 'active' : ''}`}>
              <Link to="/search" className="nav-link">Search Rides</Link>
              <Link to="/rides/create" className="nav-link">Post Ride</Link>
              <Link to="/my-rides" className="nav-link">My Rides</Link>
              <Link to="/bookings" className="nav-link">Bookings</Link>
              <Link to="/messages" className="nav-link">Messages</Link>
              <Link to="/notifications" className="nav-link">
                Notifications {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
              </Link>
              <Link to="/profile" className="nav-link">Profile</Link>
              <button onClick={handleLogout} className="nav-link btn-logout">
                Logout
              </button>
            </div>
            <div className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </>
        ) : (
          <div className="nav-menu">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link btn-primary">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;