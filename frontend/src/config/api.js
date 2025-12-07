// API Configuration
// This file centralizes all API endpoints for easy configuration

// For local development, use http://localhost:5000
// For production, set VITE_API_URL environment variable in Vercel
// IMPORTANT: You MUST set VITE_API_URL in Vercel frontend environment variables!
// Format: https://your-backend.vercel.app (with https://, no trailing slash)

let API_BASE_URL = import.meta.env.VITE_API_URL;

// If not set, use default based on environment
if (!API_BASE_URL) {
  API_BASE_URL = import.meta.env.DEV 
    ? 'http://localhost:5000' 
    : 'https://full-app-da2f.vercel.app';
}

// Clean up the URL - remove trailing slash and ensure it's a full URL
API_BASE_URL = API_BASE_URL.trim();
if (API_BASE_URL.endsWith('/')) {
  API_BASE_URL = API_BASE_URL.slice(0, -1);
}

// If it doesn't start with http:// or https://, it's probably wrong
if (!API_BASE_URL.startsWith('http://') && !API_BASE_URL.startsWith('https://')) {
  console.error('⚠️ WARNING: API_BASE_URL does not start with http:// or https://');
  console.error('Current value:', API_BASE_URL);
  console.error('Please set VITE_API_URL in Vercel environment variables with full URL (e.g., https://your-backend.vercel.app)');
}

// Log the API URL for debugging
console.log('🔗 API Base URL:', API_BASE_URL);
console.log('🔗 VITE_API_URL env:', import.meta.env.VITE_API_URL);

// Helper function to make API calls with credentials
export const apiCall = async (endpoint, options = {}) => {
  // Ensure endpoint starts with /
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Construct full URL
  const url = `${API_BASE_URL}${cleanEndpoint}`;
  
  // Log for debugging
  console.log('🌐 Making API call to:', url);
  
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
    
    // Log response for debugging
    if (!response.ok) {
      console.error('❌ API Error:', response.status, response.statusText);
      console.error('❌ URL:', url);
    }
    
    return response;
  } catch (error) {
    console.error('❌ API Call Error:', error);
    console.error('❌ URL:', url);
    console.error('❌ API Base URL:', API_BASE_URL);
    console.error('❌ Endpoint:', endpoint);
    throw error;
  }
};

// Export base URL for direct use if needed
export default API_BASE_URL;

