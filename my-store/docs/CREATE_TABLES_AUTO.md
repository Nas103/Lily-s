# Creating Database Tables - Automatic Method

## ❌ You DON'T Need to Create Tables Manually!

Prisma will automatically create all tables for you when you run `npx prisma db push`. You don't need to:
- ❌ Go to Supabase dashboard
- ❌ Manually create tables
- ❌ Write SQL scripts
- ❌ Use Supabase Table Editor

## ✅ What Prisma Does Automatically

When you run `npx prisma db push`, Prisma will:

1. **Read your schema** (`prisma/schema.prisma`)
2. **Connect to your database** (using `DATABASE_URL`)
3. **Create all tables** that don't exist:
   - `User` table
   - `Category` table
   - `Product` table
   - `Order` table
   - `OrderItem` table
4. **Add all columns** with correct types
5. **Set up relationships** between tables
6. **Create indexes** for performance

## 🚀 How to Create Tables

### Step 1: Make Sure DATABASE_URL is Set

Check your `.env.local` file has:
```
DATABASE_URL="postgresql://postgres.xxx:password@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"
```

### Step 2: Push Schema to Database

Run this command:
```powershell
npx prisma db push
```

This will:
- ✅ Connect to your Supabase database
- ✅ Create all 5 tables automatically
- ✅ Show you what changes will be made
- ✅ Ask for confirmation (type `y` and press Enter)

### Step 3: Verify Tables Were Created

**Option A: Check Supabase Dashboard**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **Table Editor** in the sidebar
4. You should see: `User`, `Category`, `Product`, `Order`, `OrderItem`

**Option B: Use Prisma Studio**
```powershell
npm run db:studio
```
This opens a browser interface where you can see all tables.

## 📋 What Tables Will Be Created

Based on your `schema.prisma`, these tables will be created:

### 1. User Table
- `id` (UUID, primary key)
- `email` (unique)
- `name`
- `passwordHash`
- `role` (USER or ADMIN)
- `phone`
- `dateOfBirth`
- `country`, `city`, `postcode`
- `addressLine1`, `addressLine2`
- `profileVisibility`, `locationSharing`
- `emailNotifications`, `smsNotifications`, `marketingEmails`
- `createdAt`, `updatedAt`

### 2. Category Table
- `id` (UUID)
- `name`
- `slug` (unique)
- `createdAt`

### 3. Product Table
- `id` (UUID)
- `name`
- `slug` (unique)
- `description`
- `price` (Decimal)
- `imageUrl`
- `categoryId` (foreign key to Category)
- `createdAt`, `updatedAt`

### 4. Order Table
- `id` (UUID)
- `userId` (foreign key to User)
- `total` (Decimal)
- `createdAt`

### 5. OrderItem Table
- `id` (UUID)
- `orderId` (foreign key to Order)
- `productId` (foreign key to Product)
- `quantity`
- `price` (Decimal)

## 🔧 Troubleshooting

### Error: "Can't reach database server"

**Problem:** Connection string is wrong or database is unreachable.

**Solution:**
1. Check your `DATABASE_URL` in `.env.local`
2. Make sure you're using the **Connection Pooling** string (port 6543, `.pooler` in hostname)
3. Get the correct string from Supabase Dashboard → Settings → Database → Connection Pooling

### Error: "prepared statement already exists"

**Problem:** Known Prisma + PgBouncer quirk.

**Solution:**
- This error is usually harmless
- Wait a few seconds and try again
- The tables were likely created successfully
- Check Supabase dashboard to confirm

### Error: "The table `public.User` does not exist"

**Problem:** Tables haven't been created yet.

**Solution:**
- Run `npx prisma db push` to create them
- Make sure `DATABASE_URL` is correct
- Check that you're connected to the right database

### Error: "Environment variable not found: DATABASE_URL"

**Problem:** `.env.local` is missing or not being read.

**Solution:**
1. Make sure `.env.local` exists in the `my-store` folder
2. Make sure it contains `DATABASE_URL=...`
3. If using Prisma Studio, use `npm run db:studio` (not `npx prisma studio`)

## ✅ After Tables Are Created

Once `npx prisma db push` completes successfully:

1. **Tables exist** - You can see them in Supabase Table Editor
2. **Prisma Studio works** - No more "table does not exist" errors
3. **App works** - Login/register will work
4. **You can add data** - Through Prisma Studio or your app

## 📝 Summary

- ❌ **Don't** create tables manually in Supabase
- ✅ **Do** run `npx prisma db push` to create them automatically
- ✅ Prisma handles everything based on your `schema.prisma` file
- ✅ All relationships, indexes, and constraints are created automatically

