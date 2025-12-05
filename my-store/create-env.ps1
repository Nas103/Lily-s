# PowerShell script to create .env.local file
# Run this from the my-store directory: .\create-env.ps1

$envContent = @"
# Database (Get your connection string from Supabase, Neon, or Railway)
DATABASE_URL="postgresql://user:password@host:5432/db"

# Admin Configuration
ADMIN_EMAIL="nascode.dev@gmail.com"
ADMIN_PASSWORD="nas|script|1999;richZA"

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
"@

$envContent | Out-File -FilePath ".env.local" -Encoding utf8 -NoNewline
Write-Host "✅ Created .env.local file" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Verify your Supabase database is accessible"
Write-Host "2. Run: npx prisma db push"
Write-Host "3. Restart your dev server: npm run dev"

