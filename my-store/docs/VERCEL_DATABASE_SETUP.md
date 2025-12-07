# Vercel Database Setup - Quick Guide

## The Problem
After deploying to Vercel, you see "Database is not configured" error even though you've set environment variables.

## The Solution

### 1. Set DATABASE_URL in Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add:
   - **Key**: `DATABASE_URL`
   - **Value**: Your PostgreSQL connection string (from Supabase, Neon, or Railway)
   - **Environment**: Select all (Production, Preview, Development)
6. Click **Save**

### 2. Create Database Tables
You need to push your Prisma schema to create the tables. Run this locally:

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login and link your project
vercel login
vercel link

# Pull environment variables
vercel env pull .env.local

# Push database schema
npx prisma db push
```

### 3. Redeploy
After setting `DATABASE_URL` and pushing the schema:
1. Go to Vercel Dashboard → Deployments
2. Click the three dots (⋯) on latest deployment
3. Click **Redeploy**
4. **Uncheck "Use existing Build Cache"**
5. Click **Redeploy**

The build will now:
- ✅ Run `prisma generate` automatically (via postinstall script)
- ✅ Use your `DATABASE_URL` environment variable
- ✅ Connect to your database

### 4. Verify It Works
- Try accessing login/register pages
- Check that database operations work
- Review deployment logs to ensure Prisma client was generated

## Quick Checklist
- [ ] `DATABASE_URL` added to Vercel Environment Variables
- [ ] Environment variable set for Production/Preview/Development
- [ ] Database schema pushed (`npx prisma db push`)
- [ ] Application redeployed (without build cache)
- [ ] Database connection verified

## Need Help?
- See `DATABASE_SETUP.md` for detailed database setup
- See `DEPLOYMENT_FIX.md` for full deployment troubleshooting
- Check Vercel build logs for any Prisma errors

