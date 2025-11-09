import api from './api'; // Custom Axios instance (usually configured with baseURL and interceptors)

// Service that defines all authentication-related API calls
export const authService = {
  // Login user using email and password -> backend returns JWT + user data
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data; // Contains token and user info
  },

  // Register a new user -> sends user data to backend signup endpoint
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  // Fetch currently authenticated user's info using JWT stored in headers (handled by api interceptor)
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data; // Returns user object (id, name, email, etc.)
  },

  // Update user profile by userId -> sends updated fields to backend
  updateProfile: async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },
};