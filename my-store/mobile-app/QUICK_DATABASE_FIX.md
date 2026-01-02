# Quick Database Fix for Authentication

## The Problem
Mobile app shows "Service temporarily unavailable" when trying to login/register because `DATABASE_URL` is not set.

## Quick Fix

### Step 1: Create `.env.local` file

```bash
cd my-store
touch .env.local
```

### Step 2: Add DATABASE_URL

Edit `.env.local` and add your database connection string:

```env
DATABASE_URL="your-database-connection-string-here"
```

**If you already have a database working for the web app:**
- Check if you have the connection string saved somewhere
- Copy it to `.env.local`
- Or check your hosting platform (Vercel, etc.) for the DATABASE_URL

### Step 3: Get Database Connection String

If you don't have one yet, get a free PostgreSQL database:

**Option 1: Supabase (Recommended)**
1. Go to https://supabase.com
2. Create free account
3. Create new project
4. Go to Settings → Database
5. Copy "Connection string" (use "Session" mode for connection pooling)
6. Format: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`

**Option 2: Neon**
1. Go to https://neon.tech
2. Create free account
3. Create new project
4. Copy connection string

**Option 3: Railway**
1. Go to https://railway.app
2. Create free account
3. Create PostgreSQL database
4. Copy connection string

### Step 4: Push Database Schema

```bash
cd my-store
npx prisma db push
```

This creates all the necessary tables (User, Order, etc.)

### Step 5: Restart Backend

```bash
# Stop current backend (Ctrl+C)
# Then restart:
cd my-store
npm run dev
```

### Step 6: Test Authentication

Now try signing in/signing up from the mobile app. It should work!

## Verify It's Working

```bash
# Test the API directly:
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test12345"}'
```

If you get a proper response (not "Service temporarily unavailable"), it's working!

## Common Issues

**"Environment variable not found: DATABASE_URL"**
- Make sure `.env.local` exists in `my-store/` directory
- Make sure `DATABASE_URL` is set (no quotes needed in the file)
- Restart the backend after creating/updating `.env.local`

**"Prisma Client not found"**
```bash
cd my-store
npx prisma generate
```

**Connection errors**
- Check your DATABASE_URL format
- Make sure database is accessible
- For Supabase, use connection pooling URL (port 6543)

## After Setup

Once DATABASE_URL is set:
- ✅ Authentication works
- ✅ User registration works  
- ✅ Profile management works
- ✅ Orders work
- ✅ All database features work

