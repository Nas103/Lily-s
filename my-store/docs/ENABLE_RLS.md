# Enable Row Level Security (RLS) in Supabase

## ⚠️ Security Warning

Your tables are currently **public without RLS**, which means:
- Anyone with database access can read/write all data
- No data isolation between users
- Security risk in production

## What is RLS?

Row Level Security (RLS) is a PostgreSQL feature that:
- Controls access to individual rows in a table
- Uses policies to define who can read/write what data
- Provides fine-grained security control

## Quick Fix: Enable RLS

### Option 1: Using Supabase Dashboard (Easiest)

1. Go to **Supabase Dashboard** → Your Project
2. Click **"Table Editor"** in the sidebar
3. For each table (User, Category, Product, Order, OrderItem):
   - Click on the table name
   - Go to **"Settings"** tab
   - Toggle **"Enable Row Level Security"** to ON
   - Click **"Save"**

### Option 2: Using SQL Editor (Recommended for Multiple Tables)

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Run this SQL script:

```sql
-- Enable RLS on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;
```

## Create Security Policies

After enabling RLS, you need to create policies to allow access. Here are example policies:

### 1. User Table Policies

```sql
-- Users can read their own data
CREATE POLICY "Users can view own profile"
ON "User" FOR SELECT
USING (auth.uid()::text = id);

-- Users can update their own data
CREATE POLICY "Users can update own profile"
ON "User" FOR UPDATE
USING (auth.uid()::text = id);

-- Allow public registration (for signup)
CREATE POLICY "Allow public registration"
ON "User" FOR INSERT
WITH CHECK (true);
```

### 2. Product & Category Tables (Public Read)

```sql
-- Products are publicly readable
CREATE POLICY "Products are publicly readable"
ON "Product" FOR SELECT
USING (true);

-- Categories are publicly readable
CREATE POLICY "Categories are publicly readable"
ON "Category" FOR SELECT
USING (true);
```

### 3. Order Table Policies

```sql
-- Users can view their own orders
CREATE POLICY "Users can view own orders"
ON "Order" FOR SELECT
USING (auth.uid()::text = "userId");

-- Users can create their own orders
CREATE POLICY "Users can create own orders"
ON "Order" FOR INSERT
WITH CHECK (auth.uid()::text = "userId");
```

### 4. OrderItem Table Policies

```sql
-- Users can view items in their own orders
CREATE POLICY "Users can view own order items"
ON "OrderItem" FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM "Order"
    WHERE "Order".id = "OrderItem"."orderId"
    AND "Order"."userId" = auth.uid()::text
  )
);

-- Users can create items for their own orders
CREATE POLICY "Users can create own order items"
ON "OrderItem" FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "Order"
    WHERE "Order".id = "OrderItem"."orderId"
    AND "Order"."userId" = auth.uid()::text
  )
);
```

## Important: Service Role Key

**For your application to work**, you need to use the **Service Role Key** (not the anon key) in your connection string when using Prisma, because:

- RLS policies apply to requests using the anon key
- Service role key bypasses RLS (for server-side operations)
- Your Next.js app runs server-side, so it needs service role access

### Update Your Connection String

In Vercel Environment Variables, make sure you're using:
- **Service Role Key** for `DATABASE_URL` (for Prisma/server-side)
- **Anon Key** for client-side Supabase operations (if you add them later)

## Complete Setup Script

Run this in Supabase SQL Editor:

```sql
-- Enable RLS on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (optional, for clean setup)
DROP POLICY IF EXISTS "Users can view own profile" ON "User";
DROP POLICY IF EXISTS "Users can update own profile" ON "User";
DROP POLICY IF EXISTS "Allow public registration" ON "User";
DROP POLICY IF EXISTS "Products are publicly readable" ON "Product";
DROP POLICY IF EXISTS "Categories are publicly readable" ON "Category";
DROP POLICY IF EXISTS "Users can view own orders" ON "Order";
DROP POLICY IF EXISTS "Users can create own orders" ON "Order";
DROP POLICY IF EXISTS "Users can view own order items" ON "OrderItem";
DROP POLICY IF EXISTS "Users can create own order items" ON "OrderItem";

-- User policies
CREATE POLICY "Users can view own profile"
ON "User" FOR SELECT
USING (true); -- Allow all reads for now (adjust based on your auth setup)

CREATE POLICY "Users can update own profile"
ON "User" FOR UPDATE
USING (true); -- Allow all updates for now

CREATE POLICY "Allow public registration"
ON "User" FOR INSERT
WITH CHECK (true);

-- Product & Category policies (public read)
CREATE POLICY "Products are publicly readable"
ON "Product" FOR SELECT
USING (true);

CREATE POLICY "Categories are publicly readable"
ON "Category" FOR SELECT
USING (true);

-- Order policies
CREATE POLICY "Users can view own orders"
ON "Order" FOR SELECT
USING (true); -- Allow all for now (adjust based on your auth)

CREATE POLICY "Users can create own orders"
ON "Order" FOR INSERT
WITH CHECK (true);

-- OrderItem policies
CREATE POLICY "Users can view own order items"
ON "OrderItem" FOR SELECT
USING (true); -- Allow all for now

CREATE POLICY "Users can create own order items"
ON "OrderItem" FOR INSERT
WITH CHECK (true);
```

## Testing

After enabling RLS:

1. **Test your app** - Make sure login/register still works
2. **Check Supabase Dashboard** - Security warnings should be gone
3. **Verify data access** - Users should only see their own data (once you implement proper auth)

## Current Setup Note

Since you're using **Prisma with a direct connection** (not Supabase client), and you're using the **Service Role** connection string, RLS won't affect your current setup. However, enabling RLS is still important for:

- ✅ Security best practices
- ✅ Future-proofing your app
- ✅ If you add client-side Supabase operations
- ✅ Compliance and security audits

## Next Steps

1. ✅ Enable RLS on all tables
2. ✅ Create basic policies (use the script above)
3. ✅ Test your application
4. 🔄 Refine policies based on your authentication setup
5. 🔄 Add more restrictive policies as needed

## Need Help?

- See Supabase docs: https://supabase.com/docs/guides/auth/row-level-security
- Check your connection string uses Service Role key
- Test policies in Supabase SQL Editor before applying

