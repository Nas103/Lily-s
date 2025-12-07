# Fix: "prepared statement already exists" Error

## The Problem

You're seeing this error:
```
prepared statement "s0" already exists
```

This happens because:
- Supabase Connection Pooling uses PgBouncer
- Prisma tries to use prepared statements
- PgBouncer doesn't support prepared statements the same way
- Multiple connections try to create the same prepared statement

## The Solution

I've updated your Prisma client configuration to add `pgbouncer=true` parameter automatically when using Connection Pooling.

### What Was Changed

In `src/lib/prisma.ts`, the Prisma client now:
- Detects if you're using Connection Pooling (checks for "pooler" in URL)
- Automatically adds `pgbouncer=true` parameter
- Adds `connect_timeout=15` for better connection handling

### Connection String Format

Your connection string will now automatically become:
```
postgres://...pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x&pgbouncer=true&connect_timeout=15
```

## Additional Fix: Update Connection String in Vercel

To ensure this works on Vercel, update your `DATABASE_URL` to include the pgbouncer parameter:

1. **Go to Vercel** → Settings → Environment Variables
2. **Edit `DATABASE_URL`**
3. **Add `&pgbouncer=true`** to the end:
   ```
   postgres://postgres.cerclrsxxsrladrhwbme:9E4mPFzcWsZWRRKt@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x&pgbouncer=true
   ```
4. **Save and redeploy**

## Alternative: Use Direct Connection for Certain Operations

If the error persists, you can use the direct connection for migrations:

1. **Get `POSTGRES_URL_NON_POOLING`** from Vercel
2. **Temporarily use it** for `npx prisma db push`
3. **Switch back to Connection Pooling** for runtime

## Why This Works

- `pgbouncer=true` tells Prisma to work in transaction mode
- This disables prepared statements that conflict with PgBouncer
- `connect_timeout=15` gives more time for connections

## Test It

After updating:

1. **Restart your dev server**:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

2. **Try login again** - should work without the error!

3. **Check Vercel** - update DATABASE_URL there too and redeploy

## Summary

- ✅ Code updated to handle Connection Pooling better
- 🔄 Update DATABASE_URL in Vercel to include `&pgbouncer=true`
- 🔄 Redeploy on Vercel
- ✅ Error should be resolved!

