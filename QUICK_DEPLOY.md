# Quick Vercel Deployment Guide

## 🚀 Step-by-Step Deployment

### Prerequisites
- GitHub repository with your code
- Vercel account (free): [vercel.com](https://vercel.com)
- MongoDB Atlas account (free): [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

---

## 📦 Part 1: Deploy Backend (5 minutes)

### 1. Go to Vercel Dashboard
- Visit [vercel.com/new](https://vercel.com/new)
- Click "Import Git Repository"
- Select your repository

### 2. Configure Backend Project
- **Project Name**: `your-app-backend` (or any name)
- **Root Directory**: `back-end` (click "Edit" and select `back-end` folder)
- **Framework Preset**: Other
- **Build Command**: (leave empty)
- **Output Directory**: (leave empty)

### 3. Add Environment Variables
Click "Environment Variables" and add:

```
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dbname?retryWrites=true&w=majority
JWT_SECRET=generate_a_random_32_character_string_here
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

**To generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Deploy
- Click "Deploy"
- Wait 2-3 minutes
- **Copy your backend URL** (e.g., `https://your-app-backend.vercel.app`)

---

## 🎨 Part 2: Deploy Frontend (5 minutes)

### 1. Create New Project in Vercel
- Click "Add New Project" again
- Import the same repository

### 2. Configure Frontend Project
- **Project Name**: `your-app-frontend`
- **Root Directory**: `frontend` (select `frontend` folder)
- **Framework Preset**: Vite (auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 3. Add Environment Variable
```
VITE_API_URL=https://your-app-backend.vercel.app
```
(Use the backend URL from Part 1)

### 4. Deploy
- Click "Deploy"
- Wait 2-3 minutes
- **Copy your frontend URL** (e.g., `https://your-app-frontend.vercel.app`)

---

## 🔄 Part 3: Update Backend CORS

### 1. Go to Backend Project Settings
- Click on your backend project
- Go to "Settings" → "Environment Variables"

### 2. Update FRONTEND_URL
```
FRONTEND_URL=https://your-app-frontend.vercel.app
```
(Use your frontend URL from Part 2)

### 3. Redeploy
- Vercel will auto-redeploy when you save
- Or manually click "Redeploy" in Deployments tab

---

## 🗄️ Part 4: MongoDB Atlas Setup

### If you don't have MongoDB:

1. **Sign up**: [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. **Create Free Cluster** (M0 - Free tier)
3. **Create Database User**:
   - Username: `admin` (or any)
   - Password: `your-password`
4. **Network Access**:
   - Click "Network Access"
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (`0.0.0.0/0`)
5. **Get Connection String**:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your password
   - Example: `mongodb+srv://admin:password123@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

6. **Add to Backend Environment Variables**:
   ```
   MONGO_URI=mongodb+srv://admin:password123@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

## ✅ Part 5: Test Your Deployment

### Test Backend:
1. Visit: `https://your-app-backend.vercel.app`
   - Should see: `API is running...`
2. Test API: `https://your-app-backend.vercel.app/api/products`
   - Should return JSON

### Test Frontend:
1. Visit: `https://your-app-frontend.vercel.app`
2. Try to:
   - Browse products ✅
   - Register account ✅
   - Login ✅
   - Add to cart ✅

---

## 🎯 Using Your Deployed App

### For Regular Users:
1. Visit: `https://your-app-frontend.vercel.app`
2. Register/Login
3. Shop, add to cart, checkout

### For Admin:
1. Login with admin account
2. Visit: `https://your-app-frontend.vercel.app/admin`
3. Manage products, orders, users

### Create Admin User:
If you need to create an admin user, you can:
1. Register normally through the app
2. Go to MongoDB Atlas
3. Find your user in the database
4. Set `isAdmin: true` manually

Or use the seeder (if you set it up):
```bash
# In MongoDB Atlas, you can run scripts or use the API
```

---

## 🔧 Troubleshooting

### ❌ CORS Error
**Fix**: Make sure `FRONTEND_URL` in backend exactly matches your frontend URL

### ❌ Cannot Connect to Server
**Fix**: 
- Check backend is deployed
- Verify `VITE_API_URL` matches backend URL
- Check browser console (F12)

### ❌ Authentication Not Working
**Fix**:
- Check `JWT_SECRET` is set
- Verify cookies in browser DevTools → Application → Cookies
- Check backend logs in Vercel dashboard

### ❌ Database Error
**Fix**:
- Verify `MONGO_URI` is correct
- Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Verify database user credentials

---

## 📝 Environment Variables Summary

### Backend (Vercel):
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

### Frontend (Vercel):
```
VITE_API_URL=https://your-backend.vercel.app
```

---

## 🎉 You're Done!

Your app is now live on Vercel! 

- **Frontend**: `https://your-app-frontend.vercel.app`
- **Backend**: `https://your-app-backend.vercel.app`

Share your frontend URL with users! 🚀

