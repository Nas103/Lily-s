# Troubleshooting Guide

## Common Issues and Solutions

### 1. Products Not Loading

**Symptoms:**
- Products don't appear on home screen or categories
- "Loading..." message stays forever
- Network errors in console

**Solutions:**

1. **Check Backend is Running:**
   ```bash
   cd my-store
   npm run dev
   ```
   Make sure it's running on port 3000

2. **Check API Configuration:**
   - Open `mobile-app/src/config/api.ts`
   - For Android emulator: Should be `http://10.0.2.2:3000`
   - For iOS simulator: Should be `http://localhost:3000`
   - For physical device: Use your computer's IP (e.g., `http://192.168.1.100:3000`)

3. **Find Your Computer's IP:**
   - Mac/Linux: `ifconfig | grep "inet " | grep -v 127.0.0.1`
   - Windows: `ipconfig` (look for IPv4 Address)

4. **Check Network:**
   - Phone and computer must be on same WiFi network
   - Firewall might be blocking port 3000

### 2. Authentication Not Working

**Symptoms:**
- Can't sign in or sign up
- Error messages appear
- Login/register buttons don't work

**Solutions:**

1. **Check Backend Database:**
   ```bash
   cd my-store
   # Make sure DATABASE_URL is set in .env.local
   npx prisma db push
   ```

2. **Check Error Messages:**
   - Read the error alert carefully
   - Common errors:
     - "Invalid email or password" - Wrong credentials
     - "User already exists" - Email already registered
     - "Network Error" - Backend not running or wrong API URL

3. **Password Requirements:**
   - Must be 8-128 characters
   - Check password meets requirements

4. **Clear App Data:**
   - Uninstall and reinstall app
   - Or clear app data in device settings

### 3. Network Errors

**Symptoms:**
- "Network Error" messages
- "Unable to connect to server"
- Timeout errors

**Solutions:**

1. **Verify Backend:**
   - Open browser: `http://localhost:3000/api/products`
   - Should return JSON data
   - If not, backend isn't running correctly

2. **Check API URL:**
   - Update `src/config/api.ts` with correct URL
   - Restart Expo: `npm start --clear`

3. **Firewall:**
   - Allow port 3000 in firewall settings
   - On Mac: System Preferences → Security → Firewall

4. **Same Network:**
   - Phone and computer must be on same WiFi
   - Try turning WiFi off/on on phone

### 4. CSRF Errors

**Symptoms:**
- "Invalid origin" errors
- 403 Forbidden responses

**Solutions:**

1. **Already Fixed:**
   - CSRF middleware now allows mobile app requests
   - Should work automatically

2. **If Still Happening:**
   - Check `src/lib/middleware.ts` in backend
   - Make sure mobile app detection is working

### 5. Products Show But Empty

**Symptoms:**
- App loads but no products display
- Empty product lists

**Solutions:**

1. **Check Backend Products:**
   - Visit `http://localhost:3000/api/products` in browser
   - Should return array of products
   - If empty, check `src/data/products.ts` in backend

2. **Check Response Format:**
   - Backend returns array directly
   - Mobile app handles both formats

### 6. App Crashes on Startup

**Solutions:**

1. **Clear Cache:**
   ```bash
   cd mobile-app
   rm -rf .expo node_modules/.cache
   npm start --clear
   ```

2. **Reinstall Dependencies:**
   ```bash
   rm -rf node_modules
   npm install
   ```

3. **Check Logs:**
   - Look at terminal for error messages
   - Check device logs if available

## Testing Checklist

Before reporting issues, verify:

- [ ] Backend is running (`npm run dev` in my-store)
- [ ] Backend accessible at `http://localhost:3000`
- [ ] API URL correct in `src/config/api.ts`
- [ ] Phone and computer on same WiFi
- [ ] Database configured (DATABASE_URL in .env.local)
- [ ] Prisma schema pushed (`npx prisma db push`)
- [ ] No firewall blocking port 3000
- [ ] Expo cache cleared (`npm start --clear`)

## Getting Help

If issues persist:

1. Check terminal logs for detailed errors
2. Check browser console if testing web version
3. Verify backend logs in Next.js terminal
4. Check network tab in browser dev tools
5. Try accessing API directly in browser

## Quick Fixes

**Reset Everything:**
```bash
# Backend
cd my-store
rm -rf .next node_modules
npm install
npm run dev

# Mobile App
cd mobile-app
rm -rf .expo node_modules/.cache node_modules
npm install
npm start --clear
```

**Test API Directly:**
```bash
# Test products endpoint
curl http://localhost:3000/api/products

# Test login endpoint
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

