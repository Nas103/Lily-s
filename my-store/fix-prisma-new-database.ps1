# Fix Prisma for New Database
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fix Prisma for New Database" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Clear Prisma cache
Write-Host "Step 1: Clearing Prisma cache..." -ForegroundColor Yellow
Remove-Item -Recurse -Force node_modules\.prisma -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules\@prisma\client -ErrorAction SilentlyContinue
Write-Host "✅ Cache cleared" -ForegroundColor Green
Write-Host ""

# Step 2: Verify DATABASE_URL
Write-Host "Step 2: Verifying DATABASE_URL..." -ForegroundColor Yellow
$dbUrl = Get-Content .env.local | Select-String "DATABASE_URL"
if ($dbUrl -match "zcsosspieuolzswujvpw") {
    Write-Host "✅ Correct project ID: zcsosspieuolzswujvpw" -ForegroundColor Green
} else {
    Write-Host "❌ Wrong project ID! Expected: zcsosspieuolzswujvpw" -ForegroundColor Red
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

# Step 4: Verify schema
Write-Host "Step 4: Verifying Prisma schema..." -ForegroundColor Yellow
if (Test-Path "prisma\schema.prisma") {
    Write-Host "✅ Schema file found" -ForegroundColor Green
} else {
    Write-Host "❌ Schema file not found!" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "✅ Prisma setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Start Prisma Studio: npm run db:studio" -ForegroundColor White
Write-Host "2. You should see all tables from the new database" -ForegroundColor White
Write-Host ""
Write-Host "If Prisma Studio still shows errors:" -ForegroundColor Yellow
Write-Host "- Check that DATABASE_URL is correct in .env.local" -ForegroundColor White
Write-Host "- Verify tables exist in Supabase Dashboard" -ForegroundColor White
Write-Host "- Make sure you're using Transaction Pooler (port 6543)" -ForegroundColor White

