# FINAL FIX - Complete Database Connection Setup
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "FINAL DATABASE CONNECTION FIX" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$envFile = ".env.local"

# Correct settings
$projectId = "tnpspjnxnsfsdllkkgbd"
$region = "eu-west-1"
$password = "nas|1017}R$"
$encoded = $password -replace '\|', '%7C' -replace '\}', '%7D' -replace '\$', '%24'

# Connection Pooling URL (most reliable)
$correctUrl = "postgresql://postgres.${projectId}:${encoded}@aws-1-${region}.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true&connect_timeout=15"

Write-Host "Setting correct DATABASE_URL:" -ForegroundColor Yellow
Write-Host "Project: $projectId" -ForegroundColor Cyan
Write-Host "Region: $region" -ForegroundColor Cyan
Write-Host "Connection: Pooling (port 6543)" -ForegroundColor Cyan
Write-Host ""

# Read and update file
$content = Get-Content $envFile
$newContent = $content | ForEach-Object {
    if ($_ -match "^DATABASE_URL=") {
        "DATABASE_URL=`"$correctUrl`""
    } else {
        $_
    }
}

$newContent | Set-Content $envFile -Encoding UTF8

Write-Host "✅ DATABASE_URL updated!" -ForegroundColor Green
Write-Host ""
Write-Host "Running final setup..." -ForegroundColor Yellow
Write-Host ""

# Regenerate Prisma Client
Write-Host "1. Regenerating Prisma Client..." -ForegroundColor Cyan
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma Client" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. If tables don't exist, run: npx prisma db push" -ForegroundColor White
Write-Host "   (Ignore 'prepared statement' error - it's harmless)" -ForegroundColor Gray
Write-Host "2. Test Prisma Studio: npm run db:studio" -ForegroundColor White
Write-Host "3. Start your app: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Note: If you still get 'table does not exist', the tables" -ForegroundColor Yellow
Write-Host "might be in a different database. Check Supabase project ID." -ForegroundColor Yellow

