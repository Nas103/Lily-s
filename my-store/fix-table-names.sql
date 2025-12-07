-- ============================================
-- Fix Table Names - Run in Supabase SQL Editor
-- ============================================
-- This script ensures all tables have the correct case-sensitive names
-- that Prisma expects

-- First, let's see what tables actually exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- If you see tables with lowercase names (user, category, etc.),
-- run the ALTER TABLE commands below to rename them:

-- Rename user to User (if it exists as lowercase)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user') THEN
        ALTER TABLE "user" RENAME TO "User";
        RAISE NOTICE 'Renamed user to User';
    END IF;
END $$;

-- Rename category to Category (if it exists as lowercase)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'category') THEN
        ALTER TABLE "category" RENAME TO "Category";
        RAISE NOTICE 'Renamed category to Category';
    END IF;
END $$;

-- Rename product to Product (if it exists as lowercase)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'product') THEN
        ALTER TABLE "product" RENAME TO "Product";
        RAISE NOTICE 'Renamed product to Product';
    END IF;
END $$;

-- Rename order to Order (if it exists as lowercase)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'order') THEN
        ALTER TABLE "order" RENAME TO "Order";
        RAISE NOTICE 'Renamed order to Order';
    END IF;
END $$;

-- Rename orderitem to OrderItem (if it exists as lowercase)
DO $$ 
BEGIN
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

