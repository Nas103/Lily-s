# Fix "Unknown argument `profileImageUrl`" Error

## The Problem

You're seeing this error when trying to update your profile:
```
Unknown argument `profileImageUrl`. Available options are marked with ?.
```

This means the `profileImageUrl` field exists in your Prisma schema but hasn't been added to the database yet.

## Solution

### Option 1: Fix Database Connection First (Recommended)

1. **Fix the database connection**:
   ```powershell
   .\fix-database-connection.ps1
   ```

2. **Once connection is fixed, push the schema**:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

3. **Restart your dev server**

### Option 2: Add Column Manually in Supabase

If you can't fix the connection right now, you can add the column manually:

1. **Go to Supabase Dashboard**:
   - https://supabase.com/dashboard
   - Select your project
   - Go to **SQL Editor**

2. **Run this SQL**:
   ```sql
   ALTER TABLE "User" 
   ADD COLUMN IF NOT EXISTS "profileImageUrl" TEXT;
   ```

   Or use the provided SQL file:
   - Copy the contents of `add-profile-image-column.sql`
   - Paste into Supabase SQL Editor
   - Click "Run"

3. **Regenerate Prisma Client**:
   ```bash
   npx prisma generate
   ```

4. **Restart your dev server**

### Option 3: Use Supabase Table Editor

1. **Go to Supabase Dashboard** → **Table Editor**
2. **Select the `User` table**
3. **Click "Add Column"**
4. **Fill in**:
   - **Name**: `profileImageUrl`
   - **Type**: `text`
   - **Nullable**: ✅ Yes
5. **Click "Save"**
6. **Regenerate Prisma Client**:
   ```bash
   npx prisma generate
   ```
7. **Restart your dev server**

## Verify It's Fixed

After adding the column:

1. **Restart your dev server** (stop with Ctrl+C, then `npm run dev`)
2. **Try updating your profile again** with a profile image URL
3. **The error should be gone**

## Why This Happened

The `profileImageUrl` field was added to the Prisma schema file, but:
- The database connection was failing, so `prisma db push` couldn't run
- The Prisma client was generated before the field was added to the database
- The database table doesn't have the column yet

## Next Steps

Once the column is added:
- ✅ You can save profile image URLs
- ✅ Profile images will display in the UI
- ✅ All profile data will persist correctly

