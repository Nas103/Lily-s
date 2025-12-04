## Lily Studio — Minimal Commerce Starter

Stack:

- Next.js 14 (App Router, TypeScript, Tailwind)
- Prisma ORM + Supabase-ready PostgreSQL schema
- Zustand cart store with local persistence
- PayFast Checkout flow (API route + client redirect)

### 1. Environment variables

Create `.env.local` with:

```
DATABASE_URL="postgresql://user:password@host:5432/db"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="public-anon-key"
SUPABASE_SERVICE_ROLE_KEY="service-role-key"

# PayFast Configuration
PAYFAST_MERCHANT_ID="29096901"
PAYFAST_MERCHANT_KEY="e5rwnchb6wocv"
PAYFAST_PASSPHRASE="Nascode103_GITHUB"
PAYFAST_SANDBOX="true"  # Set to "false" for production

# Site URL (update after hosting)
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

> Add real values from Supabase + PayFast dashboard before deploying.
> 
> **Important:** After hosting your web app, update `NEXT_PUBLIC_SITE_URL` with your production URL. Also update the notify URL in your PayFast dashboard to point to `https://yourdomain.com/api/payfast/notify`.

### 2. Install & run

```bash
npm install
npx prisma db push   # or migrate dev when ready
npm run dev
```

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

