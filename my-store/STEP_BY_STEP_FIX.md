# Step-by-Step Fix for Database Connection

## The Problem
You're getting: **"Can't reach database server at `db.tnpspjnxnsfsdllkkgbd.supabase.co:5432`"**

This happens because you're using the **direct connection** which may not be accessible.

## The Solution: Use Connection Pooling

### Step 1: Check Database Status
1. Go to https://supabase.com/dashboard
2. Select your project
3. **Check if database is Active** (not paused)
   - If it shows "Paused", click **"Resume"** button
   - Wait for it to become "Active"

### Step 2: Get Connection Pooling String
1. In Supabase Dashboard, go to **Settings** → **Database**
2. Scroll down to **"Connection Pooling"** section
3. You'll see different modes: **Session**, **Transaction**, **Statement**
4. Click on **"Session"** mode
5. Under **"Connection string"**, you'll see a string like:
   ```
   postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```
6. **Copy this entire string**

**Important:** Notice it has:
- `.pooler` in the hostname
- Port `6543` (not 5432)

### Step 3: Update .env.local

**Option A: Use the Script (Easiest)**
```powershell
.\update-to-pooling.ps1
```
Then paste the connection string when prompted.

**Option B: Manual Update**
1. Open `.env.local` file
2. Find the line: `DATABASE_URL=postgresql://...`
3. Replace the entire value with the Connection Pooling string from Step 2
4. Save the file

**Important:** If your password has special characters, make sure they're URL-encoded:
- `|` → `%7C`
- `}` → `%7D`
- `$` → `%24`

### Step 4: Restart Dev Server
```bash
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 5: Test Connection
```bash
node scripts/verify-db.js
```

You should see:
- ✅ DATABASE_URL is set
- ✅ Database connection successful
- ✅ Tables exist

### Step 6: Try Login/Signup Again
Go to your app and try logging in or signing up. It should work now!

## Why Connection Pooling?

- ✅ **More reliable** - Works better with serverless environments
- ✅ **Better for Vercel** - Handles connection limits
- ✅ **More accessible** - Works from different networks
- ✅ **Recommended by Supabase** for production use

## Still Not Working?

1. **Check Supabase Dashboard** - Make sure database is Active
2. **Verify Connection String** - Should have `.pooler` and port `6543`
3. **Check Password Encoding** - Special characters must be URL-encoded
4. **Restart Server** - Make sure you restarted after updating .env.local
5. **Check Network** - Make sure you're not behind a restrictive firewall

## Need Help?

If you're still having issues:
1. Run: `node scripts/verify-db.js` and share the output
2. Check Supabase Dashboard → Settings → Database for any warnings
3. Verify the connection string format matches the example above

