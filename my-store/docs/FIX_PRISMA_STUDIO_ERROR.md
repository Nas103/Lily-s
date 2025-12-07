# Fix Prisma Studio "Unable to run script" Error

## The Problem

You're seeing this error because:

1. **Schema was updated** - We added new fields to the `User` model (phone, address, preferences, etc.)
2. **Database not updated** - The database tables don't have these new columns yet
3. **Prisma Client mismatch** - The generated Prisma Client expects the new schema, but the database structure is old

## The Solution

You need to push the updated schema to your database. Follow these steps:

### Step 1: Close Prisma Studio

If Prisma Studio is open, close it (Ctrl+C in the terminal where it's running).

### Step 2: Push Schema to Database

```powershell
npx prisma db push
```

This will:
- ✅ Add the new columns to your `User` table
- ✅ Preserve all existing user data
- ✅ Set default values for new fields

### Step 3: Regenerate Prisma Client

```powershell
npx prisma generate
```

This updates the Prisma Client to match the new schema.

### Step 4: Restart Prisma Studio

Use one of these methods:

**Option A: PowerShell Script (Recommended)**
```powershell
.\fix-prisma-studio.ps1
```

**Option B: npm Script**
```powershell
npm run db:studio
```

Both methods load `.env.local` before starting Prisma Studio.

## What Changed in the Schema

The `User` model now includes:

**New Personal Info Fields:**
- `phone` (String?)
- `dateOfBirth` (DateTime?)

**New Address Fields:**
- `country` (String?)
- `city` (String?)
- `postcode` (String?)
- `addressLine1` (String?)
- `addressLine2` (String?)

**New Preference Fields:**
- `profileVisibility` (String?)
- `locationSharing` (Boolean)
- `emailNotifications` (Boolean)
- `smsNotifications` (Boolean)
- `marketingEmails` (Boolean)

**New Timestamp:**
- `updatedAt` (DateTime) - Auto-updated on changes

## After Fixing

Once you've run `npx prisma db push`, Prisma Studio should work correctly and you'll be able to:
- ✅ View all users
- ✅ See the new fields (they'll be empty/null for existing users)
- ✅ Edit user records
- ✅ Add new users with the new fields

## Troubleshooting

### Error: "Can't reach database server"

1. Check your `.env.local` file has `DATABASE_URL`
2. Verify the connection string is correct
3. Make sure you're using the Connection Pooling string (port 6543, `.pooler` in hostname)

### Error: "prepared statement already exists"

This is a known Prisma + PgBouncer quirk. The schema push should still work. If it fails:
1. Wait a few seconds
2. Try again: `npx prisma db push`
3. The error is harmless - your schema was likely updated successfully

### Error: "Environment variable not found: DATABASE_URL"

Make sure you're running Prisma Studio with one of these methods:
- `.\fix-prisma-studio.ps1` (loads `.env.local`)
- `npm run db:studio` (uses dotenv-cli)

Don't run `npx prisma studio` directly - it won't load `.env.local`.

