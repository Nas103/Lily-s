# Database Setup Script for Supabase
# This script helps you set up your database schema

Write-Host "🔧 Database Setup Script" -ForegroundColor Cyan
Write-Host ""

# Check if DATABASE_URL is set
if (-not $env:DATABASE_URL) {
    Write-Host "⚠️  DATABASE_URL environment variable is not set." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "You have two options:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Option 1: Set DATABASE_URL locally (for testing)" -ForegroundColor Cyan
    Write-Host "  1. Get your Supabase connection string from:" -ForegroundColor White
    Write-Host "     - Supabase Dashboard → Settings → Database → Connection String" -ForegroundColor Gray
    Write-Host "  2. Create .env.local file with:" -ForegroundColor White
    Write-Host "     DATABASE_URL=`"your-connection-string`"" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Option 2: Use Vercel environment variables (for deployment)" -ForegroundColor Cyan
    Write-Host "  1. Make sure DATABASE_URL is set in Vercel Dashboard" -ForegroundColor White
    Write-Host "  2. Pull env vars: vercel env pull .env.local" -ForegroundColor Gray
    Write-Host ""
    
    $continue = Read-Host "Do you want to continue anyway? (y/n)"
    if ($continue -ne "y") {
        Write-Host "Exiting..." -ForegroundColor Yellow
        exit
    }
}

Write-Host "📦 Generating Prisma Client..." -ForegroundColor Cyan
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Prisma client generated" -ForegroundColor Green
Write-Host ""

if ($env:DATABASE_URL) {
    Write-Host "🗄️  Pushing database schema to Supabase..." -ForegroundColor Cyan
    npx prisma db push
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database schema pushed successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📊 Opening Prisma Studio to verify..." -ForegroundColor Cyan
        Write-Host "   (Close Prisma Studio when done)" -ForegroundColor Gray
        Start-Sleep -Seconds 2
        npx prisma studio
    } else {
        Write-Host "❌ Failed to push database schema" -ForegroundColor Red
        Write-Host "   Check your DATABASE_URL connection string" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "⚠️  Skipping database push (DATABASE_URL not set)" -ForegroundColor Yellow
    Write-Host "   Set DATABASE_URL and run: npx prisma db push" -ForegroundColor Gray
}

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green

