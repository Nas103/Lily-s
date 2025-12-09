# Update DATABASE_URL to direct PostgreSQL connection
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Update DATABASE_URL - Direct Connection" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$envFile = ".env.local"

if (-not (Test-Path $envFile)) {
    Write-Host "❌ .env.local not found!" -ForegroundColor Red
    exit 1
}

# Password from user
$password = "nas|1017}R$"
$passwordEncoded = [System.Web.HttpUtility]::UrlEncode($password)

# Build direct connection URL
$newUrl = "postgresql://postgres.tnpspjnxnsfsdllkkgbd:${passwordEncoded}@db.tnpspjnxnsfsdllkkgbd.supabase.co:5432/postgres?sslmode=require"

Write-Host "Updating DATABASE_URL..." -ForegroundColor Yellow
Write-Host "Connection: Direct PostgreSQL (port 5432)" -ForegroundColor Green
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

Write-Host "✅ DATABASE_URL updated!" -ForegroundColor Green
Write-Host ""
Write-Host "New connection string:" -ForegroundColor Cyan
Write-Host "postgresql://postgres.tnpspjnxnsfsdllkkgbd:***@db.tnpspjnxnsfsdllkkgbd.supabase.co:5432/postgres?sslmode=require" -ForegroundColor Gray
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. npx prisma generate" -ForegroundColor White
Write-Host "2. node scripts/verify-tables.js" -ForegroundColor White
Write-Host "3. npm run db:studio" -ForegroundColor White

