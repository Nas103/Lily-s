# Create Database Tables in Supabase

## Good News! ✅

Your tables **already exist** in Supabase! The verification showed all 5 tables are present:
- ✅ User
- ✅ Category  
- ✅ Product
- ✅ Order
- ✅ OrderItem

## The Error Explained

The "prepared statement already exists" error is a known issue with:
- Connection Pooling + Prisma
- Multiple simultaneous connections
- Prisma's prepared statement caching

**This doesn't mean your tables are missing** - they're already there!

## Verify Tables in Supabase

1. **Go to Supabase Dashboard** → Your Project
2. Click **"Table Editor"** in the sidebar
3. You should see all 5 tables listed

## If Tables Are Missing (Unlikely)

If for some reason tables don't exist, use the **non-pooling connection** for migrations:

### Option 1: Use POSTGRES_URL_NON_POOLING

1. **Get the non-pooling connection string**:
   - Supabase Dashboard → Settings → Database
   - Copy the **"Connection string"** (direct connection, port 5432)
   - Or use `POSTGRES_URL_NON_POOLING` from Vercel

2. **Temporarily update .env.local**:
   ```bash
   DATABASE_URL="postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres"
   ```

3. **Push schema**:
   ```bash
   npx prisma db push
   ```

4. **Switch back to Connection Pooling**:
   - Update `.env.local` with the pooling string again
   - This is only for migrations; use pooling for runtime

### Option 2: Use Supabase SQL Editor

1. **Go to Supabase Dashboard** → **SQL Editor**
2. **Run this SQL** to create tables:

```sql
-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT,
  "passwordHash" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'USER',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- Create Category table
CREATE TABLE IF NOT EXISTS "Category" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Category_slug_key" ON "Category"("slug");

-- Create Product table
CREATE TABLE IF NOT EXISTS "Product" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "price" DECIMAL(10,2) NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "categoryId" TEXT NOT NULL,
  CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Product_slug_key" ON "Product"("slug");

-- Create Order table
CREATE TABLE IF NOT EXISTS "Order" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "total" DECIMAL(10,2) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- Create OrderItem table
CREATE TABLE IF NOT EXISTS "OrderItem" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "price" DECIMAL(10,2) NOT NULL,
  CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- Add foreign keys
ALTER TABLE "Product" ADD CONSTRAINT IF NOT EXISTS "Product_categoryId_fkey" 
  FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Order" ADD CONSTRAINT IF NOT EXISTS "Order_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "OrderItem" ADD CONSTRAINT IF NOT EXISTS "OrderItem_orderId_fkey" 
  FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "OrderItem" ADD CONSTRAINT IF NOT EXISTS "OrderItem_productId_fkey" 
  FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
```

## For Vercel Deployment

Since your tables already exist, the issue on Vercel is likely:

1. **DATABASE_URL not set** - ✅ You just added this!
2. **Need to redeploy** - After adding DATABASE_URL

### Steps to Fix Vercel:

1. ✅ **DATABASE_URL is now added** (you just did this!)
2. **Redeploy**:
   - Vercel Dashboard → Deployments
   - Click three dots (⋯) → Redeploy
   - **Uncheck "Use existing Build Cache"**
   - Click Redeploy
3. **Test login** - Should work now!

## Verify Everything Works

### Check Tables Exist:
```bash
# Open Prisma Studio
npx prisma studio
```

This will show all your tables and data.

### Test Connection:
```bash
node scripts/verify-db.js
```

Should show all tables exist.

## Summary

- ✅ **Tables already exist** in Supabase
- ✅ **DATABASE_URL is set** in Vercel
- 🔄 **Redeploy** to apply changes
- ✅ **Login should work** after redeploy

The "prepared statement" error is a Connection Pooling quirk and doesn't affect your deployed app!

