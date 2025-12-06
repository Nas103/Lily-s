-- Enable Row Level Security (RLS) on all tables
-- Run this in Supabase SQL Editor

-- Enable RLS
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;

-- Basic policies for your current setup
-- Note: These are permissive policies. Adjust based on your authentication needs.

-- User policies
CREATE POLICY "Allow all user reads" ON "User" FOR SELECT USING (true);
CREATE POLICY "Allow all user updates" ON "User" FOR UPDATE USING (true);
CREATE POLICY "Allow public registration" ON "User" FOR INSERT WITH CHECK (true);

-- Product & Category (public read)
CREATE POLICY "Allow all product reads" ON "Product" FOR SELECT USING (true);
CREATE POLICY "Allow all category reads" ON "Category" FOR SELECT USING (true);

-- Order policies
CREATE POLICY "Allow all order reads" ON "Order" FOR SELECT USING (true);
CREATE POLICY "Allow all order inserts" ON "Order" FOR INSERT WITH CHECK (true);

-- OrderItem policies
CREATE POLICY "Allow all order item reads" ON "OrderItem" FOR SELECT USING (true);
CREATE POLICY "Allow all order item inserts" ON "OrderItem" FOR INSERT WITH CHECK (true);

-- Note: These policies are permissive for now.
-- Once you implement proper authentication with Supabase Auth,
-- you should update these to use auth.uid() for user-specific access.

