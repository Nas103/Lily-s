# Verify Database Connection

## The Problem

Tables exist in Supabase with correct names (`User`, `Category`, etc.), but Prisma can't find them. This means **Prisma is connecting to a different database** than the one you're viewing in Supabase.

## Solution: Verify DATABASE_URL

### Step 1: Get Your Supabase Project Details

1. Go to **Supabase Dashboard** → Your Project
2. Click **Settings** → **General**
3. Note your **Project ID** (looks like: `tnpspjnxnsfsdllkkgbd`)

### Step 2: Check Your DATABASE_URL

Open `.env.local` and find `DATABASE_URL`. It should contain your project ID.

**Example:**
```
DATABASE_URL="postgresql://postgres.tnpspjnxnsfsdllkkgbd:password@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"
```

The part after `postgres.` should match your Project ID.

### Step 3: Get the Correct Connection String

1. Go to **Supabase Dashboard** → **Settings** → **Database**
2. Scroll to **Connection Pooling**
3. Select **Session** mode
4. Copy the connection string
5. Make sure it includes:
   - Your correct project ID
   - Port `6543` (Connection Pooling)
   - `.pooler.supabase.com` in the hostname

### Step 4: Update .env.local

1. Open `.env.local`
2. Replace `DATABASE_URL` with the correct connection string from Step 3
3. Make sure to add `&pgbouncer=true&connect_timeout=15` at the end if not present

### Step 5: Test Connection

```powershell
npx prisma generate
node scripts/verify-tables.js
```

This should now find the tables!

### Step 6: Start Prisma Studio

```powershell
npm run db:studio
```

## Common Issues

### Issue: Multiple Supabase Projects

If you have multiple Supabase projects, make sure:
- The `DATABASE_URL` points to the project where you see the tables
- You're checking the correct project in Supabase Dashboard

### Issue: Wrong Database in Connection String

The connection string might point to:
- A different Supabase project
- A different database within the same project
- A test/staging database instead of production

### Issue: Connection Pooling vs Direct Connection

Make sure you're using:
- **Connection Pooling** (port 6543, `.pooler` in hostname) for your app
- The **same connection string** that Prisma uses

## Quick Check

Run this to see what database Prisma is connecting to:

```powershell
node -e "require('dotenv').config({path:'.env.local'}); console.log(process.env.DATABASE_URL)"
```

Compare the project ID in the output with your Supabase project ID.

