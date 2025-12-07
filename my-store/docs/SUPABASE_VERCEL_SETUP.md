# Supabase + Vercel Integration - Next Steps

## ✅ What Just Happened

When you connected your Supabase project to Vercel, Vercel automatically created environment variables for you. These should include:

- `POSTGRES_URL` or `DATABASE_URL` - Your database connection string
- `POSTGRES_URL_NON_POOLING` - Direct connection (for migrations)
- `POSTGRES_USER` - Database username
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Public anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (server-side only)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public key for client-side
- `SUPABASE_JWT_SECRET` - JWT secret
- And more...

## 🔍 Step 1: Verify Environment Variables

### Option A: Check in Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Verify you see variables starting with `POSTGRES_` or `SUPABASE_`

### Option B: Pull Locally
```bash
# Pull environment variables to .env.local
vercel env pull .env.local

# Check what was created
cat .env.local | grep -E "POSTGRES|SUPABASE|DATABASE"
```

## 🗄️ Step 2: Update Your Code to Use the Right Variable

Vercel might have created `POSTGRES_URL` instead of `DATABASE_URL`. Check which one exists:

```bash
# Check which variable exists
vercel env ls
```

**If you see `POSTGRES_URL` instead of `DATABASE_URL`:**

You have two options:

### Option 1: Use POSTGRES_URL (Recommended)
Update your Prisma schema to use `POSTGRES_URL`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_URL")  // Changed from DATABASE_URL
}
```

### Option 2: Create DATABASE_URL Alias
In Vercel Dashboard:
1. Go to **Settings** → **Environment Variables**
2. Add a new variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Same as `POSTGRES_URL` (copy the value)
   - **Environments**: All (Production, Preview, Development)

## 📊 Step 3: Push Database Schema

Now create the database tables:

```bash
# Pull environment variables (if you haven't already)
vercel env pull .env.local

# Push the schema to create tables
npx prisma db push

# Verify tables were created
npx prisma studio
```

This will create:
- `User` table
- `Category` table
- `Product` table
- `Order` table
- `OrderItem` table

## 🚀 Step 4: Redeploy Your Application

After pushing the schema:

1. Go to Vercel Dashboard → **Deployments**
2. Click the three dots (⋯) on the latest deployment
3. Click **Redeploy**
4. **Uncheck "Use existing Build Cache"**
5. Click **Redeploy**

## ✅ Step 5: Verify Everything Works

1. **Check Build Logs**: Make sure Prisma client was generated
2. **Test Database Connection**: Try accessing login/register pages
3. **Verify Tables**: Check Supabase Dashboard → Table Editor

## 🔧 Troubleshooting

### "Database is not configured" Error

**Check 1: Variable Name**
- Make sure your Prisma schema uses the correct variable name
- If Vercel created `POSTGRES_URL`, update schema or create `DATABASE_URL` alias

**Check 2: Environment Scope**
- Verify variables are set for Production, Preview, and Development
- Go to Vercel → Settings → Environment Variables
- Check each variable's environment scope

**Check 3: Schema Not Pushed**
- Run `npx prisma db push` to create tables
- Verify in Supabase Dashboard → Table Editor

### Connection Errors

**If you see connection errors:**
1. Check Supabase Dashboard → Settings → Database
2. Make sure database is not paused
3. Use Connection Pooling string for production (Vercel should have done this automatically)
4. Verify the connection string format is correct

## 📝 Quick Checklist

- [ ] Verified environment variables exist in Vercel
- [ ] Updated Prisma schema to use correct variable name (if needed)
- [ ] Pulled environment variables locally: `vercel env pull .env.local`
- [ ] Pushed database schema: `npx prisma db push`
- [ ] Verified tables exist in Supabase Dashboard
- [ ] Redeployed application (without build cache)
- [ ] Tested database connection (login/register)

## 🎉 You're Done!

Your database should now be fully configured and working. The application will automatically use the environment variables from Vercel in all deployments.

