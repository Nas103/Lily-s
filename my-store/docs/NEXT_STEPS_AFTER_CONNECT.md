# Next Steps After Connecting Supabase to Vercel

## ✅ You've Connected the Project!

Now follow these steps to complete the setup:

## Step 1: Check What Vercel Created

Go to your Vercel Dashboard:
1. **Settings** → **Environment Variables**
2. Look for one of these:
   - `POSTGRES_URL` (most likely)
   - `DATABASE_URL` (if you set a custom prefix)

## Step 2: Make Sure DATABASE_URL Exists

Your Prisma schema uses `DATABASE_URL`, so you need this variable.

### Option A: Vercel Created POSTGRES_URL (Most Common)

**Create a DATABASE_URL alias:**

1. In Vercel Dashboard → **Settings** → **Environment Variables**
2. Click **Add New**
3. Set:
   - **Key**: `DATABASE_URL`
   - **Value**: Copy the value from `POSTGRES_URL`
   - **Environments**: Select all (Production, Preview, Development)
4. Click **Save**

### Option B: Vercel Created DATABASE_URL Already

✅ You're good! Skip to Step 3.

## Step 3: Pull Environment Variables Locally

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Login (if not already)
vercel login

# Link your project (if not already linked)
vercel link

# Pull all environment variables
vercel env pull .env.local
```

## Step 4: Push Database Schema

Create the database tables:

```bash
# Make sure you're in the my-store directory
cd my-store

# Push the schema to create tables
npx prisma db push

# This will create:
# - User table
# - Category table  
# - Product table
# - Order table
# - OrderItem table
```

## Step 5: Verify Tables Were Created

**Option 1: Using Prisma Studio**
```bash
npx prisma studio
```
This opens a browser interface to view your database.

**Option 2: Check Supabase Dashboard**
1. Go to your Supabase project
2. Click **Table Editor** in the sidebar
3. You should see all 5 tables

## Step 6: Redeploy Your Application

1. Go to Vercel Dashboard → **Deployments**
2. Click the three dots (⋯) on the latest deployment
3. Click **Redeploy**
4. **IMPORTANT**: Uncheck "Use existing Build Cache"
5. Click **Redeploy**

## Step 7: Test Everything

1. **Check Build Logs**: Make sure you see "Prisma Client generated"
2. **Test Database**: Try accessing login/register pages on your deployed site
3. **Verify Connection**: The "Database is not configured" error should be gone

## 🎉 Done!

Your database is now fully configured and working!

## Quick Troubleshooting

### Still seeing "Database is not configured"?

1. **Check variable name**: Make sure `DATABASE_URL` exists in Vercel (not just `POSTGRES_URL`)
2. **Check environment scope**: Variables must be set for Production, Preview, and Development
3. **Redeploy**: Make sure you redeployed after adding variables
4. **Check build logs**: Look for Prisma errors in Vercel deployment logs

### Connection errors?

1. Check Supabase Dashboard → Database is not paused
2. Verify connection string format is correct
3. Make sure you used the Connection Pooling string (Vercel should have done this)

## Need Help?

- See `SUPABASE_VERCEL_SETUP.md` for detailed setup
- See `DEPLOYMENT_FIX.md` for troubleshooting
- Check Vercel build logs for specific errors

