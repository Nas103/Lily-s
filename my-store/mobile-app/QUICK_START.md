# Quick Start Guide

## Prerequisites

1. **Backend Must Be Running:**
   ```bash
   cd ../my-store
   npm run dev
   ```
   Backend should be running on `http://localhost:3000`

2. **Database Configured:**
   - Make sure `.env.local` exists in `my-store/` directory
   - `DATABASE_URL` is set
   - Run `npx prisma db push` if needed

## Starting the Mobile App

1. **Navigate to mobile app:**
   ```bash
   cd mobile-app
   ```

2. **Install dependencies (if not done):**
   ```bash
   npm install
   ```

3. **Start Expo:**
   ```bash
   npm start
   ```

4. **Choose platform:**
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Scan QR code with Expo Go app on your phone

## Important: API Configuration

The mobile app connects to your Next.js backend. Make sure:

1. **Backend is running** on port 3000
2. **API URL is correct** in `src/config/api.ts`:
   - Android emulator: `http://10.0.2.2:3000` ✅ (already set)
   - iOS simulator: `http://localhost:3000` ✅ (already set)
   - Physical device: Update with your computer's IP

3. **For Physical Device Testing:**
   - Find your IP: `ifconfig` (Mac/Linux) or `ipconfig` (Windows)
   - Update `src/config/api.ts`:
     ```typescript
     export const API_BASE_URL = __DEV__
       ? 'http://YOUR_IP:3000'  // e.g., http://192.168.1.100:3000
       : 'https://your-production-domain.com';
     ```

## Testing Authentication

1. **Sign Up:**
   - Tap "Sign Up" on login screen
   - Enter name, email, password (8+ characters)
   - Should create account and log you in

2. **Sign In:**
   - Enter email and password
   - Should log you in and navigate to home

3. **If Authentication Fails:**
   - Check backend is running
   - Check database is configured
   - Check error message for details
   - See TROUBLESHOOTING.md

## Testing Products

1. **Home Screen:**
   - Should show featured products
   - If empty, check backend `/api/products` endpoint

2. **Categories Screen:**
   - Browse by category
   - Products should load

3. **If Products Don't Load:**
   - Check backend: `http://localhost:3000/api/products`
   - Should return JSON array
   - Check API URL in `src/config/api.ts`
   - See TROUBLESHOOTING.md

## Common First-Time Issues

### "Network Error"
- Backend not running → Start with `npm run dev` in `my-store/`
- Wrong API URL → Check `src/config/api.ts`
- Firewall blocking → Allow port 3000

### "Products not loading"
- Backend not running
- Wrong API URL
- Check browser: `http://localhost:3000/api/products`

### "Can't sign in/up"
- Backend not running
- Database not configured
- Check `.env.local` has `DATABASE_URL`
- Run `npx prisma db push` in `my-store/`

## Verification Steps

1. ✅ Backend running: `http://localhost:3000` works
2. ✅ API works: `http://localhost:3000/api/products` returns data
3. ✅ Database: Can create users
4. ✅ Mobile app: Connects to backend
5. ✅ Products: Load on home screen
6. ✅ Auth: Can sign up and sign in

## Next Steps

Once everything works:
- Test all features (cart, checkout, profile)
- Update API URL for production
- Build for app stores (see PUBLISHING_GUIDE.md)

