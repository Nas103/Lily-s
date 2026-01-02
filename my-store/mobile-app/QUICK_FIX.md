# Quick Fix for Connection Issue

## ✅ Solution Applied

1. **Updated API URL** to use your computer's IP: `192.168.151.240:3000`
2. **Updated backend** to bind to all interfaces (`0.0.0.0`)

## Next Steps

1. **Restart your backend:**
   ```bash
   cd my-store
   npm run dev
   ```
   (It will now listen on all interfaces, accessible from emulator)

2. **Restart Expo:**
   ```bash
   cd mobile-app
   npm start
   ```

3. **Test the connection:**
   - Open browser: `http://192.168.151.240:3000/api/products`
   - Should return JSON data
   - If it works in browser, it will work in app

## If IP Changes

If your computer's IP address changes, update `mobile-app/src/config/api.ts`:

```typescript
export const API_BASE_URL = __DEV__
  ? (Platform.OS === 'android' ? 'http://YOUR_NEW_IP:3000' : 'http://localhost:3000')
  : 'https://your-production-domain.com';
```

To find your IP:
```bash
hostname -I
# or
ip addr show | grep "inet " | grep -v 127.0.0.1
```

## Alternative: Use ADB Reverse (Android Only)

If you have Android SDK installed:
```bash
adb reverse tcp:3000 tcp:3000
```

Then you can use `http://localhost:3000` for Android too.

