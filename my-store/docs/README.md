## Lily Studio — Minimal Commerce Starter

Stack:

- Next.js 14 (App Router, TypeScript, Tailwind)
- Prisma ORM + Supabase-ready PostgreSQL schema
- Zustand cart store with local persistence
- PayFast Checkout flow (API route + client redirect)

### 1. Environment variables

Create `.env.local` with:

```
# Database (required for login/register/admin)
# Get a free PostgreSQL from: https://supabase.com, https://neon.tech, or https://railway.app
DATABASE_URL="postgresql://user:password@host:5432/db"

# Admin Configuration
ADMIN_EMAIL="nascode.dev@gmail.com"
ADMIN_PASSWORD="your-strong-admin-password"

# AI Configuration
OPENAI_API_KEY="sk-proj-..."
ANTHROPIC_API_KEY="sk-ant-..."

# Email Configuration (Resend)
RESEND_API_KEY="re_..."
SUPPORT_TO_EMAIL="nascode.dev@gmail.com"
SUPPORT_FROM_EMAIL="support@your-domain.com"

# PayFast Configuration
PAYFAST_MERCHANT_ID="29096901"
PAYFAST_MERCHANT_KEY="e5rwnchb6wocv"
PAYFAST_PASSPHRASE="Nascode103_GITHUB"
PAYFAST_SANDBOX="true"  # Set to "false" for production

# Site URL (update after hosting)
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

> **Important:** See `DATABASE_SETUP.md` for detailed database setup instructions.
> 
> **Important:** After hosting your web app, update `NEXT_PUBLIC_SITE_URL` with your production URL. Also update the notify URL in your PayFast dashboard to point to `https://yourdomain.com/api/payfast/notify`.

### 2. Install & run

```bash
npm install
npx prisma generate  # Generate Prisma client
npx prisma db push   # Create database tables
npm run dev
```

> **Note:** If you see "Database is not configured", make sure:
> 1. `DATABASE_URL` is set in `.env.local`
> 2. You've run `npx prisma generate`
> 3. You've run `npx prisma db push` to create the tables

Visit `http://localhost:3000` to browse the demo catalog, add items to the cart, then head to `/checkout` to trigger the PayFast payment flow.

### 3. PayFast Configuration

1. **Set up your PayFast account:**
   - Log in to your PayFast dashboard
   - Go to Settings > Integration
   - Set your **Notify URL** to: `https://yourdomain.com/api/payfast/notify` (after hosting)
   - Enable **Instant Transaction Notification (ITN)**

2. **Security Passphrase:**
   - ✅ Passphrase is configured: `Nascode103_GITHUB`
   - Ensure this matches the passphrase in your PayFast dashboard
   - This adds an extra layer of security to payment verification

3. **Testing:**
   - Use `PAYFAST_SANDBOX="true"` for testing
   - PayFast sandbox allows you to test payments without real transactions
   - Set to `"false"` when ready for production

### 4. Next steps

- Connect Supabase auth & storage
- Build dedicated product detail pages
- Add Algolia search & admin dashboard
- Hook up real wishlist/cart persistence at the database level
- Replace Unsplash placeholders with brand photography

Have fun shipping ✨

