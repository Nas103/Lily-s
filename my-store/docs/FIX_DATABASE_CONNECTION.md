# Fix Database Connection Error

## The Problem

You're seeing: **"Can't reach database server at `db.tnpspjnxnsfsdllkkgbd.supabase.co:5432`"**

This happens because:
1. The database might be paused in Supabase
2. You're using the direct connection (port 5432) which may not be accessible
3. You need to use Connection Pooling for better reliability

## Solution: Use Connection Pooling

Supabase provides Connection Pooling which is more reliable and works better with serverless environments like Vercel.

### Step 1: Get Connection Pooling String

1. Go to your **Supabase Dashboard**
2. Select your project
3. Go to **Settings** → **Database**
4. Scroll down to **Connection Pooling**
5. Copy the **Connection String** under **Session mode** or **Transaction mode**
   - It will look like: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`
   - Notice it uses port **6543** (not 5432) and has `.pooler` in the hostname

### Step 2: Update DATABASE_URL in Vercel

1. Go to **Vercel Dashboard** → Your Project
2. **Settings** → **Environment Variables**
3. Find `DATABASE_URL` (or `POSTGRES_URL`)
4. Click to edit
5. Replace the value with the **Connection Pooling** string from Step 1
6. Make sure it's set for **Production**, **Preview**, and **Development**
7. Click **Save**

### Step 3: Update Local .env.local

```bash
# Pull the updated environment variables
vercel env pull .env.local

# Or manually update .env.local with the pooling connection string
```

### Step 4: Check Database Status

1. Go to **Supabase Dashboard** → Your Project
2. Check if the database shows as **"Active"** (not paused)
3. If paused, click **"Resume"** to activate it

### Step 5: Verify Connection

```bash
# Test the connection
node scripts/verify-db.js
```

### Step 6: Push Schema (If Not Done)

```bash
# Make sure tables exist
npx prisma db push
```

### Step 7: Redeploy

1. Go to **Vercel Dashboard** → **Deployments**
2. Click the three dots (⋯) → **Redeploy**
3. **Uncheck "Use existing Build Cache"**
4. Click **Redeploy**

## Alternative: Direct Connection (If Pooling Doesn't Work)

If you need to use direct connection:

1. Make sure database is **not paused** in Supabase
2. Check **Settings** → **Database** → **Network Restrictions**
3. Ensure your IP/network is allowed (or disable restrictions temporarily)
4. Use the **Direct connection** string (port 5432)

## Quick Checklist

- [ ] Database is active (not paused) in Supabase
- [ ] Using Connection Pooling string (port 6543)
- [ ] Updated `DATABASE_URL` in Vercel Environment Variables
- [ ] Updated local `.env.local` file
- [ ] Pushed database schema: `npx prisma db push`
- [ ] Redeployed application

## Still Having Issues?

1. **Check Supabase Status**: Make sure your project is active
2. **Verify Connection String Format**: Should include `.pooler` and port `6543`
3. **Check Vercel Logs**: Look for specific Prisma connection errors
4. **Test Locally**: Run `node scripts/verify-db.js` to see detailed error messages

