# 🔴 URGENT FIX: "Cannot Connect to Server"

## The Problem

Your frontend (`full-app-ten.vercel.app`) is trying to connect to a backend, but getting "NOT_FOUND".

**This means the backend URL is wrong or not set!**

---

## ✅ SOLUTION (Do This Now)

### Step 1: Find Your Backend URL

1. Go to **Vercel Dashboard**: https://vercel.com/dashboard
2. Look for your **BACKEND project** (separate from frontend)
3. **Copy the URL** - it looks like:
   - `https://your-backend-name.vercel.app`
   - OR `https://full-app-backend.vercel.app`

**If you don't see a backend project:**
- You need to deploy the backend first (see Step 2)

### Step 2: Deploy Backend (If Not Done)

1. **Vercel Dashboard** → **"Add New Project"**
2. **Import your GitHub repository**
3. **Configure:**
   - **Root Directory**: `back-end` ⚠️ IMPORTANT!
   - **Framework**: Other
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)
4. **Environment Variables** (Click "Environment Variables"):
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_random_secret_key
   FRONTEND_URL=https://full-app-ten.vercel.app
   NODE_ENV=production
   ```
5. **Click "Deploy"**
6. **Wait 2-3 minutes**
7. **Copy the backend URL** (e.g., `https://your-backend.vercel.app`)

### Step 3: Test Backend

**Open in browser:**
```
https://your-backend-url.vercel.app
```

**Should see:** `API is running...`

**If you see error:**
- Check Vercel function logs
- Verify environment variables are set

### Step 4: Set Frontend Environment Variable ⚠️ CRITICAL

1. **Vercel Dashboard** → **Your Frontend Project** (`full-app-ten`)
2. **Settings** → **Environment Variables**
3. **Add New:**
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.vercel.app` (use YOUR backend URL from Step 1)
   - **Environment**: Select **"Production"** ✅
4. **Click "Save"**

### Step 5: Redeploy Frontend

1. **Deployments tab**
2. **Click "Redeploy"** on latest deployment
3. **OR** push a new commit

### Step 6: Test

1. Visit: `https://full-app-ten.vercel.app`
2. Open DevTools (F12) → **Console tab**
3. Type: `import.meta.env.VITE_API_URL`
4. **Should show your backend URL** (not undefined)
5. Try to login again

---

## 🔍 How to Check What's Wrong

### Check 1: What URL is Frontend Using?

1. Open: `https://full-app-ten.vercel.app`
2. Press **F12** → **Console tab**
3. Type: `import.meta.env.VITE_API_URL`
4. Press Enter

**What you see:**
- ✅ `https://your-backend.vercel.app` → Good! But check if backend works
- ❌ `undefined` → **Environment variable not set!** (Do Step 4)
- ❌ `https://full-app-da2f.vercel.app` → Wrong URL! (Do Step 4)

### Check 2: Test Backend Directly

**Open in browser:**
```
https://your-backend.vercel.app
```

**Expected:**
- ✅ `API is running...` → Backend works!
- ❌ 404 or error → Backend not deployed or wrong URL

**Test API:**
```
https://your-backend.vercel.app/api/products
```

**Expected:**
- ✅ JSON data with products
- ❌ Error → Backend has issues

### Check 3: Network Tab

1. Open frontend
2. **F12** → **Network tab**
3. Try to login
4. Click on failed "login" request
5. Check **"Headers"** → **"Request URL"**

**Should be:**
```
https://your-backend.vercel.app/api/users/login
```

**If it's different:**
- Environment variable is wrong
- Fix in Step 4

---

## 🎯 Most Common Issue

**The `VITE_API_URL` environment variable is NOT set!**

**Current code uses:**
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://full-app-da2f.vercel.app';
```

**If `VITE_API_URL` is not set, it uses the hardcoded URL which is probably wrong!**

**Fix:** Set `VITE_API_URL` in Vercel frontend environment variables!

---

## ✅ Quick Checklist

- [ ] Backend is deployed in Vercel
- [ ] Backend URL works (`/` shows "API is running...")
- [ ] Backend API works (`/api/products` returns data)
- [ ] `VITE_API_URL` is set in frontend environment variables
- [ ] `VITE_API_URL` value matches your backend URL exactly
- [ ] Environment variable is set for "Production" (not just Development)
- [ ] Frontend is redeployed after setting environment variable
- [ ] Browser console shows correct API URL

---

## 🆘 Still Not Working?

**Share these with me:**

1. **Your backend URL** (from Vercel)
2. **What `import.meta.env.VITE_API_URL` shows** (in browser console)
3. **What the Network tab shows** for the request URL
4. **Backend function logs** (Vercel → Deployments → Functions)

**Most likely:** Environment variable not set or wrong value!

