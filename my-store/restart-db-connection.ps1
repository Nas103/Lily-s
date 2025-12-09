# Restart Database Connection - Clean Reset
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Restart Database Connection" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Clear Prisma cache
Write-Host "Step 1: Clearing Prisma cache..." -ForegroundColor Yellow
Remove-Item -Recurse -Force node_modules\.prisma -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules\@prisma\client -ErrorAction SilentlyContinue
Write-Host "✅ Prisma cache cleared" -ForegroundColor Green
Write-Host ""

# Step 2: Verify DATABASE_URL
Write-Host "Step 2: Verifying DATABASE_URL..." -ForegroundColor Yellow
if (-not (Test-Path .env.local)) {
    Write-Host "❌ .env.local not found!" -ForegroundColor Red
    exit 1
}

$dbUrl = (Get-Content .env.local | Select-String "DATABASE_URL").ToString()
if ($dbUrl) {
    if ($dbUrl -match "tnpspjnxnsfsdllkkgbd") {
        Write-Host "✅ Correct project ID found" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Project ID might be wrong" -ForegroundColor Yellow
    }
    
    if ($dbUrl -match ":6543") {
        Write-Host "✅ Using Connection Pooling (port 6543)" -ForegroundColor Green
    } elseif ($dbUrl -match ":5432") {
        Write-Host "⚠️  Using direct connection (port 5432)" -ForegroundColor Yellow
        Write-Host "   Consider switching to Connection Pooling for better reliability" -ForegroundColor Gray
    }
} else {
    Write-Host "❌ DATABASE_URL not found in .env.local" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 3: Regenerate Prisma Client
Write-Host "Step 3: Regenerating Prisma Client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma Client" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Prisma Client regenerated" -ForegroundColor Green
Write-Host ""

# Step 4: Test connection
Write-Host "Step 4: Testing database connection..." -ForegroundColor Yellow
node scripts/verify-tables.js
$connectionOk = $LASTEXITCODE -eq 0

Write-Host ""
if ($connectionOk) {
    Write-Host "✅ Database connection successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Start Prisma Studio: npm run db:studio" -ForegroundColor White
    Write-Host "2. Start your app: npm run dev" -ForegroundColor White
} else {
    Write-Host "⚠️  Connection test failed" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Possible issues:" -ForegroundColor Yellow
    Write-Host "1. Tables don't exist - run: npx prisma db push" -ForegroundColor White
    Write-Host "2. Wrong DATABASE_URL - check .env.local" -ForegroundColor White
    Write-Host "3. Network/firewall blocking connection" -ForegroundColor White
    Write-Host ""
    Write-Host "If tables don't exist, create them using:" -ForegroundColor Cyan
    Write-Host "- SQL script: docs/create-tables.sql" -ForegroundColor White
    Write-Host "- Or: npx prisma db push (ignore 'prepared statement' error)" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Database connection restart complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

