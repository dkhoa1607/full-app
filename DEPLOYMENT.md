# Vercel Deployment Guide

This guide will help you deploy your full-stack application to Vercel with JWT authentication properly configured.

## Changes Made

### 1. Centralized API Configuration
- Created `frontend/src/config/api.js` to centralize all API endpoints
- All frontend API calls now use the `apiCall` helper function
- Supports environment variables via `VITE_API_URL`

### 2. Backend Cookie Settings
- Updated cookie settings for production:
  - `secure: true` in production (HTTPS only)
  - `sameSite: 'none'` in production for cross-site cookies
  - `sameSite: 'lax'` in development

### 3. CORS Configuration
- Updated CORS to accept credentials
- Configurable frontend URL via `FRONTEND_URL` environment variable

### 4. Vercel Configuration
- Created `vercel.json` for backend serverless functions

## Deployment Steps

### Backend Deployment

1. **Navigate to backend directory:**
   ```bash
   cd back-end
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables in Vercel:**
   - Go to your Vercel project settings
   - Add the following environment variables:
     - `MONGO_URI` - Your MongoDB connection string
     - `JWT_SECRET` - A strong random string (generate one)
     - `FRONTEND_URL` - Your frontend Vercel URL (e.g., `https://your-frontend.vercel.app`)
     - `NODE_ENV` - Set to `production`

4. **Deploy to Vercel:**
   ```bash
   vercel
   ```
   Or connect your GitHub repository to Vercel for automatic deployments.

5. **Note your backend URL** (e.g., `https://your-backend.vercel.app`)

### Frontend Deployment

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Create `.env` file:**
   ```env
   VITE_API_URL=https://your-backend.vercel.app
   ```
   Replace `https://your-backend.vercel.app` with your actual backend URL.

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Build the project:**
   ```bash
   npm run build
   ```

5. **Deploy to Vercel:**
   ```bash
   vercel
   ```
   Or connect your GitHub repository to Vercel.

6. **Set environment variable in Vercel:**
   - Go to your frontend Vercel project settings
   - Add environment variable:
     - `VITE_API_URL` - Your backend Vercel URL

## Important Notes

### Cookie Settings
- Cookies are now configured to work with cross-site requests in production
- Make sure both frontend and backend are on HTTPS (Vercel provides this automatically)

### CORS
- The backend now accepts requests from your frontend URL
- Update `FRONTEND_URL` in backend environment variables if your frontend URL changes

### JWT Tokens
- Tokens are stored in httpOnly cookies for security
- Tokens expire after 30 days
- Tokens are automatically sent with every request via `credentials: 'include'`

## Testing

1. **Test authentication:**
   - Try logging in from your deployed frontend
   - Check browser DevTools > Application > Cookies to see the JWT cookie
   - Verify that authenticated requests work

2. **Test CORS:**
   - Make sure requests from your frontend to backend work
   - Check browser console for any CORS errors

3. **Test cookie settings:**
   - Verify cookies are being set with `secure` and `sameSite` attributes
   - Check that cookies persist across page refreshes

## Troubleshooting

### Cookies not being set
- Ensure both frontend and backend are on HTTPS
- Check that `FRONTEND_URL` matches your actual frontend URL
- Verify `sameSite: 'none'` is set in production

### CORS errors
- Verify `FRONTEND_URL` in backend environment variables matches your frontend URL
- Check that `credentials: true` is set in CORS configuration

### API calls failing
- Verify `VITE_API_URL` in frontend environment variables matches your backend URL
- Check that all API calls use the `apiCall` helper function
- Ensure `credentials: 'include'` is set in fetch requests (handled by `apiCall`)

## Environment Variables Summary

### Backend (.env)
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
PORT=5000
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend.vercel.app
```

