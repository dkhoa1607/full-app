# Complete Vercel Deployment Guide

This guide will walk you through deploying both your backend and frontend to Vercel.

## Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **MongoDB Atlas Account** - For your database (or use your existing MongoDB)

---

## Part 1: Deploy Backend to Vercel

### Step 1: Prepare Backend for Vercel

The backend is already configured with `vercel.json`. Make sure it exists:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Step 2: Update server.js for Vercel

Make sure your `server.js` exports the app for Vercel:

```javascript
// At the end of server.js, add:
export default app; // For Vercel serverless
```

### Step 3: Deploy Backend

1. **Go to [vercel.com](https://vercel.com)** and sign in
2. **Click "Add New Project"**
3. **Import your GitHub repository**
4. **Configure the project:**
   - **Root Directory**: Select `back-end` folder
   - **Framework Preset**: Other
   - **Build Command**: Leave empty (Vercel will auto-detect)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

5. **Add Environment Variables** (Click "Environment Variables"):
   ```
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_strong_random_secret_key_here
   FRONTEND_URL=https://your-frontend-app.vercel.app
   NODE_ENV=production
   PORT=5000
   ```

6. **Click "Deploy"**

7. **Wait for deployment** - Vercel will give you a URL like:
   `https://your-backend-app.vercel.app`

8. **Copy your backend URL** - You'll need this for the frontend!

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Prepare Frontend

The frontend is already configured. No changes needed!

### Step 2: Deploy Frontend

1. **Go back to Vercel dashboard**
2. **Click "Add New Project"** again
3. **Import the same GitHub repository**
4. **Configure the project:**
   - **Root Directory**: Select `frontend` folder
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Add Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-app.vercel.app
   ```
   (Replace with your actual backend URL from Part 1)

6. **Click "Deploy"**

7. **Wait for deployment** - You'll get a URL like:
   `https://your-frontend-app.vercel.app`

---

## Part 3: Update Backend CORS

After deploying frontend, update backend environment variables:

1. **Go to Backend project settings** in Vercel
2. **Environment Variables**
3. **Update `FRONTEND_URL`**:
   ```
   FRONTEND_URL=https://your-frontend-app.vercel.app
   ```
4. **Redeploy backend** (Vercel will auto-redeploy when you save)

---

## Part 4: MongoDB Atlas Setup (If needed)

### If you don't have MongoDB Atlas:

1. **Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)**
2. **Sign up for free account**
3. **Create a free cluster** (M0 - Free tier)
4. **Create database user:**
   - Username: `your-username`
   - Password: `your-password`
5. **Whitelist IP addresses:**
   - Click "Network Access"
   - Add IP: `0.0.0.0/0` (Allow from anywhere)
6. **Get connection string:**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your password
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dbname?retryWrites=true&w=majority`

7. **Add to Vercel backend environment variables:**
   ```
   MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dbname?retryWrites=true&w=majority
   ```

---

## Part 5: Generate JWT Secret

Generate a strong random string for JWT_SECRET:

**Option 1: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 2: Online generator**
- Go to [randomkeygen.com](https://randomkeygen.com/)
- Copy a "CodeIgniter Encryption Keys" value

**Add to Vercel backend:**
```
JWT_SECRET=your_generated_secret_here
```

---

## Part 6: Seed Database (Optional)

After deployment, you can seed your database:

1. **Go to Vercel backend project**
2. **Go to "Deployments" tab**
3. **Click on latest deployment**
4. **Open "Functions" tab**
5. **Or use Vercel CLI:**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to your project
cd back-end
vercel link

# Run seeder (if you have a way to run it)
# Or manually create admin user through your API
```

**Or create admin user via API:**
```bash
# POST to https://your-backend.vercel.app/api/users/register
{
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@gmail.com",
  "password": "123456"
}

# Then manually update isAdmin to true in MongoDB
```

---

## Part 7: Testing Your Deployment

### Test Backend:
1. Visit: `https://your-backend.vercel.app`
   - Should see: `API is running...`

2. Test API endpoint:
   - `https://your-backend.vercel.app/api/products`
   - Should return JSON data

### Test Frontend:
1. Visit: `https://your-frontend.vercel.app`
2. Try to:
   - Browse products
   - Register/Login
   - Add to cart
   - Checkout

### Test Authentication:
1. Register a new account
2. Login
3. Check if JWT cookie is set (DevTools → Application → Cookies)

---

## Part 8: Using Your Deployed App

### For Users:
1. **Visit your frontend URL**: `https://your-frontend-app.vercel.app`
2. **Register/Login** with credentials
3. **Use all features** - shopping, cart, checkout, etc.

### Admin Access:
1. **Login with admin account** (if you seeded the database)
2. **Go to**: `https://your-frontend-app.vercel.app/admin`
3. **Manage**: Products, Orders, Users

### Default Admin Credentials (if seeded):
- **Email**: `admin@gmail.com`
- **Password**: `123456`

---

## Troubleshooting

### Issue 1: CORS Errors
**Solution**: Make sure `FRONTEND_URL` in backend matches your frontend URL exactly

### Issue 2: Cannot Connect to Server
**Solution**: 
- Check backend is deployed and running
- Verify `VITE_API_URL` in frontend matches backend URL
- Check browser console for errors

### Issue 3: Authentication Not Working
**Solution**:
- Check `JWT_SECRET` is set in backend
- Verify cookies are being set (check browser DevTools)
- Make sure `credentials: 'include'` is in API calls (already done)

### Issue 4: Database Connection Error
**Solution**:
- Verify `MONGO_URI` is correct
- Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Verify database user credentials

### Issue 5: Build Fails
**Solution**:
- Check Node.js version (Vercel uses Node 18+ by default)
- Verify all dependencies are in `package.json`
- Check build logs in Vercel dashboard

---

## Quick Reference

### Backend Environment Variables:
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

### Frontend Environment Variables:
```
VITE_API_URL=https://your-backend.vercel.app
```

### URLs:
- **Backend**: `https://your-backend.vercel.app`
- **Frontend**: `https://your-frontend.vercel.app`
- **API Base**: `https://your-backend.vercel.app/api`

---

## Next Steps

1. ✅ Deploy backend
2. ✅ Deploy frontend
3. ✅ Set environment variables
4. ✅ Test all features
5. ✅ Share your app URL!

Your app is now live on Vercel! 🎉

