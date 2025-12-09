# Switch back to Connection Pooling (more reliable)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Switch to Connection Pooling" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$envFile = ".env.local"

# Password with URL encoding
$password = "nas|1017}R$"
$encoded = $password -replace '\|', '%7C' -replace '\}', '%7D' -replace '\$', '%24'

# Connection Pooling URL (port 6543, more reliable)
$poolingUrl = "postgresql://postgres.tnpspjnxnsfsdllkkgbd:${encoded}@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true&connect_timeout=15"

Write-Host "Switching to Connection Pooling..." -ForegroundColor Yellow
Write-Host "This is more reliable and doesn't require IP whitelisting" -ForegroundColor Green
Write-Host ""

# Read the file
$content = Get-Content $envFile

# Replace DATABASE_URL line
$newContent = $content | ForEach-Object {
    if ($_ -match "^DATABASE_URL=") {
        "DATABASE_URL=`"$poolingUrl`""
    } else {
        $_
    }
}

# Write back
$newContent | Set-Content $envFile -Encoding UTF8

Write-Host "✅ DATABASE_URL updated to Connection Pooling!" -ForegroundColor Green
Write-Host ""
Write-Host "Connection: Pooling (port 6543)" -ForegroundColor Cyan
Write-Host "Project: tnpspjnxnsfsdllkkgbd" -ForegroundColor Cyan
Write-Host "Region: eu-west-1" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. npx prisma generate" -ForegroundColor White
Write-Host "2. npx prisma db push" -ForegroundColor White
Write-Host "3. npm run db:studio" -ForegroundColor White

