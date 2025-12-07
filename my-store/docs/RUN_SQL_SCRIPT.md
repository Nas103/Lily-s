# How to Run the SQL Script in Supabase

## Step-by-Step Instructions

### Step 1: Open Supabase SQL Editor

1. Go to **https://supabase.com/dashboard**
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query** button (top right)

### Step 2: Copy the SQL Script

1. Open the file `create-tables.sql` in your project
2. Select **ALL** the content (Ctrl+A)
3. Copy it (Ctrl+C)

### Step 3: Paste and Run

1. Paste the SQL script into the Supabase SQL Editor
2. Click **Run** button (or press `Ctrl+Enter`)
3. Wait for it to complete (should take a few seconds)

### Step 4: Verify Tables Were Created

After running the script, you should see a result table showing:
- `User` (with column count)
- `Category` (with column count)
- `Product` (with column count)
- `Order` (with column count)
- `OrderItem` (with column count)

**Or check manually:**
1. Click **Table Editor** in the left sidebar
2. You should see all 5 tables listed

### Step 5: Regenerate Prisma Client

After tables are created, run:

```powershell
npx prisma generate
```

This updates the Prisma Client to match your database structure.

### Step 6: Test Prisma Studio

```powershell
npm run db:studio
```

Prisma Studio should now work without errors! ✅

## What the Script Creates

### Tables Created:
1. **User** - User accounts with profile information
2. **Category** - Product categories
3. **Product** - Products in your store
4. **Order** - Customer orders
5. **OrderItem** - Items in each order

### Features:
- ✅ All columns with correct data types
- ✅ Primary keys on all tables
- ✅ Unique constraints (email, slugs)
- ✅ Foreign key relationships
- ✅ Auto-updating timestamps (`updatedAt`)
- ✅ Default values for new fields
- ✅ Safe to run multiple times (uses `IF NOT EXISTS`)

## Troubleshooting

### Error: "type UserRole already exists"
- **Safe to ignore** - The script handles this with `DO $$ BEGIN ... EXCEPTION`

### Error: "relation already exists"
- **Safe to ignore** - The script uses `IF NOT EXISTS` to prevent this

### Error: "constraint already exists"
- **Safe to ignore** - The script handles this with `DO $$ BEGIN ... EXCEPTION`

### Tables Still Don't Appear
1. Refresh the Supabase dashboard
2. Check if you're in the correct project
3. Verify the script ran without errors (check the output panel)

## After Running the Script

Once the script completes successfully:

1. ✅ **Tables exist** - You can see them in Table Editor
2. ✅ **Prisma Studio works** - No more "table does not exist" errors
3. ✅ **App works** - Login/register will work
4. ✅ **You can add data** - Through Prisma Studio or your app

## Next Steps

1. Run `npx prisma generate` to update Prisma Client
2. Test Prisma Studio: `npm run db:studio`
3. Start your app: `npm run dev`
4. Try registering a new user to test the database connection

