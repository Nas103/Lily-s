# Quick Fix: Table Name Case Mismatch

## The Problem

Prisma expects tables with **capitalized** names:
- `User` (not `user`)
- `Category` (not `category`)
- `Product` (not `product`)
- `Order` (not `order`)
- `OrderItem` (not `orderitem`)

But PostgreSQL might have created them as **lowercase**.

## The Fix - Run This SQL in Supabase

1. Go to **Supabase Dashboard** → Your Project
2. Click **SQL Editor** → **New Query**
3. **Copy and paste this entire script:**

```sql
-- Check current table names
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Rename tables to match Prisma expectations
DO $$ 
BEGIN
    -- Rename user to User
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user') THEN
        ALTER TABLE "user" RENAME TO "User";
        RAISE NOTICE 'Renamed user to User';
    END IF;
    
    -- Rename category to Category
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'category') THEN
        ALTER TABLE "category" RENAME TO "Category";
        RAISE NOTICE 'Renamed category to Category';
    END IF;
    
    -- Rename product to Product
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'product') THEN
        ALTER TABLE "product" RENAME TO "Product";
        RAISE NOTICE 'Renamed product to Product';
    END IF;
    
    -- Rename order to Order
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'order') THEN
        ALTER TABLE "order" RENAME TO "Order";
        RAISE NOTICE 'Renamed order to Order';
    END IF;
    
    -- Rename orderitem to OrderItem
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'orderitem') THEN
        ALTER TABLE "orderitem" RENAME TO "OrderItem";
        RAISE NOTICE 'Renamed orderitem to OrderItem';
    END IF;
END $$;

-- Verify the final table names
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

4. Click **Run** (or press Ctrl+Enter)
5. You should see messages like "Renamed user to User" etc.

## After Running the SQL

1. **Regenerate Prisma Client:**
   ```powershell
   npx prisma generate
   ```

2. **Test Prisma Studio:**
   ```powershell
   npm run db:studio
   ```

Prisma Studio should now work! ✅

## If Tables Are Already Capitalized

If the first SELECT query shows `User`, `Category`, etc. (already capitalized), then the issue is something else. Check:
- DATABASE_URL is correct
- You're connected to the right database
- Prisma Client is up to date

