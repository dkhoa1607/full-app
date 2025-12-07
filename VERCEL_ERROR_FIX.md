# Fixing "Internal Server Error" on Vercel

## Common Causes & Solutions

### 1. Check Vercel Function Logs

**Most Important Step:**
1. Go to your Vercel project dashboard
2. Click on "Deployments" tab
3. Click on the failed deployment
4. Click on "Functions" tab
5. Click on any function to see detailed logs
6. **Look for the actual error message** - this will tell you what's wrong

---

## Common Issues & Fixes

### Issue 1: Missing Environment Variables

**Symptoms:**
- Error mentions `process.env.MONGO_URI` or `JWT_SECRET`
- Database connection fails

**Fix:**
1. Go to Vercel Project → Settings → Environment Variables
2. Make sure ALL these are set:
   ```
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=your_secret_key
   FRONTEND_URL=https://your-frontend.vercel.app
   NODE_ENV=production
   ```
3. **Redeploy** after adding variables

---

### Issue 2: Database Connection Error

**Symptoms:**
- Error: "MongoServerError" or "connection timeout"
- Error: "MongooseError"

**Fix:**
1. **Check MongoDB Atlas:**
   - Go to MongoDB Atlas dashboard
   - Network Access → Make sure `0.0.0.0/0` is whitelisted
   - Database Access → Verify user credentials

2. **Check MONGO_URI format:**
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dbname?retryWrites=true&w=majority
   ```
   - Replace `<password>` with actual password
   - Make sure no spaces or quotes

3. **Test connection:**
   - Try connecting from MongoDB Compass or another tool
   - Verify the connection string works

---

### Issue 3: CORS Error

**Symptoms:**
- Error: "Not allowed by CORS"
- Frontend can't connect to backend

**Fix:**
1. **Update FRONTEND_URL:**
   - Go to Backend project → Settings → Environment Variables
   - Set `FRONTEND_URL` to your exact frontend URL:
     ```
     FRONTEND_URL=https://your-frontend-app.vercel.app
     ```
   - Make sure it matches EXACTLY (no trailing slash)

2. **Redeploy backend** after updating

---

### Issue 4: Module Import Error

**Symptoms:**
- Error: "Cannot find module"
- Error: "Unexpected token"

**Fix:**
1. **Check package.json:**
   - Make sure `"type": "module"` is set (already done)
   - Verify all dependencies are listed

2. **Check imports:**
   - Make sure all file paths use `.js` extension
   - Example: `import User from './models/userModel.js'`

---

### Issue 5: Express 5 Compatibility

**Symptoms:**
- Error related to Express
- Middleware errors

**Fix:**
- The code is already using Express 5
- If issues persist, check Vercel logs for specific Express errors

---

### Issue 6: Serverless Function Timeout

**Symptoms:**
- Request times out
- Function execution time exceeded

**Fix:**
1. **Check database connection:**
   - Slow DB connections can cause timeouts
   - Make sure MongoDB Atlas is in same region

2. **Optimize database queries:**
   - Add indexes if needed
   - Check for slow queries

---

## Step-by-Step Debugging

### Step 1: Check Function Logs
```
Vercel Dashboard → Deployments → Latest → Functions → Click function → View logs
```

### Step 2: Test Backend Directly
```bash
# Test root endpoint
curl https://your-backend.vercel.app

# Should return: "API is running..."

# Test API endpoint
curl https://your-backend.vercel.app/api/products

# Should return JSON data
```

### Step 3: Verify Environment Variables
1. Go to Vercel → Project → Settings → Environment Variables
2. Check each variable:
   - ✅ MONGO_URI is set and correct
   - ✅ JWT_SECRET is set
   - ✅ FRONTEND_URL matches your frontend URL exactly
   - ✅ NODE_ENV=production

### Step 4: Check MongoDB Connection
1. Go to MongoDB Atlas
2. Network Access → Verify `0.0.0.0/0` is allowed
3. Database Access → Verify user exists and password is correct
4. Test connection string in MongoDB Compass

### Step 5: Redeploy
After fixing issues:
1. Go to Deployments tab
2. Click "Redeploy" on latest deployment
3. Or push a new commit to trigger redeploy

---

## Quick Fix Checklist

- [ ] Checked Vercel function logs for actual error
- [ ] All environment variables are set correctly
- [ ] MONGO_URI is correct and tested
- [ ] JWT_SECRET is set
- [ ] FRONTEND_URL matches frontend URL exactly
- [ ] MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- [ ] Database user credentials are correct
- [ ] Redeployed after fixing issues

---

## Still Having Issues?

1. **Share the exact error from Vercel logs**
2. **Check the specific endpoint that's failing**
3. **Verify all environment variables are set**
4. **Test MongoDB connection separately**

The most common issue is missing or incorrect environment variables, especially `MONGO_URI`.

