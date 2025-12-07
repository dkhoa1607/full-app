// API Configuration
// This file centralizes all API endpoints for easy configuration

// For local development, use http://localhost:5000
// For production, set VITE_API_URL environment variable in Vercel
// IMPORTANT: You MUST set VITE_API_URL in Vercel frontend environment variables!
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? 'http://localhost:5000' : 'https://full-app-da2f.vercel.app');

// Log the API URL for debugging (remove in production if needed)
if (import.meta.env.DEV) {
  console.log('API Base URL:', API_BASE_URL);
  console.log('VITE_API_URL env:', import.meta.env.VITE_API_URL);
}

// Helper function to make API calls with credentials
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Merge headers properly - user headers can override defaults
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const defaultOptions = {
    credentials: 'include', // Important: Include cookies for JWT authentication
    ...options, // Spread user options first
    headers, // Then set merged headers
  };

  try {
    const response = await fetch(url, defaultOptions);
    return response;
  } catch (error) {
    console.error('API Call Error:', error);
    console.error('URL:', url);
    console.error('API Base URL:', API_BASE_URL);
    throw error;
  }
};

// Export base URL for direct use if needed
export default API_BASE_URL;

