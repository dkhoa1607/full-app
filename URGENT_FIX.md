# URGENT: Fix "Cannot Connect to Server" Error

## What's Happening

Your frontend (`full-app-ten.vercel.app`) is getting "NOT_FOUND" when trying to call the backend API.

This means:
- ❌ Frontend can't find the backend
- ❌ Backend URL is wrong or not set
- ❌ Backend might not be deployed

---

## IMMEDIATE FIX (5 Minutes)

### Step 1: Find Your Backend URL

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Look for your BACKEND project** (not frontend)
3. **Copy the URL** - it should be something like:
   - `https://your-backend-name.vercel.app`
   - OR `https://full-app-backend.vercel.app`
   - OR similar

### Step 2: Test Backend Directly

**Open in browser:**
```
https://your-backend-url.vercel.app
```

**Should see:** `API is running...`

**If you see 404 or error:**
- Backend is not deployed correctly
- Go to Step 3

**If it works:**
- Go to Step 4

### Step 3: Deploy Backend (If Not Deployed)

1. **Go to Vercel Dashboard**
2. **Click "Add New Project"**
3. **Import your GitHub repository**
4. **Configure:**
   - **Root Directory**: `back-end`
   - **Framework**: Other
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)
5. **Add Environment Variables:**
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_random_secret_key
   FRONTEND_URL=https://full-app-ten.vercel.app
   NODE_ENV=production
   ```
6. **Click "Deploy"**
7. **Wait for deployment**
8. **Copy the backend URL**

### Step 4: Set Frontend Environment Variable

1. **Go to Vercel Dashboard**
2. **Click on your FRONTEND project** (`full-app-ten`)
3. **Go to Settings → Environment Variables**
4. **Add/Update:**
   ```
   VITE_API_URL=https://your-backend-url.vercel.app
   ```
   **Replace with YOUR actual backend URL from Step 1**

5. **Make sure it's set for "Production" environment**

### Step 5: Redeploy Frontend

1. **Go to Deployments tab**
2. **Click "Redeploy" on latest deployment**
3. **OR push a new commit to trigger redeploy**

### Step 6: Test Again

1. **Visit:** `https://full-app-ten.vercel.app`
2. **Try to login**
3. **Open DevTools (F12) → Network tab**
4. **Check the request URL** - it should be:
   ```
   https://your-backend-url.vercel.app/api/users/login
   ```

---

## Quick Check: What URL is Frontend Using?

1. **Open your frontend**: `https://full-app-ten.vercel.app`
2. **Press F12** (DevTools)
3. **Console tab**
4. **Type:** `import.meta.env.VITE_API_URL`
5. **Press Enter**

**What you should see:**
- ✅ Your backend URL (e.g., `https://your-backend.vercel.app`)
- ❌ `undefined` (means environment variable not set)
- ❌ Wrong URL (means wrong value set)

---

## Common Issues

### Issue 1: Backend Not Deployed
**Symptom**: Can't find backend project in Vercel

**Fix**: Deploy backend first (Step 3)

### Issue 2: Wrong Root Directory
**Symptom**: Backend deployed but routes don't work

**Fix**: 
- Go to Backend Project → Settings
- Check "Root Directory" is set to `back-end`
- Redeploy

### Issue 3: Environment Variable Not Set
**Symptom**: Frontend using wrong URL

**Fix**: 
- Set `VITE_API_URL` in frontend environment variables
- Make sure it's for "Production"
- Redeploy frontend

### Issue 4: Backend URL Wrong
**Symptom**: Backend exists but frontend can't connect

**Fix**:
- Verify backend URL works: `https://your-backend.vercel.app`
- Update `VITE_API_URL` with correct URL
- Redeploy frontend

---

## Debugging Steps

### 1. Check Backend Status
```
Visit: https://your-backend.vercel.app
Expected: "API is running..."
```

### 2. Test Backend API
```
Visit: https://your-backend.vercel.app/api/products
Expected: JSON data with products
```

### 3. Test Login Endpoint
```
Visit: https://your-backend.vercel.app/api/users/login
Expected: Error about missing data (NOT "NOT_FOUND")
```

### 4. Check Frontend Network Tab
1. Open frontend
2. F12 → Network tab
3. Try to login
4. Click on the failed "login" request
5. Check "Headers" tab → "Request URL"
6. **Should be:** `https://your-backend.vercel.app/api/users/login`

---

## Most Likely Problem

**The `VITE_API_URL` environment variable is NOT set in your frontend project!**

**Solution:**
1. Go to Vercel → Frontend Project → Settings → Environment Variables
2. Add: `VITE_API_URL=https://your-backend-url.vercel.app`
3. Redeploy frontend

---

## Still Not Working?

**Check these:**

1. ✅ Backend is deployed and accessible
2. ✅ Backend root URL works (`/` shows "API is running...")
3. ✅ Backend API works (`/api/products` returns data)
4. ✅ `VITE_API_URL` is set in frontend
5. ✅ `VITE_API_URL` matches your backend URL exactly
6. ✅ Frontend is redeployed after setting environment variable
7. ✅ Check browser console for actual URL being used

**Share with me:**
- Your backend URL
- What `import.meta.env.VITE_API_URL` shows in console
- What the Network tab shows for the request URL

