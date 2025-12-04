# Database Setup Guide

## Quick Start

1. **Get a PostgreSQL database** (free options):
   - [Supabase](https://supabase.com) - Free tier with 500MB
   - [Neon](https://neon.tech) - Serverless Postgres, free tier
   - [Railway](https://railway.app) - Free tier available

2. **Create `.env.local` file** in the `my-store` folder:

```env
DATABASE_URL="postgresql://user:password@host:5432/db"
ADMIN_EMAIL="nascode.dev@gmail.com"
ADMIN_PASSWORD="nas|script|1999;richZA"
OPENAI_API_KEY="sk-proj-..."
ANTHROPIC_API_KEY="sk-ant-..."
RESEND_API_KEY="re_..."
SUPPORT_TO_EMAIL="nascode.dev@gmail.com"
SUPPORT_FROM_EMAIL="support@your-domain.com"
PAYFAST_MERCHANT_ID="29096901"
PAYFAST_MERCHANT_KEY="e5rwnchb6wocv"
PAYFAST_PASSPHRASE="Nascode103_GITHUB"
PAYFAST_SANDBOX="true"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

3. **Generate Prisma client and push schema**:

```bash
npx prisma generate
npx prisma db push
```

4. **Create your admin user** (the first user with `ADMIN_EMAIL` will automatically be an admin when they register).

5. **Restart your dev server**:

```bash
npm run dev
```

## Troubleshooting

- **"Database is not configured"**: Make sure `DATABASE_URL` is set in `.env.local` and you've run `npx prisma generate`
- **"Prisma Client not found"**: Run `npx prisma generate` again
- **Connection errors**: Check your `DATABASE_URL` format and that your database is accessible

