import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

// Create a Context to share authentication data across the app
const AuthContext = createContext();

// Custom hook so components can easily access the AuthContext
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);         // Stores logged-in user's info
  const [loading, setLoading] = useState(true);   // Indicates if auth status is being checked

// Runs once when the component (or AuthProvider) mounts
// Purpose: Check if the user is already logged in using a stored JWT token
useEffect(() => {
  const token = localStorage.getItem('token'); // Check if a JWT token exists in browser storage

  if (token) {
    // If token exists, verify it by calling backend: /users/me
    authService.getCurrentUser()
      .then(userData => {
        // If token is valid, store minimal user information in state
        setUser({
          id: userData.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName
        });
      })
      .catch(() => {
        // If token is invalid/expired, remove it from storage → user is treated as logged out
        localStorage.removeItem('token');
      })
      .finally(() => setLoading(false)); // In all cases, stop loading state
  } else {
    // No token found → no need to check backend
    setLoading(false);
  }
}, []); // Empty dependency → runs only once when component is loaded

  // Login function called by login form
  const login = async (email, password) => {
    const response = await authService.login(email, password); // Send credentials to backend
    localStorage.setItem('token', response.token);             // Save JWT token in browser storage

    // Extract and store minimal user info (avoids storing sensitive data)
    const userInfo = {
      id: response.id,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName
    };
    setUser(userInfo);
    return response; // Allow caller to handle navigation or UI updates
  };

  // Signup function: registers a new user in backend
  const signup = async (userData) => {
    await authService.signup(userData);
  };

  // Logout: remove token and reset user info
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Values shared with all components using `useAuth()`
  const value = {
    user,                      // Current user object or null
    login,                     // Function to log in
    signup,                    // Function to sign up
    logout,                    // Function to log out
    isAuthenticated: !!user,   // Boolean: true if user is logged in
    loading                    // Boolean: true while checking token/user on first load
  };

  // Provide auth data & functions to all children components
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};