# Fix: "The table `public.User` does not exist"

## The Problem

You're getting this error because the database tables haven't been created yet. The `npx prisma db push` command is failing with "prepared statement already exists" error.

## Solution: Use Direct Connection for Schema Push

The "prepared statement" error happens with Connection Pooling (PgBouncer). For creating tables, we can temporarily use the **direct connection** instead of the pooler.

### Step 1: Get Direct Connection String

1. Go to **Supabase Dashboard** → Your Project
2. Click **Settings** → **Database**
3. Scroll to **Connection string** (NOT Connection Pooling)
4. Select **URI** tab
5. Copy the connection string (should have port **5432**, NOT 6543)

It should look like:
```
postgresql://postgres.xxx:password@db.xxx.supabase.co:5432/postgres
```

### Step 2: Temporarily Update DATABASE_URL

**Option A: Create a temporary .env file**
```powershell
# Copy your current DATABASE_URL
$poolerUrl = (Get-Content .env.local | Select-String "DATABASE_URL").ToString().Split("=")[1].Trim('"')

# Get direct connection (replace pooler with direct)
$directUrl = $poolerUrl -replace "pooler\.supabase\.com:6543", "supabase.co:5432" -replace "&pgbouncer=true", "" -replace "&connect_timeout=\d+", ""

# Add to .env (temporary)
Add-Content .env "DATABASE_URL=$directUrl"
```

**Option B: Manually edit .env.local**
1. Open `.env.local`
2. Find `DATABASE_URL`
3. Temporarily change it to the direct connection (port 5432)
4. Remove `&pgbouncer=true&connect_timeout=15` from the URL

### Step 3: Push Schema with Direct Connection

```powershell
npx prisma db push
```

This should work without the "prepared statement" error.

### Step 4: Switch Back to Connection Pooling

After tables are created:

1. **Restore your original DATABASE_URL** in `.env.local` (with pooler, port 6543)
2. **Regenerate Prisma Client:**
   ```powershell
   npx prisma generate
   ```

### Step 5: Verify Tables

**Check Supabase Dashboard:**
1. Go to **Table Editor**
2. You should see: `User`, `Category`, `Product`, `Order`, `OrderItem`

**Or use Prisma Studio:**
```powershell
npm run db:studio
```

## Alternative: Create Tables via Supabase SQL Editor

If Prisma still fails, you can create tables manually using SQL:

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Click **New Query**
3. Paste this SQL:

```sql
-- Create UserRole enum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- Create User table
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "phone" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "country" TEXT,
    "city" TEXT,
    "postcode" TEXT,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "profileVisibility" TEXT DEFAULT 'PRIVATE',
    "locationSharing" BOOLEAN NOT NULL DEFAULT false,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "smsNotifications" BOOLEAN NOT NULL DEFAULT false,
    "marketingEmails" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Create unique index on email
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Create Category table
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- Create Product table
CREATE TABLE "Product" (
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

CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- Create Order table
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- Create OrderItem table
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- Add foreign keys
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
```

4. Click **Run** (or press Ctrl+Enter)
5. Tables should be created!

## After Tables Are Created

1. **Regenerate Prisma Client:**
   ```powershell
   npx prisma generate
   ```

2. **Test Prisma Studio:**
   ```powershell
   npm run db:studio
   ```

3. **Verify in Supabase:**
   - Go to **Table Editor**
   - You should see all 5 tables

## Summary

- ❌ **Don't** manually create tables in Supabase Table Editor (use SQL if needed)
- ✅ **Do** use `npx prisma db push` with direct connection (port 5432)
- ✅ **Or** create tables via SQL Editor if Prisma fails
- ✅ **Then** switch back to Connection Pooling (port 6543) for your app

