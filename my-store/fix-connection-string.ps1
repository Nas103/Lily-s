# Fix DATABASE_URL with properly encoded password
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fix DATABASE_URL - Direct Connection" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$envFile = ".env.local"

if (-not (Test-Path $envFile)) {
    Write-Host "❌ .env.local not found!" -ForegroundColor Red
    exit 1
}

# Password with URL encoding
$password = "nas|1017}R$"
$encoded = $password -replace '\|', '%7C' -replace '\}', '%7D' -replace '\$', '%24'

# Build direct connection URL
$newUrl = "postgresql://postgres.tnpspjnxnsfsdllkkgbd:${encoded}@db.tnpspjnxnsfsdllkkgbd.supabase.co:5432/postgres?sslmode=require"

Write-Host "Updating DATABASE_URL..." -ForegroundColor Yellow
Write-Host "Password encoded: nas%7C1017%7DR%24" -ForegroundColor Gray
Write-Host ""

# Read the file
$content = Get-Content $envFile

# Replace DATABASE_URL line
$newContent = $content | ForEach-Object {
    if ($_ -match "^DATABASE_URL=") {
        "DATABASE_URL=`"$newUrl`""
    } else {
        $_
    }
}

# Write back
$newContent | Set-Content $envFile -Encoding UTF8

Write-Host "✅ DATABASE_URL updated with encoded password!" -ForegroundColor Green
Write-Host ""
Write-Host "Connection: Direct PostgreSQL (port 5432)" -ForegroundColor Cyan
Write-Host "Project: tnpspjnxnsfsdllkkgbd" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. npx prisma generate" -ForegroundColor White
Write-Host "2. node scripts/verify-tables.js" -ForegroundColor White
Write-Host "3. npm run db:studio" -ForegroundColor White

