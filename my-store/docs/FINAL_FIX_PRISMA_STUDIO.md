# Final Fix for Prisma Studio - Complete Solution

## The Problem

Prisma Studio says "table does not exist" even though you can see tables in Supabase. This happens because:

1. **Table name case mismatch** - PostgreSQL created tables as lowercase (`user`) but Prisma expects capitalized (`User`)
2. **Wrong database connection** - Prisma might be connecting to a different database than what you see in Supabase
3. **Schema mismatch** - Tables exist but Prisma Client is out of sync

## Complete Fix - Step by Step

### Step 1: Verify Table Names in Supabase

1. Go to **Supabase Dashboard** → Your Project
2. Click **SQL Editor** → **New Query**
3. Run this query to see actual table names:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

**Check the results:**
- If you see `User`, `Category`, `Product`, `Order`, `OrderItem` (capitalized) → Go to Step 2
- If you see `user`, `category`, `product`, `order`, `orderitem` (lowercase) → Go to Step 3

### Step 2: Fix Table Names (If Lowercase)

If tables are lowercase, run this SQL in Supabase SQL Editor:

**File:** `fix-table-names.sql`

Or run these commands individually:

```sql
-- Rename user to User
ALTER TABLE "user" RENAME TO "User";

-- Rename category to Category  
ALTER TABLE "category" RENAME TO "Category";

-- Rename product to Product
ALTER TABLE "product" RENAME TO "Product";

-- Rename order to Order
ALTER TABLE "order" RENAME TO "Order";

-- Rename orderitem to OrderItem
ALTER TABLE "orderitem" RENAME TO "OrderItem";
```

### Step 3: Verify DATABASE_URL

Check your `.env.local` file. The `DATABASE_URL` should match the database where you see the tables.

**Get the correct connection string:**
1. Supabase Dashboard → **Settings** → **Database**
2. **Connection Pooling** → Copy the "Session" mode string
3. Make sure it has:
   - `.pooler.supabase.com:6543` (not direct connection)
   - Your project's correct database

### Step 4: Clear Prisma Cache and Regenerate

```powershell
# Remove Prisma cache
Remove-Item -Recurse -Force node_modules/.prisma -ErrorAction SilentlyContinue

# Regenerate Prisma Client
npx prisma generate
```

### Step 5: Verify Tables Are Accessible

```powershell
npm run db:check-tables
```

This should show:
- ✅ User table exists
- ✅ All other tables exist

### Step 6: Start Prisma Studio

```powershell
.\fix-prisma-studio-final.ps1
```

Or:

```powershell
npm run db:studio
```

## Alternative: Recreate Tables with Correct Names

If the above doesn't work, recreate the tables using the SQL script:

1. **Backup your data** (if any exists)
2. **Drop existing tables** in Supabase SQL Editor:
   ```sql
   DROP TABLE IF EXISTS "user" CASCADE;
   DROP TABLE IF EXISTS "category" CASCADE;
   DROP TABLE IF EXISTS "product" CASCADE;
   DROP TABLE IF EXISTS "order" CASCADE;
   DROP TABLE IF EXISTS "orderitem" CASCADE;
   ```
3. **Run the create-tables.sql script** (from earlier)
   - This creates tables with correct capitalized names

## Quick Diagnostic Commands

**Check what Prisma sees:**
```powershell
node scripts/check-actual-tables.js
```

**Verify database connection:**
```powershell
npm run db:check-tables
```

**Check DATABASE_URL:**
```powershell
Get-Content .env.local | Select-String "DATABASE_URL"
```

## Most Likely Solution

Based on the error, the tables probably exist as **lowercase** (`user`) but Prisma expects **capitalized** (`User`).

**Quick fix:**
1. Open Supabase SQL Editor
2. Run: `ALTER TABLE "user" RENAME TO "User";`
3. Repeat for other tables if needed
4. Run: `npx prisma generate`
5. Run: `npm run db:studio`

## After Fixing

Once Prisma Studio works:
- ✅ You can view all tables
- ✅ You can edit data
- ✅ Your app will work correctly
- ✅ All API routes will function

