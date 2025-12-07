# Add DATABASE_URL to Vercel

## Connection String to Add

```
postgres://postgres.cerclrsxxsrladrhwbme:9E4mPFzcWsZWRRKt@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x
```

## Steps to Add in Vercel

1. **Go to Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. **Click "Create new"** button

3. **Fill in the form**:
   - **Key**: `DATABASE_URL`
   - **Value**: 
     ```
     postgres://postgres.cerclrsxxsrladrhwbme:9E4mPFzcWsZWRRKt@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x
     ```
   - **Environments**: Select **All Environments** (Production, Preview, Development)
   - **Sensitive**: ✅ Enable this (recommended for security)

4. **Click "Save"**

5. **Redeploy**:
   - Go to **Deployments**
   - Click three dots (⋯) on latest deployment
   - Click **Redeploy**
   - **Uncheck "Use existing Build Cache"**
   - Click **Redeploy**

## Verify

After redeploying:
- ✅ Check build logs - should see Prisma client generated
- ✅ Test login - should work now!
- ✅ No more "Database is not configured" error

## Note

The connection string uses `postgres://` which works fine with Prisma. If you prefer `postgresql://`, you can change it, but both work identically.

