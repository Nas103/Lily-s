# ⚠️ IMPORTANT: Backend Restart Required

## The Problem
The API returns 404 when accessed via IP address (`192.168.151.240:3000`), even though it works on `localhost:3000`.

## The Solution
**You MUST restart the backend** for the `-H 0.0.0.0` configuration to take full effect.

## Steps to Fix

1. **Stop the current backend:**
   - Go to the terminal running `npm run dev`
   - Press `Ctrl+C` to stop it

2. **Restart the backend:**
   ```bash
   cd my-store
   npm run dev
   ```

3. **Verify it's working:**
   ```bash
   # Should work on localhost
   curl http://localhost:3000/api/products
   
   # Should ALSO work on IP (after restart)
   curl http://192.168.151.240:3000/api/products
   ```

4. **Check the Next.js output:**
   You should see:
   ```
   ▲ Next.js 14.x.x
   - Local:        http://localhost:3000
   - Network:      http://192.168.151.240:3000  ← This should appear!
   ```

5. **Restart Expo:**
   ```bash
   cd mobile-app
   npm start
   ```

## Why This Happens

Next.js caches routing information. When you change the host binding, it needs a full restart to:
- Rebuild route handlers
- Update internal routing tables
- Accept connections from the new host

The backend process is running with `-H 0.0.0.0`, but Next.js hasn't fully initialized with that configuration yet.

## After Restart

Once restarted, both URLs should work:
- ✅ `http://localhost:3000/api/products` 
- ✅ `http://192.168.151.240:3000/api/products`

The mobile app should then be able to connect successfully!

