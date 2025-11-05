import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Profile from './components/auth/Profile';
import SearchRides from './components/rides/SearchRides';
import CreateRide from './components/rides/CreateRide';
import RideDetails from './components/rides/RideDetails';
import RideList from './components/rides/RideList';
import BookingList from './components/bookings/BookingList';
import ChatList from './components/messages/ChatList';
import NotificationList from './components/notifications/NotificationList';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Navigate to="/search" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route path="/search" element={
                  <ProtectedRoute>
                    <SearchRides />
                  </ProtectedRoute>
                } />

                <Route path="/rides/create" element={
                  <ProtectedRoute>
                    <CreateRide />
                  </ProtectedRoute>
                } />

                <Route path="/rides/:id" element={
                  <ProtectedRoute>
                    <RideDetails />
                  </ProtectedRoute>
                } />

                <Route path="/my-rides" element={
                  <ProtectedRoute>
                    <RideList />
                  </ProtectedRoute>
                } />

                <Route path="/bookings" element={
                  <ProtectedRoute>
                    <BookingList />
                  </ProtectedRoute>
                } />

                <Route path="/messages" element={
                  <ProtectedRoute>
                    <ChatList />
                  </ProtectedRoute>
                } />

                <Route path="/notifications" element={
                  <ProtectedRoute>
                    <NotificationList />
                  </ProtectedRoute>
                } />

                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;