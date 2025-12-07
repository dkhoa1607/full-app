# Troubleshooting "Cannot Connect to Server" Error

## Quick Fix Steps

### 1. Start the Backend Server

**Open a new terminal and run:**
```bash
cd back-end
npm install  # If you haven't installed dependencies
npm start    # Or use: npm run server (for auto-reload with nodemon)
```

The server should start on `http://localhost:5000`

### 2. Check Backend Environment Variables

Make sure `back-end/.env` file exists with:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Check Frontend Environment

The frontend will automatically use `http://localhost:5000` in development mode.

If you want to override it, create `frontend/.env.local`:
```
VITE_API_URL=http://localhost:5000
```

### 4. Verify Server is Running

Open your browser and go to: `http://localhost:5000`

You should see: `API is running...`

### 5. Check Browser Console

Open browser DevTools (F12) and check:
- **Console tab**: Look for error messages
- **Network tab**: Check if requests are being made and what the response is

### Common Issues

#### Issue 1: Backend not running
**Solution**: Start the backend server (Step 1 above)

#### Issue 2: Wrong port
**Solution**: Make sure backend is on port 5000 and frontend is on port 5173

#### Issue 3: CORS error
**Solution**: Check that `FRONTEND_URL=http://localhost:5173` is in backend `.env`

#### Issue 4: MongoDB connection error
**Solution**: Check your `MONGO_URI` in backend `.env` file

#### Issue 5: Port already in use
**Solution**: 
- Change `PORT=5000` to another port (e.g., `PORT=5001`)
- Update frontend `.env.local` to match: `VITE_API_URL=http://localhost:5001`

## Testing the Connection

1. **Test backend directly:**
   ```bash
   curl http://localhost:5000
   ```
   Should return: `API is running...`

2. **Test from browser:**
   Open: `http://localhost:5000/api/products`
   Should return JSON data

3. **Check frontend console:**
   Look for the API Base URL being used:
   - Should show: `http://localhost:5000` in development
   - Check Network tab to see actual requests

## Still Having Issues?

1. **Check if both servers are running:**
   - Backend: `http://localhost:5000`
   - Frontend: `http://localhost:5173` (or your Vite port)

2. **Restart both servers:**
   - Stop both (Ctrl+C)
   - Start backend first
   - Then start frontend

3. **Clear browser cache and cookies:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

4. **Check firewall/antivirus:**
   - Make sure they're not blocking localhost connections

