# Quick Fix: Database Connection Error

## Current Error
```
Can't reach database server at `db.tnpspjnxnsfsdllkkgbd.supabase.co:5432`
```

## Immediate Fix (3 Steps)

### Step 1: Check Database Status in Supabase
1. Go to https://supabase.com/dashboard
2. Select your project
3. Check if database shows **"Active"** (not paused)
4. If paused, click **"Resume"** button

### Step 2: Get Connection Pooling String
1. In Supabase Dashboard → **Settings** → **Database**
2. Scroll to **"Connection Pooling"** section
3. Under **"Connection string"**, select **"Session"** mode
4. Copy the connection string (it will have `.pooler` and port `6543`)
   - Example format: `postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`

### Step 3: Update .env.local
Replace your current `DATABASE_URL` with the Connection Pooling string:

```bash
# Open .env.local and replace DATABASE_URL line with:
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres"
```

**Important:** Make sure to URL-encode special characters in the password:
- `|` → `%7C`
- `}` → `%7D`  
- `$` → `%24`

### Step 4: Test Connection
```bash
node scripts/verify-db.js
```

### Step 5: Restart Dev Server
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Why Connection Pooling?

- ✅ Works better with serverless/server environments
- ✅ More reliable connections
- ✅ Better for Vercel deployments
- ✅ Handles connection limits better

## Alternative: If You Must Use Direct Connection

1. Make sure database is **Active** (not paused)
2. Check **Settings** → **Database** → **Network Restrictions**
3. Temporarily allow all IPs or add your IP
4. Use the direct connection string (port 5432)

But **Connection Pooling is recommended** for production!

