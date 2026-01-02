# Fixing Connection Issues

## Current Issue
The mobile app can't connect to the backend server.

## Quick Fixes

### Option 1: Use ADB Port Forwarding (Android Emulator)
```bash
# Map emulator port 3000 to host port 3000
adb reverse tcp:3000 tcp:3000

# Then update API_BASE_URL in src/config/api.ts to:
# http://localhost:3000 (even for Android)
```

### Option 2: Use Your Computer's IP Address
1. **Find your IP address:**
   ```bash
   # Mac/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # Windows
   ipconfig
   # Look for "IPv4 Address" under your WiFi adapter
   ```

2. **Update `src/config/api.ts`:**
   ```typescript
   export const API_BASE_URL = __DEV__
     ? 'http://YOUR_IP:3000'  // e.g., http://192.168.1.100:3000
     : 'https://your-production-domain.com';
   ```

3. **Make sure:**
   - Backend is running: `cd my-store && npm run dev`
   - Backend is accessible: Open `http://YOUR_IP:3000/api/products` in browser
   - Firewall allows port 3000

### Option 3: Start Backend on All Interfaces
Make sure your Next.js backend binds to `0.0.0.0` instead of just `localhost`:

1. **Check `my-store/package.json`:**
   ```json
   "scripts": {
     "dev": "next dev -H 0.0.0.0"
   }
   ```

2. **Or start manually:**
   ```bash
   cd my-store
   next dev -H 0.0.0.0
   ```

## Verify Backend is Running

```bash
# Check if backend is running
curl http://localhost:3000/api/products

# Should return JSON array of products
```

## Test Connection from Emulator

1. **Android Emulator:**
   ```bash
   # Test connection
   adb shell
   curl http://10.0.2.2:3000/api/products
   ```

2. **Or use ADB reverse:**
   ```bash
   adb reverse tcp:3000 tcp:3000
   # Then use http://localhost:3000 in app
   ```

## Common Issues

### Backend Not Running
```bash
cd my-store
npm run dev
```

### Firewall Blocking
- Allow port 3000 in firewall settings
- On Mac: System Preferences → Security → Firewall → Options

### Wrong IP Address
- Make sure you're using the IP of the computer running the backend
- Phone and computer must be on same WiFi network

### CORS Issues
- Backend should already handle CORS for mobile apps
- Check `src/lib/middleware.ts` - CSRF allows mobile requests

## Recommended Solution

**For Development:**
1. Use ADB reverse: `adb reverse tcp:3000 tcp:3000`
2. Update `src/config/api.ts` to use `http://localhost:3000` for both platforms
3. Restart Expo

**For Physical Device Testing:**
1. Find computer's IP address
2. Update `src/config/api.ts` with your IP
3. Ensure backend is accessible at `http://YOUR_IP:3000`
4. Make sure phone and computer are on same WiFi

