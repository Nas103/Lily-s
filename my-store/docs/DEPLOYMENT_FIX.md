# Deployment Fix - Old Version Showing

## If using Vercel:

### Option 1: Via Dashboard
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to "Deployments" tab
4. Click the three dots (⋯) on the latest deployment
5. Click "Redeploy"
6. **Uncheck "Use existing Build Cache"**
7. Click "Redeploy"

### Option 2: Via Vercel CLI
```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Login to Vercel
vercel login

# Force redeploy without cache
vercel --prod --force
```

### Option 3: Trigger via Git
```bash
# Make a small change to trigger new deployment
git commit --allow-empty -m "Trigger redeploy"
git push
```

## Clear Browser Cache
- Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Or clear browser cache completely

## Check Deployment Status
1. Go to Vercel dashboard
2. Check the latest deployment commit hash matches: `6836ecd`
3. Check build logs for any errors

## Environment Variables
Make sure all environment variables are set in Vercel:
- Go to Project Settings → Environment Variables
- Verify all required vars are present (DATABASE_URL, OPENAI_API_KEY, etc.)

## Database Configuration (IMPORTANT)

If you're seeing "Database is not configured" error, follow these steps:

> **Quick Setup Script**: Run `.\setup-database.ps1` in PowerShell for automated setup, or `.\verify-database.ps1` to check your current configuration.
> 
> **Just Connected Supabase?** See `NEXT_STEPS_AFTER_CONNECT.md` for immediate next steps.

### Step 1: Set DATABASE_URL in Vercel
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add `DATABASE_URL` with your PostgreSQL connection string:
   ```
   postgresql://user:password@host:5432/dbname
   ```
   - Get a free database from:
     - [Supabase](https://supabase.com) - Free tier with 500MB
     - [Neon](https://neon.tech) - Serverless Postgres, free tier
     - [Railway](https://railway.app) - Free tier available
4. Make sure to set it for **Production**, **Preview**, and **Development** environments
5. Click **Save**

### Step 2: Push Database Schema
After setting `DATABASE_URL`, you need to create the database tables. You have two options:

**Option A: Using Vercel CLI (Recommended)**
```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Login to Vercel
vercel login

# Link your project (if not already linked)
vercel link

# Pull environment variables to your local .env
vercel env pull .env.local

# Push database schema
npx prisma db push

# Or use migrations (if you have them)
npx prisma migrate deploy
```

**Option B: Using Prisma Studio (Alternative)**
1. Pull environment variables: `vercel env pull .env.local`
2. Run: `npx prisma studio`
3. This will open Prisma Studio in your browser where you can manage your database

### Step 3: Verify Database Connection
1. After setting `DATABASE_URL` and pushing the schema, redeploy your application
2. The build process will automatically run `prisma generate` (configured in package.json)
3. Check your deployment logs to ensure Prisma client was generated successfully

### Step 4: Test Database Connection
Try accessing a database-dependent feature (like login/register) to verify the connection works.

### Troubleshooting Database Issues

**"Database is not configured" error:**
- ✅ Verify `DATABASE_URL` is set in Vercel Environment Variables
- ✅ Make sure it's set for the correct environment (Production/Preview/Development)
- ✅ Check that the connection string format is correct
- ✅ Ensure you've run `npx prisma db push` to create the tables
- ✅ Redeploy after adding/changing `DATABASE_URL`

**Connection errors:**
- Check your database provider allows connections from Vercel's IP addresses
- For Supabase: Go to Settings → Database → Connection Pooling and use the pooled connection string
- For Neon: Make sure your database is not paused
- Verify the password in `DATABASE_URL` is URL-encoded (special characters like `|`, `}`, `$` need encoding)

**Prisma Client not found:**
- The `postinstall` script in package.json should automatically run `prisma generate`
- If it doesn't, check build logs and ensure `prisma` is in `devDependencies`
- Manually trigger: Add `prisma generate` to your build command (already done in package.json)

