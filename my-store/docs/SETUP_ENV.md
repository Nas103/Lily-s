# Environment Setup

Create a `.env.local` file in the `my-store` folder with this content:

```env
# Database (Get your connection string from Supabase, Neon, or Railway)
DATABASE_URL="postgresql://user:password@host:5432/db"

# Admin Configuration
ADMIN_EMAIL="your-admin@email.com"
ADMIN_PASSWORD="your-strong-admin-password"

# AI Configuration
OPENAI_API_KEY="sk-proj-..."
ANTHROPIC_API_KEY="sk-ant-..."

# Email Configuration (Resend - get your key from https://resend.com)
RESEND_API_KEY=""
SUPPORT_TO_EMAIL="nascode.dev@gmail.com"
SUPPORT_FROM_EMAIL="support@your-domain.com"

# PayFast Configuration
PAYFAST_MERCHANT_ID="29096901"
PAYFAST_MERCHANT_KEY="e5rwnchb6wocv"
PAYFAST_PASSPHRASE="Nascode103_GITHUB"
PAYFAST_SANDBOX="true"

# Site URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

**Important:** The password in DATABASE_URL is URL-encoded:
- `|` = `%7C`
- `}` = `%7D`
- `$` = `%24`

After creating `.env.local`, run:
```bash
npx prisma db push
```

