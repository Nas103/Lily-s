# Fix "Database is not configured" on Vercel

## The Problem

Your deployed app on Vercel shows "Database is not configured" when trying to login.

## Root Causes

1. **DATABASE_URL not set in Vercel** - Most common issue
2. **Wrong environment scope** - Variable not set for Production
3. **Prisma client not generated** - Build process issue
4. **Connection string format** - Wrong connection type

## Step-by-Step Fix

### Step 1: Verify DATABASE_URL in Vercel

1. Go to **Vercel Dashboard** → Your Project
2. Click **Settings** → **Environment Variables**
3. Look for `DATABASE_URL` or `POSTGRES_URL`
4. Check if it exists and is set for **Production**, **Preview**, and **Development**

### Step 2: Add/Update DATABASE_URL

If `DATABASE_URL` doesn't exist or is wrong:

1. In Vercel → **Settings** → **Environment Variables**
2. Click **Add New** (or edit existing)
3. Set:
   - **Key**: `DATABASE_URL`
   - **Value**: Your Supabase Connection Pooling string
     - Should look like: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`
     - Must have `.pooler` and port `6543`
   - **Environments**: Select **ALL** (Production, Preview, Development)
4. Click **Save**

### Step 3: Get Connection Pooling String from Supabase

If you don't have the Connection Pooling string:

1. Go to **Supabase Dashboard** → Your Project
2. **Settings** → **Database**
3. Scroll to **"Connection Pooling"** section
4. Select **"Session"** mode
5. Copy the connection string
6. Make sure password special characters are URL-encoded:
   - `|` → `%7C`
   - `}` → `%7D`
   - `$` → `%24`

### Step 4: Verify Prisma Build Process

Your `package.json` should have:
```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postinstall": "prisma generate"
  }
}
```

This ensures Prisma client is generated during build.

### Step 5: Redeploy

After setting `DATABASE_URL`:

1. Go to **Vercel Dashboard** → **Deployments**
2. Click the three dots (⋯) on the latest deployment
3. Click **Redeploy**
4. **IMPORTANT**: Uncheck **"Use existing Build Cache"**
5. Click **Redeploy**

### Step 6: Check Build Logs

After redeploying, check the build logs:

1. Click on the deployment
2. Go to **"Build Logs"** tab
3. Look for:
   - ✅ `prisma generate` running successfully
   - ✅ `DATABASE_URL` being used
   - ❌ Any Prisma errors

## Quick Checklist

- [ ] `DATABASE_URL` exists in Vercel Environment Variables
- [ ] `DATABASE_URL` is set for Production, Preview, and Development
- [ ] Connection string uses Connection Pooling (`.pooler`, port `6543`)
- [ ] Password special characters are URL-encoded
- [ ] `package.json` has `prisma generate` in build script
- [ ] Redeployed without build cache
- [ ] Build logs show Prisma client generated successfully

## Common Issues

### Issue 1: Variable Not Set for Production

**Symptom**: Works locally but not on Vercel

**Fix**: Make sure `DATABASE_URL` is set for **Production** environment, not just Development

### Issue 2: Wrong Connection String Type

**Symptom**: Connection errors in build logs

**Fix**: Use Connection Pooling string (port 6543), not direct connection (port 5432)

### Issue 3: Prisma Client Not Generated

**Symptom**: Build succeeds but runtime errors

**Fix**: 
- Check `package.json` has `"postinstall": "prisma generate"`
- Check build logs for Prisma generation
- Make sure `prisma` is in `devDependencies`

### Issue 4: Environment Variable Name Mismatch

**Symptom**: Prisma can't find DATABASE_URL

**Fix**: 
- Vercel might have created `POSTGRES_URL` instead
- Either rename it to `DATABASE_URL` or update `prisma/schema.prisma` to use `POSTGRES_URL`

## Verify It's Fixed

After redeploying:

1. **Check build logs** - Should see Prisma client generated
2. **Test login** - Should work without "Database is not configured" error
3. **Check Vercel logs** - Should see successful database connections

## Still Not Working?

1. **Check Vercel Function Logs**:
   - Go to Vercel Dashboard → Your Project → **Functions**
   - Check for any runtime errors

2. **Verify Connection String**:
   - Test it locally: `node scripts/verify-db.js`
   - Make sure it works before adding to Vercel

3. **Check Supabase**:
   - Make sure database is **Active** (not paused)
   - Verify Connection Pooling is enabled

4. **Contact Support**:
   - Share Vercel build logs
   - Share function runtime logs
   - Share your Prisma schema

