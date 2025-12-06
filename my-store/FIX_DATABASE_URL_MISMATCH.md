# Fix: DATABASE_URL vs POSTGRES_URL Mismatch

## The Problem

Your Prisma schema uses `DATABASE_URL`, but Vercel has `POSTGRES_URL` (from Supabase integration).

This causes "Database is not configured" because Prisma can't find `DATABASE_URL`.

## Solution: Add DATABASE_URL to Vercel

### Option 1: Add DATABASE_URL (Recommended)

1. **In Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. **Find `POSTGRES_URL`** in the list

3. **Click the eye icon** 👁️ next to `POSTGRES_URL` to reveal its value

4. **Copy the entire value**

5. **Click "Create new"** button

6. **Add new variable**:
   - **Key**: `DATABASE_URL`
   - **Value**: Paste the value from `POSTGRES_URL`
   - **Environments**: Select **All Environments** (Production, Preview, Development)
   - **Sensitive**: Leave enabled (recommended)

7. **Click "Save"**

8. **Redeploy**:
   - Go to **Deployments**
   - Click three dots (⋯) → **Redeploy**
   - **Uncheck "Use existing Build Cache"**
   - Click **Redeploy**

### Option 2: Update Prisma Schema (Alternative)

If you prefer to use `POSTGRES_URL` instead:

1. **Edit `prisma/schema.prisma`**:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("POSTGRES_URL")  // Changed from DATABASE_URL
   }
   ```

2. **Commit and push**:
   ```bash
   git add prisma/schema.prisma
   git commit -m "Use POSTGRES_URL instead of DATABASE_URL"
   git push
   ```

3. **Vercel will auto-deploy**

## Why This Happens

When you connect Supabase to Vercel, it automatically creates:
- `POSTGRES_URL` - Connection pooling string
- `POSTGRES_URL_NON_POOLING` - Direct connection
- `POSTGRES_HOST`, `POSTGRES_USER`, etc.

But your Prisma schema is configured to use `DATABASE_URL`, which doesn't exist.

## Quick Fix Checklist

- [ ] Found `POSTGRES_URL` in Vercel Environment Variables
- [ ] Revealed and copied `POSTGRES_URL` value
- [ ] Created new `DATABASE_URL` variable with same value
- [ ] Set for All Environments
- [ ] Saved the variable
- [ ] Redeployed without build cache
- [ ] Tested login - should work now!

## Verify It Works

After redeploying:

1. **Check build logs** - Should see Prisma client generated
2. **Test login** - Should work without "Database is not configured"
3. **Check function logs** - Should see successful database connections

## Recommendation

**Use Option 1** (add DATABASE_URL) because:
- ✅ Keeps your Prisma schema standard
- ✅ Works with existing code
- ✅ No code changes needed
- ✅ Easier to maintain

Option 2 works too, but requires updating your schema and potentially other code that references `DATABASE_URL`.

