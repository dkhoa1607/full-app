# Fixing "NOT_FOUND" Error on Vercel

## The Problem

When you try to login, you get:
```
The page could not be found
NOT_FOUND
```

This means Vercel can't find your API route `/api/users/login`.

---

## Quick Fixes

### Fix 1: Check Your Backend URL

**The frontend is using a hardcoded URL!**

1. **Check what backend URL Vercel gave you:**
   - Go to Vercel Dashboard → Your Backend Project
   - Copy the URL (e.g., `https://your-backend-name.vercel.app`)

2. **Update Frontend Environment Variable:**
   - Go to Vercel Dashboard → Your Frontend Project
   - Settings → Environment Variables
   - Add/Update:
     ```
     VITE_API_URL=https://your-actual-backend-url.vercel.app
     ```
   - **Important**: Use YOUR actual backend URL, not the hardcoded one!

3. **Redeploy Frontend:**
   - After updating the environment variable, redeploy

---

### Fix 2: Verify Backend is Working

**Test your backend directly:**

1. **Test root endpoint:**
   ```
   https://your-backend.vercel.app
   ```
   Should return: `API is running...`

2. **Test API endpoint:**
   ```
   https://your-backend.vercel.app/api/products
   ```
   Should return JSON data

3. **Test login endpoint:**
   ```
   https://your-backend.vercel.app/api/users/login
   ```
   Should return an error about missing data (not NOT_FOUND)

---

### Fix 3: Check Vercel Function Logs

1. Go to Vercel Dashboard → Backend Project
2. Deployments → Latest Deployment
3. Functions tab
4. Click on the function
5. **Check for errors** - this will tell you what's wrong

---

### Fix 4: Verify vercel.json Location

**Make sure `vercel.json` is in the `back-end` folder:**
```
back-end/
  ├── vercel.json  ← Must be here
  ├── server.js
  ├── package.json
  └── ...
```

**When deploying:**
- Root Directory should be: `back-end`
- Vercel should find `vercel.json` in that folder

---

### Fix 5: Check Route Configuration

The routes are set up correctly:
- `/api/users/login` → `POST` → `loginUser` controller

**Verify in Vercel:**
1. Go to Functions tab
2. You should see a function for your routes
3. If you see "No functions", the routing is broken

---

## Step-by-Step Solution

### Step 1: Get Your Backend URL
1. Vercel Dashboard → Backend Project
2. Copy the URL (e.g., `https://my-app-backend.vercel.app`)

### Step 2: Update Frontend Environment Variable
1. Vercel Dashboard → Frontend Project
2. Settings → Environment Variables
3. Add:
   ```
   VITE_API_URL=https://my-app-backend.vercel.app
   ```
   (Use YOUR actual backend URL)

### Step 3: Redeploy Frontend
1. Deployments tab
2. Click "Redeploy" on latest deployment
3. Or push a new commit

### Step 4: Test
1. Visit your frontend URL
2. Try to login
3. Check browser console (F12) for the actual API URL being used

---

## Common Issues

### Issue 1: Wrong API URL
**Symptom**: Frontend trying to connect to wrong URL

**Fix**: Set `VITE_API_URL` in frontend environment variables

### Issue 2: Backend Not Deployed
**Symptom**: Backend URL returns 404

**Fix**: Make sure backend is deployed and running

### Issue 3: vercel.json Not Found
**Symptom**: Vercel can't find routes

**Fix**: Make sure `vercel.json` is in `back-end` folder and Root Directory is set to `back-end`

### Issue 4: Routes Not Matching
**Symptom**: Root works but `/api/*` doesn't

**Fix**: Check `vercel.json` routing configuration

---

## Debugging Commands

### Check what URL frontend is using:
1. Open browser DevTools (F12)
2. Console tab
3. Type: `import.meta.env.VITE_API_URL`
4. See what URL it's using

### Test backend directly:
```bash
# Test root
curl https://your-backend.vercel.app

# Test API
curl https://your-backend.vercel.app/api/products

# Test login (should return error about missing data, not NOT_FOUND)
curl -X POST https://your-backend.vercel.app/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'
```

---

## Most Likely Cause

**The frontend is using the wrong backend URL!**

The code has a hardcoded fallback:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? 'http://localhost:5000' : 'https://full-app-da2f.vercel.app');
```

If `VITE_API_URL` is not set, it uses `https://full-app-da2f.vercel.app` which might not be your backend!

**Solution**: Set `VITE_API_URL` environment variable in Vercel frontend project to your actual backend URL.

---

## Quick Checklist

- [ ] Backend is deployed and accessible
- [ ] Backend root URL works (`/` returns "API is running...")
- [ ] Backend API works (`/api/products` returns data)
- [ ] `VITE_API_URL` is set in frontend environment variables
- [ ] `VITE_API_URL` matches your actual backend URL
- [ ] Frontend is redeployed after setting environment variable
- [ ] Browser console shows correct API URL being used

---

## Still Not Working?

1. **Check browser console** (F12) → Network tab
   - See what URL is being called
   - Check the response

2. **Check Vercel function logs**
   - See what errors are happening

3. **Verify environment variables**
   - Make sure they're set for "Production" environment
   - Not just "Development"

4. **Test backend directly**
   - Use Postman or curl to test endpoints
   - Verify they work outside of frontend

