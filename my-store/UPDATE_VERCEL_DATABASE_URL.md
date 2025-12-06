# Update DATABASE_URL in Vercel to Fix Prepared Statement Error

## The Fix

Add `&pgbouncer=true` to your `DATABASE_URL` in Vercel to fix the "prepared statement already exists" error.

## Current Connection String

```
postgres://postgres.cerclrsxxsrladrhwbme:9E4mPFzcWsZWRRKt@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x
```

## Updated Connection String (Add This to Vercel)

```
postgres://postgres.cerclrsxxsrladrhwbme:9E4mPFzcWsZWRRKt@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x&pgbouncer=true&connect_timeout=15
```

## Steps to Update in Vercel

1. **Go to Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. **Find `DATABASE_URL`** in the list

3. **Click to edit** (or click the three dots → Edit)

4. **Update the value** to include `&pgbouncer=true&connect_timeout=15` at the end:
   ```
   postgres://postgres.cerclrsxxsrladrhwbme:9E4mPFzcWsZWRRKt@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x&pgbouncer=true&connect_timeout=15
   ```

5. **Make sure it's set for**: All Environments (Production, Preview, Development)

6. **Click "Save"**

7. **Redeploy**:
   - Go to **Deployments**
   - Click three dots (⋯) → **Redeploy**
   - **Uncheck "Use existing Build Cache"**
   - Click **Redeploy**

## What This Does

- `pgbouncer=true` - Tells Prisma to work in transaction mode with PgBouncer
- This prevents the "prepared statement already exists" error
- `connect_timeout=15` - Gives more time for connections (helps with cold starts)

## Why This Is Needed

Supabase Connection Pooling uses PgBouncer, which doesn't support prepared statements the same way as direct PostgreSQL connections. Adding `pgbouncer=true` tells Prisma to use a compatible mode.

## After Updating

1. ✅ **Restart your dev server** (if testing locally)
2. ✅ **Redeploy on Vercel**
3. ✅ **Test login** - should work without errors!

## Note

I've also updated your code (`src/lib/prisma.ts`) to automatically add this parameter, but it's still best to include it in the environment variable for consistency.

