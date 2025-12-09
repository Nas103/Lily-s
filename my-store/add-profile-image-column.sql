-- Add profileImageUrl column to User table
-- Run this in Supabase SQL Editor if prisma db push fails

-- Check if column already exists, if not, add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'User' 
        AND column_name = 'profileImageUrl'
    ) THEN
        ALTER TABLE "User" 
        ADD COLUMN "profileImageUrl" TEXT;
        
        RAISE NOTICE 'Column profileImageUrl added successfully';
    ELSE
        RAISE NOTICE 'Column profileImageUrl already exists';
    END IF;
END $$;

